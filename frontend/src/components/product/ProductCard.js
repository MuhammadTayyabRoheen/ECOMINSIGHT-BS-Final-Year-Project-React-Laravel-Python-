// src/components/product/ProductCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../style/ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <Card className="product-card h-100">
      <div className="product-image-container">
        <Card.Img
  variant="top"
  src={product.image}
  alt={product.name}
  className="product-image"
/>

      </div>

      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="product-name">{product.name}</Card.Title>

          {product.brand && (
            <Card.Subtitle className="mb-2 text-muted">
              Brand: {product.brand.name}
            </Card.Subtitle>
          )}

          {product.discount_price ? (
            <>
              <Card.Text className="product-price">
                <span className="text-muted text-decoration-line-through">
                  Rs. {product.price}
                </span>{' '}
                <span className="text-success fw-bold">
                  Rs. {product.discount_price}
                </span>
              </Card.Text>
              <Card.Text className="text-danger small">Limited Time Offer!</Card.Text>
            </>
          ) : (
            <Card.Text className="product-price">Price: Rs. {product.price}</Card.Text>
          )}
        </div>

        <Button
          as={Link}
          to={`/product/${product.id}`}
          variant="outline-primary"
          className="mt-3 w-100"
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
