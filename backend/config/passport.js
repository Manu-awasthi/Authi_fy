// @ts-nocheck
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import User from "../Model/User.js";

dotenv.config();

// -------------------- SESSION SETUP --------------------
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await User.findById(id);
    done(null, foundUser);
  } catch (err) {
    done(err, null);
  }
});

// -------------------- ENV CHECKS --------------------
console.log("🌍 FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("🔑 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Loaded ✅" : "Missing ❌");
console.log("🔑 GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded ✅" : "Missing ❌");
console.log("🐙 GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID ? "Loaded ✅" : "Missing ❌");
console.log("🧩 MONGODB_URL:", process.env.MONGODB_URL ? "Loaded ✅" : "Missing ❌");

// -------------------- ERROR HANDLERS --------------------
process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err.message);
});

// -------------------- GOOGLE STRATEGY --------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "https://authi-fy.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🚀 GOOGLE CALLBACK HIT");
        console.log("🔗 Callback URL:", process.env.GOOGLE_CALLBACK_URL);
        console.log("🔑 Access Token:", accessToken ? "Received ✅" : "Missing ❌");
        console.log("👤 Google Profile ID:", profile.id);

        const email = profile.emails?.[0]?.value || `${profile.id}@noemail.authify.com`;

        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          console.log("✅ Found existing user by Google ID");
          return done(null, user);
        }

        // If existing email found, link accounts
        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser) {
          existingEmailUser.googleId = profile.id;
          await existingEmailUser.save();
          console.log("🔗 Linked Google to existing email user");
          return done(null, existingEmailUser);
        }

        // Create a new user
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName || "Unnamed User",
          email,
        });

        console.log("🆕 Created new user from Google:", newUser.email);
        return done(null, newUser);
      } catch (err) {
        console.error("🔥 Error in GoogleStrategy:", err.message);
        if (err.oauthError) {
          console.error("🔍 Google OAuth error body:", err.oauthError.toString());
        }
        console.error("Full error:", err);
        done(err, null);
      }
    }
  )
);

// -------------------- GITHUB STRATEGY --------------------
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || "https://authi-fy.onrender.com/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🚀 GITHUB CALLBACK HIT");
        console.log("👤 GitHub Profile ID:", profile.id);

        const email = profile.emails?.[0]?.value || `${profile.username || profile.id}@noemail.authify.com`;

        let user = await User.findOne({ githubId: profile.id });
        if (user) {
          console.log("✅ Found existing user by GitHub ID");
          return done(null, user);
        }

        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser) {
          existingEmailUser.githubId = profile.id;
          await existingEmailUser.save();
          console.log("🔗 Linked GitHub to existing email user");
          return done(null, existingEmailUser);
        }

        const newUser = await User.create({
          githubId: profile.id,
          name: profile.displayName || "Unnamed User",
          email,
        });

        console.log("🆕 Created new user from GitHub:", newUser.email);
        return done(null, newUser);
      } catch (err) {
        console.error("🔥 Error in GitHubStrategy:", err.message);
        if (err.oauthError) {
          console.error("🔍 GitHub OAuth error body:", err.oauthError.toString());
        }
        console.error("Full error:", err);
        done(err, null);
      }
    }
  )
);
