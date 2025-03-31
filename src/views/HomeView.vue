<script setup>
import { ref, onMounted } from 'vue'
import TopBar from '../components/TopBar.vue'
import SideBar from '../components/SideBar.vue'
import classService from '../api/classService.js'

const classes = ref([]) // Khai báo danh sách class
const token = ref('')   // ✅ Khai báo token để tránh lỗi

onMounted(async () => {
  token.value = localStorage.getItem('token') || ''

  if (!token.value) {
    alert('Please log in first!')
    window.location.href = '/login' // Redirect về trang login nếu không có token
    return
  }

  try {
    const res = await classService.getAllStudents();
    classes.value = res.data
  } catch (err) {
    console.error('Failed to load classes:', err.response ? err.response.data : err.message)
  }
})
</script>




<template>
  <div class="layout-container">
    <!-- Sidebar Component -->
    <SideBar />

    <!-- Phần main bao gồm Topbar và Content -->
    <div class="main">
      <TopBar />

      <div class="content">
        <!-- Hiển thị thông tin token từ getToken.js -->
        <p>Your token: {{ token }}</p>

        <!-- Nhóm button dưới dạng link chuyển trang -->
        <div class="btn-group">
          <router-link class="btn" to="/manageStudent">Student</router-link>
          <router-link class="btn" to="/manageTutor">Tutor</router-link>

          <router-link class="btn" to="/addnewclass">Add New Class</router-link>
          <router-link class="btn" to="/manageblog">Blog</router-link>


          <router-link class="btn" to="/homeclass">Add New Class</router-link>
          <router-link class="btn" to="/homeSubject">Subject</router-link>

        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Class Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cls in classes" :key="cls.id">
            <td>{{ cls.id }}</td>
            <td>{{ cls.className }}</td>
            <td>{{ cls.description }}</td>
            <td><button disabled>Edit</button></td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

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
  margin-top: 60px;
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

.data-table {
  margin-top: 100px;
  /* tránh TopBar */
}
</style>
