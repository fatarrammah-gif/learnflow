import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

// Axios instance that prefixes all requests with /api/v1
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
