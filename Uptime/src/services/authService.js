import axios from 'axios';

const API = axios.create({ baseURL: '/api/auth' });

export const register = async (userData) => {
  const response = await API.post('/register', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await API.post('/login', userData);
  return response.data;
};

