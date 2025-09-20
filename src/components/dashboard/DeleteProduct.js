// File: src/components/admin/DeleteProduct.js
import React from 'react';
import axios from 'axios';
import '../../style/DeleteProductModal.css';

const DeleteProduct = ({ product, onClose, onSuccess }) => {
  const token = localStorage.getItem('token');

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/product/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3>Are you sure you want to delete <span className="delete-product-name">{product.name}</span>?</h3>
        <div className="delete-buttons">
          <button onClick={handleDelete} className="confirm-btn">Yes, Delete</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
