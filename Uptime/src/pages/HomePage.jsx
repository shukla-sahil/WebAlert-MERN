// src/pages/HomePage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the authentication context

const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirect to the dashboard if the user is authenticated
      navigate('/dashboard');
    } else {
      // Redirect to the registration page if not authenticated
      navigate('/register');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gradient-to-r from-blue-500 to-purple-600">
      <nav className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">WebAlert</h1>
        <div>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-white px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-white px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">Login</Link>
              <Link to="/register" className="ml-4 text-white px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-4xl font-bold text-white mb-4">Monitor Your Websites with Ease</h2>
        <p className="text-lg text-white mb-8">Keep track of your websites' performance and uptime with our easy-to-use monitoring tool.</p>
        <button onClick={handleGetStarted} className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600">
          Get Started
        </button>
      </main>
      <footer className="w-full bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 Website Monitor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
