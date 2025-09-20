import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/AdminOrders.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminOrderDetailModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/order/detail/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setOrder(res.data);
      setNewStatus(res.data.status);
    } catch (err) {
      console.error('Error loading order detail', err);
    }
  };

  const handleStatusChange = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/order/status/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Status updated successfully!");

      // Update modal state and close with updated data
      const updatedOrder = { ...order, status: newStatus };
      setOrder(updatedOrder); // update modal content
      onClose(updatedOrder);  // pass to parent to update table
    } catch (err) {
      toast.error("Failed to update status.");
      console.error('Failed to update status:', err);
    }
  };

  const deleteOrder = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/order/delete/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order deleted successfully!");
      onClose({ deleted: true, id: orderId }); // 🔁 notify parent to remove
    } catch (err) {
      toast.error("Failed to delete order.");
      console.error('Failed to delete order:', err);
    }
  };

  if (!order) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Order #{order.id} Details</h3>
        <p><strong>User:</strong> {order.user.name}</p>
        <p><strong>Status:</strong>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="btn btn-sm btn-success ms-2" onClick={handleStatusChange}>
            Update
          </button>
        </p>
        <p><strong>Total:</strong> Rs. {order.total}</p>
        <p><strong>Address:</strong> {order.address}</p>

        <h5>Items:</h5>
        <ul>
          {order.items.map(item => (
            <li key={item.id}>
              {item.product.name} - Qty: {item.quantity} - Price: Rs. {item.price}
            </li>
          ))}
        </ul>

        <div className="mt-3">
          <button className="btn btn-secondary me-2" onClick={() => onClose(null)}>Close</button>
          <button className="btn btn-danger" onClick={deleteOrder}>Delete Order</button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailModal;
