// src/components/home/SubCategoryBanner.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/SubCategoryBanner.css';

const SubCategoryBanner = () => {
  const [groupedCategories, setGroupedCategories] = useState({});

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/subcategories') // Your backend API
      .then(res => res.json())
      .then(data => {
        const grouped = {};
        data.forEach(sub => {
          if (!grouped[sub.category.name]) {
            grouped[sub.category.name] = [];
          }
          grouped[sub.category.name].push(sub);
        });
        setGroupedCategories(grouped);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="subcategory-banner-wrapper">
      {Object.entries(groupedCategories).map(([categoryName, subs]) => (
        <div key={categoryName} className="category-section">
          <h2 className="category-title">{categoryName}</h2>
          <div className="subcategory-banner-container">
            {subs.map(sub => (
            <Link
            to={`/products/subcategory/${sub.id}`}
            key={sub.id}
            className="subcategory-banner"
            style={{
              backgroundImage: `url(${sub.image_url || 'default-fallback.jpg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="subcategory-content">
              <p className="subcategory-title">{sub.name}</p>
              <button className="shop-btn">Shop Now</button>
            </div>
          </Link>
          
           
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubCategoryBanner;
