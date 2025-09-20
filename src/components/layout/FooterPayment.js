// src/components/layout/FooterPayment.jsx
import React from 'react';
import '../../style/Footer.css';
import visa from '../../assets/footer/visa.png';
import mastercard from '../../assets/footer/mastercard.png';
import jazzcash from '../../assets/footer/jazzcash.png';
import easypaisa from '../../assets/footer/easypaisa.png';
import verified from '../../assets/footer/verified.png';


const FooterPayment = () => {
  return (
    <div className="footer-payment">
      <div>
        <h5>Payment Methods</h5>
        <div className="payment-icons">
          <img src={visa} alt="Visa" />
          <img src={mastercard} alt="MasterCard" />
          <img src={jazzcash} alt="JazzCash" />
          <img src={easypaisa} alt="Easypaisa" />
        </div>
      </div>
      <div>
        <h5>Verified By</h5>
        <img src={verified} alt="PCI DSS" className="verified-img" />
      </div>
    </div>
  );
};

export default FooterPayment;
