// ✅ src/components/dashboard/AdminCategories.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../../style/AdminCategories.css';
import { AuthContext } from '../../context/AuthContext';

const AdminCategories = () => {
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null); // 🆕 editing mode

  // ✅ Fetch all categories from backend
  const fetchCategories = () => {
    axios.get('http://127.0.0.1:8000/api/admin/categories', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setCategories(res.data))
    .catch(console.error);
  };

  // ✅ Load categories on token ready
  useEffect(() => {
    fetchCategories();
  }, [token]);

  // ✅ Create a new category
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);

    await axios.post('http://127.0.0.1:8000/api/admin/category', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    resetForm();
    fetchCategories();
  };

  // ✅ Start editing: fill form
  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setImage(null); // new image optional
  };

  // ✅ Send update to backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);

    await axios.post(`http://127.0.0.1:8000/api/admin/category/${editingId}/update`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    resetForm();
    fetchCategories();
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    await axios.delete(`http://127.0.0.1:8000/api/admin/category/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCategories();
  };

  // ✅ Reset form state
  const resetForm = () => {
    setName('');
    setImage(null);
    setEditingId(null);
  };

  return (
    <div className="admin-categories">
      <h2>Manage Categories</h2>

      <form onSubmit={editingId ? handleUpdate : handleCreate} className="admin-form">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
        <button type="submit">
          {editingId ? 'Update Category' : 'Add Category'}
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
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>
                {cat.image ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${cat.image}`}
                    alt={cat.name}
                    height="50"
                  />
                ) : 'No image'}
              </td>
             <td>
  <button onClick={() => handleEdit(cat)} className="edit-btn">Edit</button>
  <button onClick={() => handleDelete(cat.id)} className="delete-btn">Delete</button>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategories;
