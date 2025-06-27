import axios from "axios";
// import * as https from "https";

const API_URL = process.env.JWT_PASSWORD;
export const api = axios.create({
  baseURL: API_URL,
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
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

updatePassword.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.JWT_PASSWORD}`;
  return config;
});