<template>
  <div class="layout-container">
    <!-- Sidebar Component -->
    <SideBar />
    <!-- Phần main bao gồm Topbar và Content -->
    <div class="main">
      <TopBar />
      <div class="content">
        <!-- Hiển thị thông tin token từ HomeToken -->
        <Home_admin_token />
        
        <!-- Nhóm button dưới dạng link chuyển trang -->
        <div class="btn-group">
          <router-link class="btn" to="/student">Student</router-link>
          <router-link class="btn" to="/tutor">Tutor</router-link>
          <router-link class="btn" to="/addnewclass">Add New Class</router-link>
        </div>
        
        <!-- Bảng hiển thị danh sách thông tin -->
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>John Doe</td>
              <td>Student</td>
              <td><button>Edit</button></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jane Smith</td>
              <td>Tutor</td>
              <td><button>Edit</button></td>
            </tr>
            <!-- Thêm các dòng dữ liệu khác nếu cần -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue';
import TopBar from '../components/TopBar.vue';
import Home_admin_token from '../utils/Home_admin_token.vue';

export default {
  name: 'HomeAdmin',
  components: {
    SideBar,
    TopBar,
    Home_admin_token
  }
};
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
}

/* Phần main chứa Topbar và Content */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Nội dung chính */
.content {
  flex: 1;
  padding: 1rem;
  overflow: auto;
}

/* Nhóm button điều hướng */
.btn-group {
  margin-bottom: 1rem;
}

.btn-group .btn {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  text-decoration: none;
}

.btn-group .btn:hover {
  background-color: #0056b3;
}

/* Bảng hiển thị danh sách */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  border: 1px solid #ccc;
  padding: 0.75rem;
  text-align: left;
}

.data-table th {
  background-color: #f0f0f0;
}

.data-table tr:hover td {
  background-color: #fafafa;
}
</style>
