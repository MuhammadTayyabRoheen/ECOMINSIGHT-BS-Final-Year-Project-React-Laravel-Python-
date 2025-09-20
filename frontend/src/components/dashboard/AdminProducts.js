// File: src/components/admin/AdminProducts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/AdminProducts.css';
import EditProduct from './EditProduct';
import DeleteProduct from './DeleteProduct';
import ProductSearchBar from './ProductSearchBar'; // ⬅️ Import the component
import FetchStoreProducts from './FetchStoreProducts';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

 const fetchProducts = async (page = 1, keyword = '') => {
  try {
    const url = keyword
      ? `http://localhost:8000/api/products/search?keyword=${keyword}&page=${page}`
      : `http://localhost:8000/api/products?page=${page}`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data && res.data.data) {
      setProducts(res.data.data);
      setCurrentPage(res.data.current_page || 1);
      setTotalPages(res.data.last_page || 1);
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
};

// Search handler passed to search bar
const handleSearch = (keyword) => {
  setSearchTerm(keyword);
  fetchProducts(1, keyword);
};


  const handleDeleteSuccess = () => {
    fetchProducts(currentPage);
    setDeletingProduct(null);
  };

  const handleEditSuccess = () => {
    fetchProducts(currentPage);
    setEditingProduct(null);
  };

  return (
    <div className="admin-products">
      <h2>All Products</h2>
 {/* 🔍 Add the search bar here */}

    <ProductSearchBar onSearch={handleSearch} />
    <FetchStoreProducts onSuccess={() => fetchProducts(currentPage)} />
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Brand</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="6">No products found.</td></tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.name} className="product-image" />
                </td>
                <td>{product.name}</td>
                <td>Rs. {product.discount_price ?? product.price}</td>
                <td>{product.stock}</td>
                <td>{product.brand?.name ?? '-'}</td>
                <td>
                  <button
                    className="update-btn"
                    onClick={() => setEditingProduct(product)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => setDeletingProduct(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
    {totalPages > 1 && (
  <div className="pagination-controls">
    <button
      className="pagination-btn"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      ← Previous
    </button>

    <span className="current-page">Page {currentPage} of {totalPages}</span>

    <button
      className="pagination-btn"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
    >
      Next →
    </button>
  </div>
)}


      {/* Edit Modal */}
      {editingProduct && (
        <EditProduct
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Modal */}
      {deletingProduct && (
        <DeleteProduct
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default AdminProducts;
