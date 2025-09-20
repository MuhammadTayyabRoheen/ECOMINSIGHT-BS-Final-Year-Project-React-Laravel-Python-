import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchRecommendations } from '../../api/recommendationApi';
import ProductCard from './ProductCard';
import { Container, Row, Col } from 'react-bootstrap';

const RecommendedSection = () => {
  const { user } = useContext(AuthContext);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (user?.id) {
        try {
          const data = await fetchRecommendations(user.id);
          setRecommended(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Recommendation fetch failed:', err);
        }
      }
    };

    loadRecommendations();
  }, [user]);

  if (!user || recommended.length === 0) return null;

  return (
    <Container className="mt-5">
      <h4 className="mb-3">Recommended For You</h4>
      <Row>
        {recommended.map((item) => (
          <Col key={item.product.id} md={4} className="mb-4">
            <ProductCard product={item.product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RecommendedSection;
