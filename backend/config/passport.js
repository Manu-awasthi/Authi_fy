// @ts-nocheck
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import User from "../Model/User.js";

dotenv.config();

// -------------------- SESSION SERIALIZATION --------------------
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await User.findById(id);
    done(null, foundUser);
  } catch (err) {
    console.error("❌ Error in deserializeUser:", err);
    done(err, null);
  }
});

// -------------------- HELPER: ENV VALIDATION --------------------
function validateEnvVars(provider) {
  const requiredVars =
    provider === "google"
      ? ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]
      : ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"];

  for (const key of requiredVars) {
    if (!process.env[key]) {
      console.error(`❌ Missing ${key} in environment variables`);
      throw new Error(`Missing ${key}`);
    }
  }
}

// -------------------- DYNAMIC CALLBACK HANDLER --------------------
const isProd = process.env.NODE_ENV === "production";
const baseURL = isProd
  ? "https://authi-fy.onrender.com"
  : "http://localhost:5000";

// -------------------- GOOGLE STRATEGY --------------------
try {
  validateEnvVars("google");

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          `${baseURL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("🚀 GOOGLE CALLBACK HIT");
          console.log("🔗 Using callback:", process.env.GOOGLE_CALLBACK_URL || `${baseURL}/auth/google/callback`);
          console.log("👤 Google profile ID:", profile.id);

          const email = profile.emails?.[0]?.value;

          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            console.log("✅ Found existing user by Google ID");
            return done(null, user);
          }

          if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              existingUser.googleId = profile.id;
              await existingUser.save();
              console.log("🔗 Linked Google to existing email user");
              return done(null, existingUser);
            }
          }

          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName || "Unnamed User",
            email,
          });

          console.log("🆕 Created new user from Google:", newUser.email);
          done(null, newUser);
        } catch (err) {
          console.error("🔥 Error in GoogleStrategy:", err.message);
          if (err.oauthError) {
            console.error("🔍 Google OAuth error body:", err.oauthError.toString());
          }
          done(err, null);
        }
      }
    )
  );
} catch (setupErr) {
  console.error("🚨 Google Strategy Setup Failed:", setupErr.message);
}

// -------------------- GITHUB STRATEGY --------------------
try {
  validateEnvVars("github");

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          `${baseURL}/auth/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("🚀 GITHUB CALLBACK HIT");
          console.log("👤 GitHub profile ID:", profile.id);

          const email =
            profile.emails?.[0]?.value ||
            `${profile.username || profile.id}@noemail.githubuser.com`;

          let user = await User.findOne({ githubId: profile.id });
          if (user) {
            console.log("✅ Found existing user by GitHub ID");
            return done(null, user);
          }

          const existingUser = await User.findOne({ email });
          if (existingUser) {
            existingUser.githubId = profile.id;
            await existingUser.save();
            console.log("🔗 Linked GitHub to existing email user");
            return done(null, existingUser);
          }

          const newUser = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username || "Unnamed User",
            email,
          });

          console.log("🆕 Created new user from GitHub:", newUser.email);
          done(null, newUser);
        } catch (err) {
          console.error("🔥 Error in GitHubStrategy:", err.message);
          if (err.oauthError) {
            console.error("🔍 GitHub OAuth error body:", err.oauthError.toString());
          }
          done(err, null);
        }
      }
    )
  );
} catch (setupErr) {
  console.error("🚨 GitHub Strategy Setup Failed:", setupErr.message);
}
