// ✅ src/components/dashboard/AdminSubcategories.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../../style/AdminSubcategories.css';
import { AuthContext } from '../../context/AuthContext';

const AdminSubcategories = () => {
  const { token } = useContext(AuthContext);

  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null); // 🆕 for edit mode

  // ✅ Load subcategories
  const fetchSubcategories = () => {
    axios.get('http://127.0.0.1:8000/api/admin/subcategories', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setSubcategories(res.data))
    .catch(console.error);
  };

  // ✅ Load categories for dropdown
  const fetchCategories = () => {
    axios.get('http://127.0.0.1:8000/api/admin/categories', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setCategories(res.data))
    .catch(console.error);
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, [token]);

  // ✅ Create new subcategory
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category_id', categoryId);
    if (image) formData.append('image', image);

    await axios.post('http://127.0.0.1:8000/api/admin/subcategory', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    resetForm();
    fetchSubcategories();
  };

  // ✅ Start editing: fill form
  const handleEdit = (sub) => {
    setEditingId(sub.id);
    setName(sub.name);
    setCategoryId(sub.category_id);
    setImage(null); // optional new image
  };

  // ✅ Update existing subcategory
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category_id', categoryId);
    if (image) formData.append('image', image);

    await axios.post(`http://127.0.0.1:8000/api/admin/subcategory/${editingId}/update`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    resetForm();
    fetchSubcategories();
  };

  // ✅ Delete subcategory
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    await axios.delete(`http://127.0.0.1:8000/api/admin/subcategory/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSubcategories();
  };

  // ✅ Reset form
  const resetForm = () => {
    setName('');
    setCategoryId('');
    setImage(null);
    setEditingId(null);
  };

  return (
    <div className="admin-subcategories">
      <h2>Manage Subcategories</h2>

      <form onSubmit={editingId ? handleUpdate : handleCreate} className="admin-form">
        <input
          type="text"
          placeholder="Subcategory Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
        <button type="submit">
          {editingId ? 'Update Subcategory' : 'Add Subcategory'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="cancel-btn">
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map(sub => (
            <tr key={sub.id}>
              <td>{sub.id}</td>
              <td>{sub.name}</td>
              <td>{sub.category?.name}</td>
              <td>
                {sub.image ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${sub.image}`}
                    alt={sub.name}
                    height="50"
                  />
                ) : 'No image'}
              </td>
 <button onClick={() => handleEdit(sub)} className="edit-btn">Edit</button>
<button onClick={() => handleDelete(sub.id)} className="delete-btn">Delete</button>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSubcategories;
