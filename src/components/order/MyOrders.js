// src/components/order/MyOrders.js
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../style/MyOrders.css';

const MyOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [token, currentPage]);

  const fetchOrders = (page) => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/order/my?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data.data);
        setTotalPages(res.data.meta.last_page);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const getStatusBadge = (status) => {
    let className = 'status-badge ';
    switch (status) {
      case 'pending':
        className += 'pending';
        break;
      case 'confirmed':
        className += 'confirmed';
        break;
      case 'shipped':
        className += 'shipped';
        break;
      case 'cancelled':
        className += 'cancelled';
        break;
      default:
        className += 'default';
    }
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {loading ? (
        <div className="orders-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">You haven't placed any orders yet.</div>
      ) : (
        <>
          <div className="orders-grid">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-row">
                  <div className="order-meta">
                    <h4>#{order.id}</h4>
                    <p>{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="order-details">
                  <p><strong>Delivery Address:</strong> {order.address}</p>
                  <p><strong>Total:</strong> Rs. {order.total}</p>
                </div>
<div className="order-footer">
  <Link to={`/order/${order.id}`} className="details-btn">
    View Details →
  </Link>

  {/* ✅ New Pay Now button for PENDING orders */}
  {order.status === 'pending' && (
    <Link 
      to={`/checkout/payment?order_id=${order.id}`}
      className="pay-btn"
    >
      Pay Now
    </Link>
  )}
</div>

              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
  <div className="pagination-container">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
      className="pagination-btn"
    >
      ← Previous
    </button>

    <span className="current-page">Page {currentPage} of {totalPages}</span>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
      className="pagination-btn"
    >
      Next →
    </button>
  </div>
)}

        </>
      )}
    </div>
  );
};

export default MyOrders;
