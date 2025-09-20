import axios from 'axios';

export const fetchRecommendations = async (userId) => {
  const res = await axios.get(`http://127.0.0.1:8000/api/recommendations/${userId}`);
  return res.data;
};
