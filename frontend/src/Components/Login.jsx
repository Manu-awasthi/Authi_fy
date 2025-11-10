import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaGithub } from "react-icons/fa";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000"; // your backend URL

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OAuth Handlers
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleGitHubLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/github`;
  };

  // Email/Password login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/users/login`,
        { email, password },
        { withCredentials: true } // sends cookies if your backend uses sessions
      );

      console.log("✅ Login success:", data);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-red-950 text-white px-4"
    >
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md border border-red-600 rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10">
        <h1 className="text-4xl font-extrabold text-center text-red-500 mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-400 mb-8">Sign in to your account</p>

        {/* OAuth Buttons */}
        <div className="flex flex-col space-y-4 mb-8">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            <FaGoogle size={22} className="text-red-600" />
            Continue with Google
          </button>

          <button
            onClick={handleGitHubLogin}
            className="flex items-center justify-center gap-3 bg-gray-800 border border-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            <FaGithub size={22} />
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-8">
          <div className="flex-grow h-px bg-gray-700" />
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-700" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
