// @ts-nocheck
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import User from "../Model/User.js";

dotenv.config();


// SESSION SERIALIZATION

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

console.log("🌍 FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("🔑 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Loaded" : "Missing");
console.log("🐙 GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID ? "Loaded" : "Missing");
console.log("🧩 MONGODB_URL:", process.env.MONGODB_URL ? "Loaded" : "Missing");


// GOOGLE STRATEGY
process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err.message);
});


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile.id);

        
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log("Found by Google ID");
          return done(null, user);
        }

        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });

          if (user) {
            
            user.googleId = profile.id;
            await user.save();
            console.log("Linked Google account to existing user");
            return done(null, user);
          }
        }

       
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: email,
        });

        console.log("Created new user from Google");
        done(null, newUser);
      } catch (err) {
        console.error("Error in GoogleStrategy:", err);
        done(err, null);
      }
    }
  )
);


passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://authi-fy.onrender.com/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GitHub profile:", profile.id);

       
        let user = await User.findOne({ githubId: profile.id });
        if (user) {
          console.log("Found by GitHub ID");
          return done(null, user);
        }

        
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.githubId = profile.id;
            await user.save();
            console.log("Linked GitHub to existing user");
            return done(null, user);
          }
        }

      
        const newUser = await User.create({
          githubId: profile.id,
          name: profile.displayName,
          email: email,
        });

        console.log("Created new user from GitHub");
        done(null, newUser);
      } catch (err) {
        console.error("Error in GitHubStrategy:", err);
        done(err, null);
      }
    }
  )
);
