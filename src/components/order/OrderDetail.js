import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import '../../style/OrderDetail.css';
import ChatbotWidget from '../chatbot/ChatbotWidget';
const OrderDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/order/detail/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setOrder(res.data))
    .catch(console.error);
  }, [id, token]);

  const handleCancel = async () => {
    await axios.put(`http://127.0.0.1:8000/api/order/cancel/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('❌ Order canceled.');
  };

  const handleReorder = async () => {
    await axios.post(`http://127.0.0.1:8000/api/order/reorder/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('✅ Reordered successfully!');
  };

  const handleTrack = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/api/order/status/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert(`📦 Status: ${res.data.status}`);
  };

  if (!order) return <p className="order-loading">Loading order details...</p>;

  return (
    <div className="order-detail-wrapper">
            <ChatbotWidget />

      <div className="order-summary">
        <h2>Order #{order.id}</h2>
        <p><strong>Address:</strong> {order.address}</p>
        <p><strong>Status:</strong> 
          <span className={`status-badge ${order.status}`}>
            {order.status}
          </span>
        </p>
      </div>

      <h3 className="items-title">Items in this Order</h3>
      <div className="order-items-list">
        {order.items.map((item) => (
          <div className="item-card" key={item.id}>
            <img src={item.product.image} alt={item.product.name} />
            <div className="item-info">
              <h4>{item.product.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>
                Price: {
                  item.product.discount_price ? (
                    <>
                      <del>Rs. {item.product.price}</del> → 
                      <span className="discounted"> Rs. {item.product.discount_price}</span>
                    </>
                  ) : (
                    <>Rs. {item.product.price}</>
                  )
                }
              </p>
              <p>Store: {item.product.store_location}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-btn-group">
        <button className="cancel-btn" onClick={handleCancel}>Cancel Order</button>
        <button className="reorder-btn" onClick={handleReorder}>Reorder</button>
        <button className="track-btn" onClick={handleTrack}>Track</button>
      </div>
    </div>
  );
};

export default OrderDetail;
