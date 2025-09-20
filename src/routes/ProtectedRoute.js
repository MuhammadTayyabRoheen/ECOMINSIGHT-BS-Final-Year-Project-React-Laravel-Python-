import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p className="text-center mt-5">Checking authentication...</p>;
  }

  const isAdminRoute = window.location.pathname.startsWith('/admin');
  if (isAdminRoute && user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  // Support both: component={...} and <ProtectedRoute>...</ProtectedRoute>
  if (Component) {
    return user ? <Component /> : <Navigate to="/login" />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
