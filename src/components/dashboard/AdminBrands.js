import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../style/AdminBrands.css'; // create for styling

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);

  // Fetch brands
  useEffect(() => {
    fetchBrands();
  }, []);

// ✅ FETCH
const fetchBrands = async () => {
  const res = await axios.get('/brands');
  setBrands(res.data.brands);
};

// ✅ SUBMIT
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = { name: name.trim() };

  if (!payload.name || payload.name.length < 2) {
    alert('Please enter a valid brand name!');
    return;
  }

  try {
    if (editingBrand) {
      await axios.put(`/brands/${editingBrand.id}`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      await axios.post('/brands', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    setName('');
    setEditingBrand(null);
    fetchBrands();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      alert('❗ Brand name already exists or invalid!');
    } else {
      alert('⚠️ Something went wrong.');
      console.error(error);
    }
  }
};




// ✅ DELETE
const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this brand?')) {
    await axios.delete(`/brands/${id}`);
    fetchBrands();
  }
};

// ✅ ✅ ✅ MISSING: EDIT
const handleEdit = (brand) => {
  setName(brand.name);
  setEditingBrand(brand);
};


  return (
    <div className="admin-brands">
      <h2>Brands Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Brand name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">{editingBrand ? 'Update' : 'Add'} Brand</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Brand Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, index) => (
            <tr key={brand.id}>
              <td>{index + 1}</td>
              <td>{brand.name}</td>
              <td>
                <button onClick={() => handleEdit(brand)}>Edit</button>
                <button onClick={() => handleDelete(brand.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBrands;
