import React from 'react';
import '../../style/Footer.css';
import appStore from '../../assets/footer/app-store.png';
import googlePlay from '../../assets/footer/google-play.png';
import huaweiGallery from '../../assets/footer/huawei-gallery.png';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="row footer-top">
          <div className="col-md-3 col-6">
            <h5>Customer Care</h5>
            <ul>
              <li>Help Center</li>
              <li>How to Buy</li>
              <li>Corporate & Bulk Purchasing</li>
              <li>Returns & Refunds</li>
              <li>Shop</li>
              <li>Contact Us</li>
              <li>Purchase Protection</li>
              <li>Pick up Points</li>
            </ul>
          </div>
          <div className="col-md-3 col-6">
            <h5>About Us</h5>
            <ul>
              <li>About Us</li>
              <li>Digital Payments</li>
              <li>Donates</li>
              <li>Blog</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Online Shopping App</li>
              <li>University</li>
            </ul>
          </div>
          <div className="col-md-6 text-center app-section">
            <h5>Happy Shopping</h5>
            <p>Download App</p>
           <div className="app-buttons">
              <a href="#"><img src={appStore} alt="App Store" className="hover-zoom" /></a>
              <a href="#"><img src={googlePlay} alt="Google Play" className="hover-zoom" /></a>
              <a href="#"><img src={huaweiGallery} alt="App Gallery" className="hover-zoom" /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom text-center mt-4">
          <p>&copy; {new Date().getFullYear()} FYP Store | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
