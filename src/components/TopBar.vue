<template>
    <header class="topbar">
      <!-- Logo trở thành đường dẫn, khi click sẽ chuyển về trang chủ -->
      <div class="logo">
        <img src="../assets/sun.jpg" alt="Logo" />
      </div>
      <button class="logout-btn" @click="handleLogout">Logout</button>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Topbar',
    methods: {
      handleLogout() {
        // Xử lý logic logout, ví dụ: xóa token, gọi API, v.v.
        console.log('Logout clicked');
      }
    }
  };
  </script>
  
  <style scoped>
  .topbar {
    height: 60px;
    background-color: #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
  }
  
  /* Đảm bảo logo được hiển thị vừa vặn */
  .logo img {
    max-height: 40px;
  }
  
  /* Nút Logout */
  .logout-btn {
    background-color: #f44336;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .logout-btn:hover {
    background-color: #d32f2f;
  }
  </style>
  