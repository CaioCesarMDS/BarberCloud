import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("barber-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const updatePassword = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

updatePassword.interceptors.request.use((config) => {
  // esse set continua não estando seguro depois ajustar aqui
  config.headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_JWT_PASSWORD}`;
  return config;
});