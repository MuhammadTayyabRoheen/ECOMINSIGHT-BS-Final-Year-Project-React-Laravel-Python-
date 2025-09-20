import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import '../../style/AdminLayout.css'; // ✅ Create this file for styles

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // Auto-toggle sidebar based on screen resize
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Hamburger button for small screens */}
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
          ☰
        </button>
        <div className="admin-inner-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
