// File: src/components/admin/EditProduct.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../style/EditProductModal.css';

const EditProduct = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    discount_price: product.discount_price || '',
    stock: product.stock,
    brand_id: product.brand_id,
    subcategory_id: product.subcategory_id || '',
    available: product.available,
    is_featured: product.is_featured,
    latitude: product.latitude || '',
    longitude: product.longitude || '',
    image: null,
  });

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null && val !== '') form.append(key, val);
    });

    try {
      await axios.post(`http://localhost:8000/api/admin/product/${product.id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      onSuccess();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h3>Edit Product</h3>
        <form onSubmit={handleSubmit} className="edit-form">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
          <input type="number" name="discount_price" value={formData.discount_price} onChange={handleChange} placeholder="Discount Price" />
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" required />
          <input type="number" name="brand_id" value={formData.brand_id} onChange={handleChange} placeholder="Brand ID" required />
          <input type="number" name="subcategory_id" value={formData.subcategory_id} onChange={handleChange} placeholder="Subcategory ID" />

          <select name="available" value={formData.available} onChange={handleChange}>
            <option value={1}>Available</option>
            <option value={0}>Unavailable</option>
          </select>

          <select name="is_featured" value={formData.is_featured} onChange={handleChange}>
            <option value={1}>Featured</option>
            <option value={0}>Not Featured</option>
          </select>

          <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" />
          <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" />
          <input type="file" name="image" onChange={handleFileChange} />

          <div className="edit-form-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;