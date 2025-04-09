<template>
  <header class="user-topbar">
    <button @click="handleLogout">Logout</button>
  </header>
</template>

<script>
import axios from "axios";

const BASE_API_URL = "https://localhost:7050/api";

export default {
  name: "userTopbar",
  methods: {
    async handleLogout() {
  const confirmed = window.confirm("Are you sure to logout?");
  if (!confirmed) return; 

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ not found token.");
      return;
    }

    await axios.post(`${BASE_API_URL}/account/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Xoá dữ liệu localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("studentId");

    // Chuyển hướng về trang login
    this.$router.push("/login");
  } catch (error) {
    console.error("❌ Logout failed!!!", error);
  }
}
  }
};
</script>

<style scoped>
.user-topbar {
  background-color: #eec5e0;
  color: rgb(224, 11, 103);
  padding: 10px;
  text-align: right;
}
</style>
