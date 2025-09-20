import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import '../../style/AdminPayments.css'; // make sure to style it

const AdminPayments = () => {
  const { token } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [token]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin/payments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPayments(res.data.payments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setLoading(false);
    }
  };

  return (
    <div className="admin-payments">
      <h2>Payment Records</h2>

      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.order_id}</td>
                <td>{payment.customer_name || 'N/A'}</td>
                <td>Rs. {payment.amount}</td>
                <td>{payment.method}</td>
                <td>
                  <span className={`status ${payment.status}`}>
                    {payment.status}
                  </span>
                </td>
                <td>
                  <button className="view-btn">View</button>
                  <button className="refund-btn">Refund</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPayments;
