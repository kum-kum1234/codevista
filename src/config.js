// Single place for the backend URL. Set VITE_API_URL in .env (see .env.example).
export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");
