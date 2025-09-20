// src/components/home/FeatureInfoBar.jsx
import React from 'react';
import './FeatureInfoBar.css';
import { Container, Row, Col } from 'react-bootstrap';

// ✅ Correct imports
import shipping from '../../assets/icons/shipping.png';
import returnIcon from '../../assets/icons/return.png';
import secure from '../../assets/icons/secure.png';

// import returnIcon from '../../assets/icons/return.png';
// import secure from '../../assets/icons/secure.png';


const FeatureInfoBar = () => {
  return (
    <div className="feature-bar">
      <Container>
        <Row className="text-center">
          <Col xs={12} md={4} className="feature-item">
            <img src={shipping} alt="Free Shipping" className="feature-image" />
            <h5>FREE SHIPPING</h5>
            <p>Free shipping on all US order or order above $200</p>
          </Col>
          <Col xs={12} md={4} className="feature-item">
            <img src={returnIcon} alt="30 Days Return" className="feature-image" />
            <h5>30 Days Return</h5>
            <p>Simply return it within 30 days for an exchange</p>
          </Col>
          <Col xs={12} md={4} className="feature-item">
            <img src={secure} alt="Secure Payment" className="feature-image" />
            <h5>100% Payment Secure</h5>
            <p>Payments are securely processed</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FeatureInfoBar;
