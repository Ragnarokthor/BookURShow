// src/axiosInstance.js or wherever your axios config is

import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8082',
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach token dynamically using interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
