import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById, addToCart } from '../../api/productApi';
import { Container, Row, Col, Badge, Button, Spinner, Toast } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import '../../style/ProductDetail.css';
import StoreMap from './StoreMap';
import axios from 'axios';
import ChatbotWidget from '../chatbot/ChatbotWidget';
const logInteraction = async (userId, productId, type) => {
  try {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace('T', ' '); // ✅ Format to "YYYY-MM-DD HH:MM:SS"
     console.log("📌 Logging view interaction:", {
      userId,
      productId,
      type
    });

    await axios.post('http://127.0.0.1:8000/api/interaction', {
      user_id: userId,
      product_id: productId,
      interaction_type: type,
      timestamp: timestamp, // ✅ required!
    });
  } catch (err) {
    console.error('Interaction log failed:', err.response?.data || err.message);
  }
};
const ProductDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setProduct(data);
      
    // ✅ Log interaction if token is present (user is logged in)
    if (token && data?.id) {
      const userId = JSON.parse(localStorage.getItem("user"))?.id;
      if (userId) {
        await logInteraction(userId, data.id, 'view');
      }
    }


    };
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    console.log('Adding to cart: ', product?.id, token);
  
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }
  
    try {
      setAdding(true);
      const res = await addToCart(product.id, 1, token);
      console.log('Add to cart response:', res);
      setShowToast(true);
    } catch (error) {
      console.error('Error adding to cart:', error.response || error.message);
      alert("Something went wrong. See console for details.");
    } finally {
      setAdding(false);
    }
  };
  

  if (!product) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Loading product...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 product-detail-container">
            <ChatbotWidget />

      <Row className="g-4 align-items-start">
        <Col xs={12} md={6} className="text-center">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
          />
        </Col>

        <Col xs={12} md={6}>
          <div className="detail-card shadow">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h3 className="fw-bold">{product.name}</h3>
                {product.subcategory?.name && (
                  <p className="text-muted mb-2">{product.subcategory.name}</p>
                )}
              </div>
              <span className="text-danger d-flex align-items-center">
                <FaHeart className="me-1" /> 125
              </span>
            </div>

            {product.is_featured && (
              <Badge bg="warning" text="dark" className="mb-3">
                Seasonal Offer
              </Badge>
            )}

            {product.brand?.name && (
              <p className="mb-2 text-muted">
                <strong>Brand:</strong> {product.brand.name}
              </p>
            )}

            <p className="text-dark">
              <strong>Price:</strong>{' '}
              {product.discount_price ? (
                <>
                  <span className="text-decoration-line-through text-muted">
                    Rs. {product.price}
                  </span>{' '}
                  <span className="text-success fw-bold">
                    Rs. {product.discount_price}
                  </span>
                </>
              ) : (
                <>Rs. {product.price}</>
              )}
            </p>

            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Store:</strong> {product.store_location}</p>

            <p className="product-description mt-3">
              {product.description}
            </p>
{/* 🌍 Show Store Map */}
<StoreMap
  lat={parseFloat(product.latitude)}
  lng={parseFloat(product.longitude)}
  store={product.store_location}
/>

            <Button
              variant="primary"
              className="mt-3 w-100"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </Button>

            {/* Success Toast */}
            <Toast
              show={showToast}
              onClose={() => setShowToast(false)}
              delay={3000}
              autohide
              bg="success"
              className="mt-3 text-white"
            >
              <Toast.Body>✔ Product added to cart!</Toast.Body>
            </Toast>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
