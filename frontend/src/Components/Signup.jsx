import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";
import { FaGoogle, FaGithub } from "react-icons/fa";

const BACKEND_URL = "https://authi-fy.onrender.com"; // Backend URL

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", age: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/", form); // your backend signup endpoint
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleGithubSignup = () => {
    window.location.href = `${BACKEND_URL}/auth/github`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-red-950 text-white px-4"
    >
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md border border-red-600 rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-red-500 mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Join us today — it's fast and easy
        </p>

        {/* OAuth Buttons */}
        <div className="flex flex-col space-y-4 mb-8">
          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            <FaGoogle size={22} className="text-red-600" />
            Sign up with Google
          </button>

          <button
            onClick={handleGithubSignup}
            className="flex items-center justify-center gap-3 bg-gray-800 border border-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            <FaGithub size={22} />
            Sign up with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-8">
          <div className="flex-grow h-px bg-gray-700" />
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-700" />
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition duration-300"
          >
            Create Account
          </button>
        </form>

        {/* Redirect to login */}
        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default Signup;
