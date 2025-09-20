import React, { useState } from 'react';

const ProductSearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

export default ProductSearchBar;
