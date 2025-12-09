import axios from "axios";
import { getToken } from "../hooks/auth";

const isProd = import.meta.env.PROD;
const envURL = import.meta.env.VITE_API_URL;
const defaultBaseURL = isProd
  ? "https://volunteerconnect-8ydj.onrender.com/api"
  : "http://localhost:4000/api";

const resolvedBaseURL = (() => {
  if (isProd) {
    if (!envURL || /localhost/i.test(envURL)) return defaultBaseURL;
    return envURL;
  }
  return envURL || defaultBaseURL;
})();

const api = axios.create({
  baseURL: resolvedBaseURL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
