import React, { useEffect, useState } from "react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserEdit, FaTrashAlt } from "react-icons/fa";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", age: "" });
  const navigate = useNavigate();

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  // ✅ Delete user
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await API.delete(`/${id}`);
      fetchUsers();
    }
  };

  // ✅ Open Edit Modal
  const handleEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, age: user.age });
  };

  // ✅ Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/${editUser._id}`, form);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Edit failed", err);
      alert("Failed to update user");
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await API.get("http://localhost:5000/auth/logout", { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed. Try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-950 text-white p-6">
      {/* 🔹 Navbar */}
      <nav className="flex justify-between items-center mb-10 bg-black bg-opacity-70 p-4 rounded-xl shadow-lg border border-gray-800 backdrop-blur-md">
        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold tracking-widest text-red-500"
        >
          AUTHIFY DASHBOARD
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all shadow-md"
        >
          <FaSignOutAlt /> Logout
        </motion.button>
      </nav>

      {/* 🔹 Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-950 bg-opacity-80 rounded-xl shadow-2xl border border-gray-800 overflow-x-auto backdrop-blur-md"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-900 border-b border-gray-800 text-gray-300">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Age</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-gray-800 hover:bg-gray-900/70 transition-all"
              >
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-300">{user.email}</td>
                <td className="p-4">{user.age}</td>
                <td className="p-4 flex justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-gray-800 px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-all shadow-sm"
                    onClick={() => handleEdit(user)}
                  >
                    <FaUserEdit className="text-yellow-400" /> Edit
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-red-700 px-4 py-1 rounded-md text-sm font-medium hover:bg-red-800 transition-all shadow-sm"
                    onClick={() => deleteUser(user._id)}
                  >
                    <FaTrashAlt /> Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* 🔹 Edit Modal */}
      <AnimatePresence>
        {editUser && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 border border-red-600 rounded-xl p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
                Edit User
              </h2>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter new name"
                  className="w-full p-3 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:border-red-500"
                  required
                />

                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="Enter new age"
                  className="w-full p-3 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:border-red-500"
                  required
                />

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setEditUser(null)}
                    className="px-5 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 font-semibold transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-center mt-10 text-gray-500 text-sm"
      >
        © {new Date().getFullYear()} <span className="text-red-500 font-semibold">Authify</span>. Secure your world 🔐
      </motion.footer>
    </div>
  );
};

export default Dashboard;
