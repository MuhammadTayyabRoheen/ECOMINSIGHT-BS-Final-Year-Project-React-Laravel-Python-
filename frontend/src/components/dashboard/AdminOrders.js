import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/AdminUsers.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/order/status/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders(); // Refresh data
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/order/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="admin-users-container">
      <h2>All Orders</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th><th>User</th><th>Total</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.name}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="delete-btn" onClick={() => deleteOrder(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
