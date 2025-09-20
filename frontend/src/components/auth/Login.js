import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthModern.css';
import backgroundImage from '../../assets/sl.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });
      const { user, token, redirect_to } = response.data.data;

      handleLogin(user, token);
      localStorage.setItem('token', token);

      toast.success('Login successful!');
      setTimeout(() => navigate(redirect_to), 1500);
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="auth-modern-container">
      {/* Left side: Illustration or text */}
      <div className="auth-modern-left"
             style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="auth-text">
          <h2>Welcome Back!</h2>
          <p>Access your account and manage your products, orders, and more with ease.</p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="auth-modern-right">
        <div className="auth-form-box">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          <div className="auth-divider">or login with</div>

          <div className="auth-social-buttons">
            <button className="google-btn">Google</button>
            <button className="facebook-btn">Facebook</button>
          </div>

          <div className="auth-bottom-text">
            Don't have an account? <a href="/register">Register</a>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default Login;
