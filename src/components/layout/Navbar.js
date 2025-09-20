import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import SearchBar from '../shared/SearchBar';
import SubNavbar from './SubNavbar'; // ✅ import
import '../../style/Navbar.css';

const AppNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false); // ✅ track toggle

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" expanded={expanded} onToggle={setExpanded}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/">ECOMINSIGHT</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" className="justify-content-between">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/products">Products</Nav.Link>
              <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
              {user && (
               <>
               <Nav.Link as={Link} to="/orders">Orders</Nav.Link> {/* ✅ NEW */}
               <Nav.Link as={Link} to={user.role === 'admin' ? '/admin' : '/user'}>
                 Dashboard
               </Nav.Link>
             </>
              )}
            </Nav>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <SearchBar />
              {!user ? (
                <>
                  <Button as={Link} to="/login" variant="outline-light" size="sm">Login</Button>
                  <Button as={Link} to="/register" variant="outline-light" size="sm">Sign Up</Button>
                </>
              ) : (
                <Button onClick={handleLogout} variant="outline-light" size="sm">Logout</Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ✅ Show SubNavbar only when menu is collapsed on small screens */}
      <SubNavbar isHidden={expanded} />
    </>
  );
};

export default AppNavbar;
