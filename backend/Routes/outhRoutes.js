import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL ;


// GOOGLE AUTH

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      const isProd = process.env.NODE_ENV === "production";

      res.cookie("token", token, {
        httpOnly:true, 
        secure: true, 
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

      console.log("✅ Google Login Success:", req.user.email);
      res.redirect(`${FRONTEND_URL}/dashboard`);
    } catch (err) {
      console.error("Error generating token:", err);
      res.redirect("/auth/failure");
    }
  }
);


// GITHUB AUTH

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      const isProd = process.env.NODE_ENV === "production";

      res.cookie("token", token, {
        httpOnly:true,
        secure: isProd,
        sameSite: isProd ? "strict" : "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log("GitHub Login Success:", req.user.email);
      res.redirect(`${FRONTEND_URL}/dashboard`);
    } catch (err) {
      console.error("Error generating token:", err);
      res.redirect("/auth/failure");
    }
  }
);



router.get("/failure", (req, res) => {
  res.status(401).send("Login Failed. Please try again.");
});

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    res.clearCookie("token", {
      path: "/",
      sameSite: "none",
      secure: false,
    });
    res.status(200).send(" Logged out successfully!");
  });
});

export default router;
