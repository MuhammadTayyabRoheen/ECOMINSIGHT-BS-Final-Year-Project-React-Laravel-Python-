// src/components/cart/CartPage.js
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatbotWidget from '../chatbot/ChatbotWidget';
import {
  fetchCartItems,
  updateCartQuantity,
  removeFromCart,
  clearCart
} from '../../api/productApi';
import '../../style/CartPage.css';


const CartPage = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate(); // ✅ Correct: inside component function
  
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
  
    const loadCart = async () => {
      setLoading(true);
      try {
        const data = await fetchCartItems(token);
        setCart(data);
      } catch (err) {
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      loadCart();
    }, [token]); // Also added token to dependency
  
  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    await updateCartQuantity(productId, quantity, token);
    loadCart();
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId, token);
    loadCart();
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart(token);
      loadCart();
    }
  };

  return (
    <div className="cart-container">
            <ChatbotWidget />

      <h2 className="cart-title">My Shopping Cart</h2>

      {cart.items.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-table">
            <div className="cart-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Price</span>
              <span>Action</span>
            </div>

            {cart.items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="product-info">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <p>Product ID: {item.product_id}</p>
                  </div>
                </div>

                <div className="qty-buttons">
                  <button onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}>-</button>
                  <span className="qty-display">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}>+</button>
                </div>

                <div className="price">Rs. {item.price}</div>
                <div>
                  <button className="remove-btn" onClick={() => handleRemove(item.product_id)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-box">
              <p><strong>Discount:</strong> Rs. 0.00</p>
              <p><strong>Delivery:</strong> Rs. 200.00</p>
            </div>
            <div className="summary-box">
              <p><strong>Subtotal:</strong> Rs. {cart.total}</p>
              <p><strong>Total:</strong> Rs. {cart.total + 200}</p>
            </div>
          </div>

          <div className="promo-code">
            <input type="text" placeholder="Please enter promo code" />
            <button className="apply-btn">Apply Discount</button>
          </div>

          <div className="cart-footer-buttons">
            <button className="back-btn" onClick={() => window.history.back()}>Back to Shop</button>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
  Checkout
</button>
            <button className="clear-btn" onClick={handleClearCart}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
