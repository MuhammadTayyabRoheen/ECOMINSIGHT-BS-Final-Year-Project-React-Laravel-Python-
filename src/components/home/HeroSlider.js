import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../style/HeroSlider.css';

const HeroSlider = () => {
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categories.length);
    }, 4000); // Auto-slide every 4s

    return () => clearInterval(interval);
  }, [categories.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  return (
    <div className="hero-slider">
      <div className="slides-container">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${cat.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => navigate(`/products/category/${cat.id}`)}
          >
            <div className="overlay">
              <h1>{cat.name}</h1>
              <p>Explore latest {cat.name} collections now!</p>
              <button>Shop Now</button>
            </div>
          </div>
        ))}
      </div>

      {categories.length > 1 && (
        <>
          <button className="prev" onClick={prevSlide}>&lt;</button>
          <button className="next" onClick={nextSlide}>&gt;</button>

          <div className="dots">
            {categories.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
