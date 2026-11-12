import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8911/api/v1",
    withCredentials: true,
    headers: { Accept: "application/json" },
});

export default api;
