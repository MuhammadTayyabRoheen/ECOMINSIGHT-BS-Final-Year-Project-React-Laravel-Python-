// src/components/shared/StartSearch.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/StartSearch.css';

const StartSearch = () => {
  const navigate = useNavigate();

  return (
    <div className="start-search-wrapper">
      <button className="start-btn" onClick={() => navigate('/products')}>
        🔍 Start Finding Your Products
      </button>
    </div>
  );
};

export default StartSearch;
