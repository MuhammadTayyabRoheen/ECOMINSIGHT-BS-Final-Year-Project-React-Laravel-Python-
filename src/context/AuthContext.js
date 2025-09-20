import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
});

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // 🆕 Add loading state

  useEffect(() => {
 const fetchUser = async () => {
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    setLoading(false);
    return;
  }

  try {
    // Try admin profile first
    let res = await axios.get('http://127.0.0.1:8000/api/admin/profile', {
      headers: { Authorization: `Bearer ${storedToken}` }
    });

    setUser(res.data);
    setToken(storedToken);
  } catch (adminErr) {
    try {
      // If failed, try user profile
      const res = await axios.get('http://127.0.0.1:8000/api/user/profile', {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      setUser(res.data);
      setToken(storedToken);
    } catch (userErr) {
      console.error("Auth restore failed:", userErr);
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    }
  } finally {
    setLoading(false);
  }
};

  fetchUser();
}, []);


const login = (userData, jwtToken) => {
  setUser(userData);
  setToken(jwtToken);
  localStorage.setItem('token', jwtToken);
  localStorage.setItem('user', JSON.stringify(userData)); // ✅ Add this line
};

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ✅ Add this
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
