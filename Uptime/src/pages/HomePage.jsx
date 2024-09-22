// src/pages/HomePage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Import the authentication context

const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirect to the dashboard if the user is authenticated
      navigate("/dashboard");
    } else {
      // Redirect to the registration page if not authenticated
      navigate("/register");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[url('./assets/background.jpg')] bg-cover ">
      {/* Navbar */}
      <nav className="w-full bg-gray-900/50">
        <div className="w-full max-w-6xl mx-auto p-6 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <img src="src/assets/logo.png" className="h-12" alt="Logo" />
            <img
              src="src/assets/logo-text.png"
              className="h-8 ml-3"
              alt="Logo Text"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-white block md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              ></path>
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-white px-4 py-2 bg-red-600/20 border-2 border-red-500 rounded-lg hover:bg-red-700/50"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white px-8 py-2 border border-blue-500 bg-blue-950 rounded-lg hover:bg-blue-800/20"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white px-8 py-2 border border-blue-500 rounded-lg hover:bg-blue-800/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800/40">
            <div className="flex flex-col items-center space-y-4 py-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-white px-4 py-2 bg-red-600/20 border-2 border-red-500 rounded-lg hover:bg-red-700/50"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white px-8 py-2 border border-blue-500 bg-blue-950 rounded-lg hover:bg-blue-800/20"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white px-8 py-2 border border-blue-500 rounded-lg hover:bg-blue-800/20"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Section */}
      <main className="flex flex-grow items-center justify-center w-full max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          {/* Image Section */}
          <div className="flex-1">
            <img
              src="src/assets/landing-image.jpg"
              alt="Monitoring"
              className="w-full max-w-md rounded-2xl"
            />
          </div>

          {/* Text Section */}
          <div className="flex-1 text-center md:text-left md:pl-12">
            <h2 className="text-4xl font-bold text-white mb-4 mt-4 md:mt-0">
              Monitor Your{" "}
              <span className=" font-black bg-gradient-to-r from-blue-500 to-cyan-300 text-transparent bg-clip-text">
                Websites
              </span>{" "}
              with Ease
            </h2>
            <p className="text-lg text-white mb-8">
              Keep track of your websites' performance and uptime with our
              easy-to-use monitoring tool.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-16 py-3 bg-white/10 border-2 border-cyan-500 text-cyan-300 font-bold rounded-lg shadow-lg hover:bg-white/20"
            >
              GET STARTED
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800/60 text-white py-4 text-center">
        <p>&copy; 2024 Website Monitor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
