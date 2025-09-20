import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const fetchProducts = async (page = 1) => {
  const res = await axios.get(`http://127.0.0.1:8000/api/products?page=${page}`);
  return res.data;
};
export const searchProducts = async (keyword, page = 1) => {
  const response = await axios.get(`${API_URL}/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  return response.data; // ✅ Return full object with data + pagination
};

export const fetchMainProducts = async () => {
  const response = await axios.get(`${API_URL}/main-products`);
  return response.data.data; // because it's nested under `data` key
};

export const fetchProductById = async (productId) => {
  const response = await axios.get(`${API_URL}/products/${productId}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

export const addToCart = async (productId, quantity, token) => {
  const response = await axios.post(
    `${API_URL}/cart/add`,
    { product_id: productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const fetchCartItems = async (token) => {
  const response = await axios.get(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
// Similarly update:
export const fetchDiscountedProducts = async (page = 1) => {
  const res = await axios.get(`http://127.0.0.1:8000/api/products/discounted?page=${page}`);
  return res.data;
};
// productApi.js
export const fetchFeaturedProducts = async (page = 1) => {
  const res = await axios.get(`http://127.0.0.1:8000/api/products/featured?page=${page}`);
  return res.data;
};

export const fetchProductsByBrand = async (brandId, page = 1) => {
  const res = await axios.get(`http://127.0.0.1:8000/api/brands/${brandId}/products?page=${page}`);
  return res.data;
};

export const fetchProductsByCategory = async (categoryId, page = 1) => {
  const res = await axios.get(`http://127.0.0.1:8000/api/products/category/${categoryId}?page=${page}`);
  return res.data;
};
export const fetchProductsBySubcategory = async (subcategoryId, page = 1) => {
  const res = await axios.get(
    `http://127.0.0.1:8000/api/products/subcategory/${subcategoryId}?page=${page}`
  );
  return res.data;
};


export const updateCartQuantity = async (productId, quantity, token) => {
  await axios.put(`${API_URL}/cart/update/${productId}`, { quantity }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeFromCart = async (productId, token) => {
  await axios.delete(`${API_URL}/cart/remove/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const clearCart = async (token) => {
  await axios.delete(`${API_URL}/cart/clear`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchRecommendedProducts = async (userId) => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/recommendations/${userId}`);
    return res.data; // 👈 make sure backend returns an array
  } catch (err) {
    console.error("❌ Error fetching recommendations:", err);
    return [];
  }
};
