import React from 'react';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import '../../style/AdminDashboard.css';
import UserActivityLog from './UserActivityLog';
const AdminDashboardPage = () => (
  <AdminLayout>
    <AdminDashboard />
<UserActivityLog />

  </AdminLayout>
);

export default AdminDashboardPage;
