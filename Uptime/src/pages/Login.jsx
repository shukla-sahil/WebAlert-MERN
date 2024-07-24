import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, username } = response.data; // Destructure the response data

      localStorage.setItem('token', token);
      localStorage.setItem('username', username); // Store the username

      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 relative">
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full -z-10" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#F3F4F6" d="M0,128L30,106.7C60,85,120,43,180,21.3C240,0,300,0,360,21.3C420,43,480,85,540,106.7C600,128,660,128,720,106.7C780,85,840,43,900,21.3C960,0,1020,0,1080,21.3C1140,43,1200,85,1260,106.7C1320,128,1380,128,1410,128H1440V320H1410C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320H0V128Z"></path>
        </svg>
      </div>
      <div className="relative flex items-center justify-center w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
        <form onSubmit={handleLogin} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Login</h2>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              required
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              required
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
