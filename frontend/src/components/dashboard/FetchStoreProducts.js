import React from 'react';
import axios from 'axios';

const FetchStoreProducts = ({ onSuccess }) => {
  const token = localStorage.getItem('token');

  const fetchFromJohar = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/fetch-products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message || 'Johar Town products fetched.');
      onSuccess(); // refetch product list
    } catch (err) {
      alert('Error fetching from Johar Town');
      console.error(err);
    }
  };

  const fetchFromDHA = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/fetch-dha-products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message || 'DHA products fetched.');
      onSuccess(); // refetch product list
    } catch (err) {
      alert('Error fetching from DHA');
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <button onClick={fetchFromJohar} className="fetch-btn">Fetch from Johar Town</button>
      <button onClick={fetchFromDHA} className="fetch-btn">Fetch from DHA</button>
    </div>
  );
};

export default FetchStoreProducts;
