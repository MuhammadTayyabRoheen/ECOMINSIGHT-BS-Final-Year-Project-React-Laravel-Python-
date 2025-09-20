import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/admin/top-products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching top products', err);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div className="card p-3 mb-4">
      <h5>Top Selling Products</h5>
      <ul className="list-group list-group-flush">
        {products.map((product) => (
          <li key={product.id} className="list-group-item d-flex justify-content-between">
            <span>{product.name}</span>
            <span>Sold: {product.total_sold ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSellingProducts;
