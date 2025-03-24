<!-- src/components/Sidebar.vue -->
<template>
    <aside class="SideBar">
      <div class="menu-toggle">
        <!-- Nếu muốn có nút ẩn/hiện sidebar trong chính sidebar, có thể đặt ở đây -->
        <!-- Hoặc để trống, tuỳ ý thiết kế -->
      </div>
      <nav>
        <ul>
          <li>
            <router-link to="/dashboard">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/blog">Blog</router-link>
          </li>
          <li>
            <router-link to="/doc">Doc</router-link>
          </li>
          <li>
            <router-link to="/meeting">Meeting</router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </template>
  
  <script setup>
  /* Ở đây ta không cần logic đặc biệt nếu sidebar chỉ hiển thị menu.
     Nếu bạn muốn logic đóng/mở sidebar bên trong, có thể khai báo props, emits... */
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    background-color: #f2f2f2;
    padding: 1rem;
  }
  
  .sidebar nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar nav li {
    margin-bottom: 1rem;
  }
  
  .sidebar nav a {
    text-decoration: none;
    color: #333;
  }
  </style>
  