import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/AdminSidebar.css';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/login'); // Redirect to login
  };

  return (
    <div className="admin-sidebar">

  <div className="admin-brand">
    <span className="brand-icon">🛒</span>
    <span className="brand-text">ECOMINSIGHT</span>
  </div>

  <h2 className="admin-title">
    <Link to="/admin" className="admin-title-link">Admin Panel</Link>
  </h2>

  <ul>
    <li><Link to="/admin/users">Users</Link></li>
    <li><Link to="/admin/orders">Orders</Link></li>
    <li><Link to="/admin/products">Products</Link></li>
      <li><Link to="/admin/brands">Brands</Link></li> {/* 🆕 */}
     <li>  <Link to="/admin/categories">Manage Categories</Link></li>
     <li><Link to="/admin/subcategories">Manage Subcategories</Link></li>


  <li><Link to="/admin/payments">Payments</Link></li>



  </ul>

  <div className="logout-section">
    <button onClick={handleLogout} className="logout-btn">Logout</button>
  </div>
</div>

  );
};

export default AdminSidebar;
