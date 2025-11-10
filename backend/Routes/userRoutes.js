import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import User from '../Model/User.js';

const router = express.Router();
router.use(cookieParser());

//  SIGNUP
router.post("/", async (req, res) => {
  try {
    const { name, password, age, email } = req.body;

    if (!name || !age || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({ name, password: hashedPass, age, email });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password or email" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message })
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

//  GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// GET USER BY ID
router.get("/:id", async (req, res) => {
  try {
    const userFind = await User.findById(req.params.id);
    if (!userFind)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(userFind);
  } catch (err) {
    res.status(400).json({ message: "Invalid user ID", error: err.message });
  }
});

// UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const userUpdate = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(userUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//  DELETE USER
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

export default router;
