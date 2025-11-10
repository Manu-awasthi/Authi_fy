import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import userRoutes from "./Routes/userRoutes.js";
import authRoutes from "./Routes/outhRoutes.js"; 
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();


connectDB();


app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      sameSite: "none", 
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());


app.use("/api/users", userRoutes);
app.use("/auth", authRoutes); 


app.get("/auth/check", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ valid: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
});


app.get("/", (req, res) => {
  res.send(`✅ Server is running at port ${process.env.PORT}`);
});


const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
