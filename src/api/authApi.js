import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Ensure this matches your Laravel API URL

export const register = (data) => {
  return axios.post(`${API_URL}/register`, data);
};

export const login = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

export const getAdminProfile = (token) => {
  return axios.get(`${API_URL}/admin/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getUserProfile = (token) => {
  return axios.get(`${API_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
