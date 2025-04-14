// src/utils/searchService.js
import axios from "axios";
import { getToken } from "./authService";

const BASE_API_URL = "http://localhost:8080/api/search";

// Gửi token nếu cần xác thực (nếu không cần thì có thể bỏ phần headers này)
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// 🔍 Gọi API tìm kiếm
export const search = async (query) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/search`, {
      params: { query },
      ...authHeader(),
    });
    return response.data;
  } catch (err) {
    console.error("❌ Lỗi khi tìm kiếm:", err);
    throw err;
  }
};
