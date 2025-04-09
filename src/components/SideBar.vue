<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Nút toggle sidebar -->
    <div class="toggle-btn" @click="toggleSidebar">
      <i class="fa fa-bars"></i>
    </div>
    <!-- Danh sách các link chỉ hiển thị khi sidebar đang mở -->
    <nav class="sidebar-nav" v-if="!isCollapsed">
      <ul>
        <li>
          <router-link to="/dashboard">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/Blog">Blog</router-link>
        </li>
        <li>
          <router-link to="/classlist">Chat</router-link>
        </li>
        <li>
          <router-link to="/Meetting">Meeting</router-link>
        </li>
        <li>
          <router-link to="/homeview">Home</router-link>
        </li>
        <!-- Thêm các link khác nếu cần -->
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isCollapsed: false
    };
  },
  methods: {
    toggleSidebar() {
      // Đảo ngược trạng thái của sidebar (mở/đóng)
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>

<style scoped>
/* Mặc định sidebar mở */
.sidebar {
  width: 220px;
  background-color: #f7f7f7;
  border-right: 1px solid #ddd;
  transition: width 0.3s ease;
}

/* Khi sidebar được thu gọn */
.sidebar.collapsed {
  width: 60px;
}

/* Nút toggle */
.toggle-btn {
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

/* Phần nav chứa các link */
.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  padding: 0.75rem 1rem;
}

/* Link điều hướng */
.sidebar-nav li a {
  text-decoration: none;
  color: #333;
  display: block;
}

/* Hiệu ứng hover cho link */
.sidebar-nav li a:hover {
  background-color: #e2e2e2;
}
</style>
