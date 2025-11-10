import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaGithub, FaGoogle, FaShieldAlt } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-red-950 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-black bg-opacity-80 shadow-md sticky top-0 z-50 backdrop-blur-md">
        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold tracking-wide text-red-500 cursor-pointer"
          onClick={() => navigate("/")}
        >
          AUTHIFY
        </motion.h1>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4"
        >
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md"
          >
            Sign Up
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center text-center flex-1 px-6"
      >
        <h2 className="text-6xl md:text-7xl font-extrabold text-red-500 mb-4 tracking-wider drop-shadow-lg">
          AUTHIFY 🔐
        </h2>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-8">
          The ultimate authentication solution for modern web apps.  
          <span className="text-red-400 font-semibold"> Secure. Scalable. Seamless.</span>
        </p>

        <div className="flex gap-6 mt-6 flex-wrap justify-center">
          <button
            onClick={() => navigate("/signup")}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 shadow-lg hover:shadow-red-700/30 transition-all"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 shadow-lg hover:shadow-gray-700/30 transition-all"
          >
            Login
          </button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="bg-black bg-opacity-60 py-16 px-6 md:px-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-red-500 mb-12"
        >
          Why Choose Authify?
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <FaLock className="text-red-500 text-4xl mb-3" />,
              title: "Strong Security",
              desc: "Your users' data is protected with industry-leading encryption and JWT-based sessions.",
            },
            {
              icon: <FaGoogle className="text-red-500 text-4xl mb-3" />,
              title: "One-Click OAuth",
              desc: "Seamless Google and GitHub login integration for a frictionless experience.",
            },
            {
              icon: <FaShieldAlt className="text-red-500 text-4xl mb-3" />,
              title: "Scalable & Reliable",
              desc: "Built on Node.js, MongoDB, and Passport.js for performance and flexibility.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-900 bg-opacity-50 border border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-red-600/20 hover:border-red-600 transition-all text-center"
            >
              {feature.icon}
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-90 py-6 text-center text-gray-500 text-sm border-t border-gray-800">
        <p>
          © {new Date().getFullYear()} <span className="text-red-500 font-semibold">Authify</span>.  
          All rights reserved. Crafted with ❤️ using React & Node.js.
        </p>
      </footer>
    </div>
  );
};

export default Home;
