<template>
  <div class="container">
    <!-- Sidebar chứa các đường dẫn -->
    <aside class="sidebar">
      <ul>
        <li><router-link to="/schedule">Schedule</router-link></li>
        <li><router-link to="/manageblog"> Blog</router-link></li>
        <li><router-link to="/message">Message</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
        
      </ul>
    </aside>
    <!-- Nội dung chính -->
    <div class="main-content">
      <!-- Topbar với nút Logout -->
      <header class="topbar">
        <button @click="logout">Logout</button>
      </header>
      <!-- Phần body hiển thị danh sách blog -->
      <section class="body">
        <h1>Danh sách Class</h1>
        
      </section>
      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2025 footer</p>
      </footer>
    </div>
  </div>
</template>


<style scoped>
.container {
  display: flex;
}

/* Sidebar */
.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar ul li {
  margin-bottom: 10px;
}

/* Main content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.topbar {
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: right;
}
.body {
  flex: 1;
  padding: 20px;
}
.footer {
  background-color: #ddd;
  text-align: center;
  padding: 10px;
}
.blog-item {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
</style>
