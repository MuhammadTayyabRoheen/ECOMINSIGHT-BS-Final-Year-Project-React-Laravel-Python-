import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import AdminOrderDetailModal from './AdminOrderDetailModal';
import '../../style/AdminOrders.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = localStorage.getItem('token');

  const fetchOrders = async (page = 1) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/orders?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.data);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
      });
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  const handleModalClose = (updatedOrder) => {
    if (!updatedOrder) {
      setSelectedOrder(null);
      return;
    }

    if (updatedOrder.deleted) {
      setOrders(prev => prev.filter(o => o.id !== updatedOrder.id));
    } else {
      setOrders(prev => prev.map(o =>
        o.id === updatedOrder.id ? { ...o, status: updatedOrder.status } : o
      ));
    }

    setSelectedOrder(null);
  };

  return (
    <AdminLayout>
      <div className="admin-orders-container">
        <h2>All Orders</h2>
        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>Rs. {order.total}</td>
                <td>{order.status}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => setSelectedOrder(order.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Buttons */}
       {pagination.last_page > 1 && (
  <div className="pagination-controls mt-3">
    <button
      className="pagination-btn"
      disabled={pagination.current_page === 1}
      onClick={() => handlePageChange(pagination.current_page - 1)}
    >
      ← Previous
    </button>

    <span className="current-page">
      Page {pagination.current_page} of {pagination.last_page}
    </span>

    <button
      className="pagination-btn"
      disabled={pagination.current_page === pagination.last_page}
      onClick={() => handlePageChange(pagination.current_page + 1)}
    >
      Next →
    </button>
  </div>
)}

        {selectedOrder && (
          <AdminOrderDetailModal
            orderId={selectedOrder}
            onClose={handleModalClose}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
