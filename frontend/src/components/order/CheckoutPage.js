// src/components/order/CheckoutPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import '../../style/CheckoutPage.css';

const CheckoutPage = () => {
  const { token } = useContext(AuthContext);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!address.trim()) return alert("🚨 Please enter a delivery address.");
    try {
      setLoading(true);
      const res = await axios.post(
        'http://127.0.0.1:8000/api/order/place',
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Order placed successfully! Order ID: ${res.data.order_id}`);
         navigate(`/checkout/payment?order_id=${res.data.order_id}`);

    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2 className="checkout-title">🛒 Checkout</h2>
        <label htmlFor="address">Delivery Address</label>
        <textarea
          id="address"
          className="checkout-input"
          rows="4"
          placeholder="Please enter Your complete Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          className={`checkout-btn ${loading ? 'loading' : ''}`}
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
