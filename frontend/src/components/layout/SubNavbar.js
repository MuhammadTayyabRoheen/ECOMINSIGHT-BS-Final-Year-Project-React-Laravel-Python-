import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import '../../style/SubNavbar.css';

const SubNavbar = ({ isHidden }) => {
  const [brands, setBrands] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/brands');
        setBrands(res.data.brands);
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };
    fetchBrands();
  }, []);

  return (
    <Navbar
      className={`sub-navbar ${isHidden ? 'hide-subnav' : ''}`} // ✅ toggle class
      expand="md"
    >
      <Container>
        <Nav className="me-auto mx-auto">
          <Nav.Link onClick={() => navigate('/products/featured')}>Seasonal Sale</Nav.Link>
          <Nav.Link onClick={() => navigate('/products/discounted')}>Discount Price</Nav.Link>
          <NavDropdown
            title="Brands"
            id="brand-dropdown"
            show={showDropdown}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {brands.length > 0 ? (
              brands.map((brand) => (
                <NavDropdown.Item
                  key={brand.id}
                  onClick={() => {
                    setShowDropdown(false);
                    navigate(`/products/brand/${brand.id}`);
                  }}
                >
                  {brand.name}
                </NavDropdown.Item>
              ))
            ) : (
              <NavDropdown.Item disabled>No brands found</NavDropdown.Item>
            )}
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default SubNavbar;
