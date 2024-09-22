import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext"; // Import the authentication context

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for managing validation error
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      setError("Please enter a valid @gmail.com email address.");
      return;
    }
    try {
      await axios.post("https://webalert-mern.onrender.com/api/auth/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again."); // Display error message
    }
  };

  if (isAuthenticated) {
    navigate("/login", { replace: true });
    return null; // Prevent rendering if already logged in
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('./assets/background.jpg')] bg-cover">
      <Link to="/">
        <img
          src="/assets/logo.png"
          className="absolute top-0 left-0 h-16"
          alt="logo"
        />
      </Link>
      <div className="w-full max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center md:justify-between p-8">
        {/* Left Side: Form */}
        <div className="md:w-1/2 w-full">
          <form onSubmit={handleRegister} className="space-y-6">
            <h2 className="text-3xl font-semibold text-center md:text-left text-white mb-6">
              <span className=" font-black text-4xl bg-gradient-to-r from-blue-500 to-cyan-300 text-transparent bg-clip-text">
                Register
              </span>
            </h2>
            {error && (
              <p className="text-red-300 text-center md:text-left">{error}</p>
            )}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                className="block w-full px-4 py-2 mt-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/20 text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
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
                Register
              </button>
            </div>
            <div className="text-center text-white">
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-300 hover:underline">
                  Login here
                </Link>
                .
              </p>
            </div>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="md:w-1/2 w-full h-full">
          <img
            src="/assets/register.jpg"
            alt="Register"
            className="object-cover rounded-lg mb-4 md:mb-0 md:m-8 w-80vw md:h-[80vh]"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
