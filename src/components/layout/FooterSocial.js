// src/components/layout/FooterSocial.jsx
import React from 'react';
import '../../style/Footer.css';

const FooterSocial = () => {
  return (
    <div className="footer-social">
      <div>
        <h5>Follow Us</h5>
        <div className="social-icons">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" />
          <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" />
          <img src="https://cdn-icons-png.flaticon.com/512/733/733646.png" alt="YouTube" />
        </div>
      </div>
      <p>© FYP Store {new Date().getFullYear()}</p>
    </div>
  );
};

export default FooterSocial;
