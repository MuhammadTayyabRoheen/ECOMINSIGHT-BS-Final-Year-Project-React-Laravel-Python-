import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StartSearch from '../shared/StartSearch';
import '../../style/UserDashboard.css';
import ChatbotWidget from '../chatbot/ChatbotWidget';
const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [counts, setCounts] = useState({ orders: 0, shipped: 0, delivered: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/order/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
          },
        });

        const data = await res.json();
        animateStats(data.total, data.shipped, data.delivered);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };

    const animateStats = (orderTarget, shippedTarget, deliveredTarget) => {
      let interval = setInterval(() => {
        setCounts((prev) => {
          const updated = { ...prev };
          if (updated.orders < orderTarget) updated.orders++;
          if (updated.shipped < shippedTarget) updated.shipped++;
          if (updated.delivered < deliveredTarget) updated.delivered++;

          if (
            updated.orders >= orderTarget &&
            updated.shipped >= shippedTarget &&
            updated.delivered >= deliveredTarget
          ) {
            clearInterval(interval);
          }

          return updated;
        });
      }, 80);
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
            <ChatbotWidget />

      <h1 className="dashboard-title">👋 Welcome {user?.name}!</h1>

      <div className="stats-grid">
        <div className="stat-card orders">
          <h3>Total Orders</h3>
          <p className="count">{counts.orders}</p>
        </div>
        <div className="stat-card shipped">
          <h3>Shipped</h3>
          <p className="count">{counts.shipped}</p>
        </div>
        <div className="stat-card delivered">
          <h3>Delivered</h3>
          <p className="count">{counts.delivered}</p>
        </div>
      </div>

      <StartSearch />
    </div>
  );
};

export default UserDashboard;
