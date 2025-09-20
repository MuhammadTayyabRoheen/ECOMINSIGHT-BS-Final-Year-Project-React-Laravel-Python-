import React, { useEffect, useState } from 'react';
import HeroSlider from '../home/HeroSlider';
import FeatureInfoBar from '../home/FeatureInfoBar';
import SubCategoryBanner from '../home/SubCategoryBanner';
import ProductCard from '../product/ProductCard';
import { fetchProducts } from '../../api/productApi';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import ChatbotWidget from '../chatbot/ChatbotWidget';
import RecommendedSection from './RecommendedSection';

import '../../style/HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

  const loadProducts = async (page = 1) => {
    try {
      const data = await fetchProducts(page);
      setProducts(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
      });
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  useEffect(() => {
    loadProducts(); // Load first page
  }, []);

  const handlePageChange = (page) => {
    loadProducts(page);
  };

  const renderPagination = () => {
  const { current_page, last_page } = pagination;

  return (
    <Pagination className="justify-content-center mt-4">
      <Pagination.Prev
        disabled={current_page === 1}
        onClick={() => handlePageChange(current_page - 1)}
      />
      <Pagination.Item active>{current_page}</Pagination.Item>
      <Pagination.Next
        disabled={current_page === last_page}
        onClick={() => handlePageChange(current_page + 1)}
      />
    </Pagination>
  );
};


  return (
    <div>
      <HeroSlider />
      <FeatureInfoBar />
      <RecommendedSection />

      <SubCategoryBanner />
      <ChatbotWidget />

      <Container className="mt-5">
        <h2 className="section-title">All Products</h2>
        <Row>
          {products.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        {/* ⬅️ Pagination here */}
        {pagination.last_page > 1 && renderPagination()}
      </Container>
    </div>
  );
};

export default HomePage;
