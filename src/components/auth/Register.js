import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthModern.css'; // Make sure to create this file
import backgroundImage from '../../assets/sl.jpg';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success('Registration successful');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="auth-modern-container">
      
      {/* Left visual panel */}
      <div className="auth-modern-left"
       style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="auth-text">
          <h2>Simplify Shopping</h2>
          <p>Register once to explore premium shopping deals at your location.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-modern-right">
        <div className="auth-form-box">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>
          </form>

          <div className="auth-divider">or sign up with</div>

          <div className="auth-social-buttons">
            <button className="google-btn">Google</button>
            <button className="facebook-btn">Facebook</button>
          </div>

          <p className="auth-bottom-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default Register;
