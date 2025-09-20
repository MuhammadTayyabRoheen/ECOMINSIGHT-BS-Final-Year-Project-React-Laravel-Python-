import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard'; // ✅ Import
import ChatbotWidget from '../chatbot/ChatbotWidget';
import {
  fetchProducts,
  searchProducts,
  fetchDiscountedProducts,
  fetchFeaturedProducts,
  fetchProductsByBrand,
  fetchProductsByCategory,
  fetchProductsBySubcategory,
} from '../../api/productApi';
import { Container, Row, Col, Alert, Pagination } from 'react-bootstrap';

const ProductPage = ({ filter }) => {
  const { id } = useParams();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword') || '';

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

  // ✅ Fetch based on filters and page
  const fetchData = async (page = 1) => {
    try {
      let response;
  
      if (keyword) {
        response = await searchProducts(keyword, page);
      } else if (filter === 'discounted') {
        response = await fetchDiscountedProducts(page);
      } else if (filter === 'featured') {
        response = await fetchFeaturedProducts(page);
      } else if (filter === 'brand' && id) {
        response = await fetchProductsByBrand(id, page);
      } else if (filter === 'category' && id) {
        response = await fetchProductsByCategory(id, page);
      } else if (filter === 'subcategory' && id) {
        response = await fetchProductsBySubcategory(id, page); // ✅ This line fixes it
      } else {
        response = await fetchProducts(page);
      }
  
      setProducts(response.data || []);
      setPagination({
        current_page: response.current_page || 1,
        last_page: response.last_page || 1,
      });
    } catch (err) {
      console.error('Error loading products:', err);
      setProducts([]);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [keyword, filter, id]);

  const handlePageChange = (pageNumber) => {
    fetchData(pageNumber);
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
    <Container className="mt-4">
            <ChatbotWidget />

      <h3 className="mb-4">
        Products{' '}
        {keyword && <span>- Results for "<strong>{keyword}</strong>"</span>}
      </h3>

      {products.length === 0 ? (
        <Alert variant="info">No products found.</Alert>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product.id} md={4} className="mb-4">
                      <ProductCard product={product} /> {/* ✅ Use component */}

              </Col>
            ))}
          </Row>
          {pagination.last_page > 1 && renderPagination()}
        </>
      )}
    </Container>
  );
};

export default ProductPage;
