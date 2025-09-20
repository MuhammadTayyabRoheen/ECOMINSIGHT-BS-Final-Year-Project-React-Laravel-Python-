import React from 'react';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentPage from './components/order/PaymentPage';
import AdminPayments from './components/dashboard/AdminPayments';
// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FooterPayment from './components/layout/FooterPayment';
import FooterSocial from './components/layout/FooterSocial';

// Authentication
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboards
import AdminDashboardPage from './components/dashboard/AdminDashboardPage';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminSidebar from './components/dashboard/AdminSidebar';
import AdminUsers from './components/dashboard/AdminUsers';
import AdminLayout from './components/dashboard/AdminLayout';
import AdminUsersPage from './components/dashboard/AdminUsersPage';
import AdminOrdersPage from './components/dashboard/AdminOrdersPage';
import AdminProducts from './components/dashboard/AdminProducts';
import AdminBrands from './components/dashboard/AdminBrands'; 
import AdminCategories from './components/dashboard/AdminCategories';
import AdminSubcategories from './components/dashboard/AdminSubcategories';


// Pages
import HomePage from './components/product/HomePage';
import ProductPage from './components/product/ProductPage';
import ProductDetail from './components/product/ProductDetail';
import CartPage from './components/cart/CartPage';
import AccountPage from './components/account/AccountPage';
import CheckoutPage from './components/order/CheckoutPage';
import MyOrders from './components/order/MyOrders';
import OrderDetail from './components/order/OrderDetail';

// Protected Routing
import ProtectedRoute from './routes/ProtectedRoute';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Show navbar and footer only for user routes */}
      {!isAdminRoute && (
        <>
          <Navbar />
        </>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route path="/user" element={<ProtectedRoute component={UserDashboard} />} />
        <Route path="/account" element={<ProtectedRoute component={AccountPage} />} />
        <Route path="/cart" element={<ProtectedRoute component={CartPage} />} />
        <Route path="/checkout" element={<ProtectedRoute component={CheckoutPage} />} />
        <Route path="/checkout/payment" element={<PaymentPage />} />

        <Route path="/orders" element={<ProtectedRoute component={MyOrders} />} />
        <Route path="/order/:id" element={<ProtectedRoute component={OrderDetail} />} />

        {/* Admin Route */}
       <Route path="/admin" element={
  <ProtectedRoute>
    <AdminDashboardPage/>
      
  </ProtectedRoute>
} />

   <Route
  path="/admin/users"
  element={<ProtectedRoute component={AdminUsersPage} />}
/>

<Route path="/admin/orders" element={
  <ProtectedRoute>
    <AdminOrdersPage />
  </ProtectedRoute>
} />

{/* ✅ Admin Brands */}
<Route path="/admin/brands" element={
  <ProtectedRoute>
    <AdminLayout>
      <AdminBrands />
    </AdminLayout>
  </ProtectedRoute>
} />


<Route path="/admin/payments" element={
  <ProtectedRoute>
    <AdminLayout>
      <AdminPayments />
    </AdminLayout>
  </ProtectedRoute>
} />

<Route path="/admin/categories" element={
  <ProtectedRoute>
    <AdminLayout>
      <AdminCategories />
    </AdminLayout>
  </ProtectedRoute>
} />

<Route path="/admin/subcategories" element={
  <ProtectedRoute>
    <AdminLayout>
      <AdminSubcategories />
    </AdminLayout>
  </ProtectedRoute>
} />


<Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />



        {/* Product Routes */}
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products/discounted" element={<ProductPage filter="discounted" />} />
        <Route path="/products/featured" element={<ProductPage filter="featured" />} />
        <Route path="/products/brand/:id" element={<ProductPage filter="brand" />} />
        <Route path="/products/category/:id" element={<ProductPage filter="category" />} />
        <Route path="/products/subcategory/:id" element={<ProductPage filter="subcategory" />} />
      </Routes>

      {!isAdminRoute && (
        <>
          <Footer />
          <FooterPayment />
          <FooterSocial />
        </>
      )}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
