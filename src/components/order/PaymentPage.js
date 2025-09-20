// src/components/order/PaymentPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);

  const orderId = new URLSearchParams(location.search).get('order_id');

  const [method, setMethod] = useState('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [totalAmount, setTotalAmount] = useState(null);

  // ✅ Fetch order total
  useEffect(() => {
    const fetchOrderTotal = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/order/detail/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalAmount(res.data.total);
      } catch (err) {
        console.error('Failed to fetch order total:', err);
        alert('Unable to fetch order details.');
      }
    };

    if (orderId) fetchOrderTotal();
  }, [orderId, token]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/payment/pay`,
        {
          order_id: orderId,
          method: method
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
      }, 1000);

    } catch (err) {
      console.error(err);
      alert('❌ Payment failed. Try again.');
      setIsProcessing(false);
    }
  };

  const handlePayLater = () => {
    navigate('/orders');
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/orders');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="payment-page container">
      <h2 className="text-center mb-4">Checkout & Payment</h2>

      <div className="card shadow p-4">
        {isSuccess ? (
          <div className="text-center">
            <h3 className="text-success mb-3">✅ Payment Successful!</h3>
            <p>Redirecting to your orders...</p>
          </div>
        ) : (
          <form onSubmit={handlePayment}>
            <div className="mb-3">
              <label className="form-label">Payment Method:</label><br />
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="credit"
                  className="form-check-input"
                  name="method"
                  value="credit"
                  checked={method === 'credit'}
                  onChange={(e) => setMethod(e.target.value)}
                />
                <label htmlFor="credit" className="form-check-label">Credit Card</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="debit"
                  className="form-check-input"
                  name="method"
                  value="debit"
                  checked={method === 'debit'}
                  onChange={(e) => setMethod(e.target.value)}
                />
                <label htmlFor="debit" className="form-check-label">Debit Card</label>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                maxLength="19"
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                  maxLength="5"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">CVV</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                  maxLength="4"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Cardholder Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <h5>Total: PKR {totalAmount !== null ? totalAmount : '...'}</h5>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 mb-2"
              disabled={isProcessing || totalAmount === null}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handlePayLater}
              disabled={isProcessing}
            >
              Pay Later
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
