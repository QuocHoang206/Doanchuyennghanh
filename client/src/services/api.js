import axios from 'axios';

const BASE_PORT = "http://localhost:3000/api";

const api = axios.create({
  baseURL: BASE_PORT,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
