// File: src/components/dashboard/TopProductsChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const TopProductsChart = () => {
  const [productData, setProductData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8000/api/admin/top-products', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setProductData(res.data);
    })
    .catch(err => {
      console.error('Error fetching top products:', err);
    });
  }, []);

  const chartData = {
    labels: productData.map(p => p.name),
    datasets: [
      {
        label: 'Units Sold',
        data: productData.map(p => p.total_sold),
        backgroundColor: '#ffc107',
      },
    ],
  };

  return (
    <div className="card p-3">
      <h5>Top Selling Products</h5>
      <Bar data={chartData} />
    </div>
  );
};

export default TopProductsChart;
