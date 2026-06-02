import axios from "axios";
// Base API URL pointing to the Node/Express backend
const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://rentease-i3ap.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});
// Interceptor to inject JWT token in Request headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("rentease_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default API;
