import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js 3+
import TopProductsChart from './TopProductsChart';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentOrders();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
setRecentOrders(res.data.data.slice(0, 5)); // use the "data" field inside response
    } catch (err) {
      console.error('Failed to fetch recent orders', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="mb-4 fw-bold">Admin Overview</h2>

      {/* Stats Cards */}
      <div className="row mb-4">
        {[
          { label: 'Products', value: stats.products, color: 'primary' },
          { label: 'Users', value: stats.users, color: 'success' },
          { label: 'Orders', value: stats.orders, color: 'warning' },
          { label: 'Revenue', value: `Rs. ${stats.revenue}`, color: 'info' },
        ].map((card, i) => (
          <div className="col-md-3 mb-3" key={i}>
            <div className={`card text-white bg-${card.color} shadow`}>
              <div className="card-body text-center">
                <h5>{card.label}</h5>
                <h3>{card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
     <div className="row mb-4">
  <div className="col-md-6">
    <div className="card p-3">
      <h5>Sales Chart (Demo)</h5>
      <Bar
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Sales',
              data: [120000, 150000, 100000, 180000, 140000, 200000],
              backgroundColor: '#007bff',
            },
          ],
        }}
      />
    </div>
  </div>

  <div className="col-md-6">
    <TopProductsChart />
  </div>
</div>


      {/* Recent Orders */}
      <div className="card p-3">
        <h5>Recent Orders</h5>
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.name || 'Guest'}</td>
                <td>Rs. {order.total}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
