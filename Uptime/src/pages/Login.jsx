import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://webalert-mern.onrender.com/api/auth/login",
        { email, password }
      );
      const { token, username } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="flex items-center relative justify-center min-h-screen bg-[url('/background.jpg')] bg-cover">
      <Link to="/">
        <img
          src="/logo.png"
          className="absolute top-0 left-0 h-16"
          alt="logo"
        />
      </Link>
      <div className="w-full max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center md:justify-between p-8">
        {/* Left Side: Form */}
        <div className="md:w-1/2 w-full">
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-3xl font-semibold text-center md:text-left text-white mb-6">
              <span className="font-black text-4xl bg-gradient-to-r from-blue-500 to-cyan-300 text-transparent bg-clip-text">
                Login
              </span>
            </h2>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="block w-full px-4 py-2 mt-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/20 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="block w-full px-4 py-2 mt-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/20 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full mt-4 px-4 py-2 text-white bg-blue-500/40 border-2 border-blue-400 rounded-lg shadow-lg hover:bg-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
            <div className="text-center text-white">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-300 hover:underline">
                  Register here
                </Link>
                .
              </p>
            </div>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="md:w-1/2 w-full h-full">
          <img
            src="/login3.jpg"
            alt="Login"
            className="object-cover rounded-lg mb-4 md:mb-0 md:ml-8 w-80vw md:w-full md:h-[70vh]"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
