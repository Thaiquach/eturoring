import axios from "axios";

const BASE_API_URL = "https://localhost:7050/api";

const performLogout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    await axios.post(`${BASE_API_URL}/account/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("studentId");
  } catch (err) {
    console.error("❌ Logout failed:", err);
  }
};

export default {
  performLogout,
};
