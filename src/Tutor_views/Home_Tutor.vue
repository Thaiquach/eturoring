<template>
  <div class="container">
    <UserSidebar />

    <div class="main-content">
      <h3>📘 Các lớp của tôi (Tutor)</h3>
      <table class="class-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên lớp</th>
            <th>Môn học</th>
            <th>Tutor</th>
            <th>Slot</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Mô tả</th>
            <th>Học sinh</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(classItem, index) in myTutorClasses" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ classItem.className }}</td>
            <td>{{ classItem.subjectName }}</td>
            <td>{{ classItem.tutorName }}</td>
            <td>{{ classItem.totalSlot }}</td>
            <td>{{ formatDate(classItem.startDate) }}</td>
            <td>{{ formatDate(classItem.endDate) }}</td>
            <td>{{ classItem.description }}</td>
            <td>
              <ul v-if="classItem.studentNames?.length">
                <li v-for="(student, idx) in classItem.studentNames" :key="idx">{{ student }}</li>
              </ul>
              <span v-else>Không có học sinh</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import jwtDecode from 'jwt-decode';
import classService from '../api/classService';
import UserSidebar from '../components/userSidebar.vue';

const myTutorClasses = ref([]);

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const loadTutorClasses = async () => {
  try {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const tutorId = decoded?.TutorId;

    if (!tutorId) {
      alert("Không tìm thấy TutorId trong token!");
      return;
    }

    const response = await classService.getAllClasses();
    myTutorClasses.value = response.data.filter(
      (cls) => cls.tutorId === Number(tutorId)
    );
    console.log("✅ Các lớp của tutor:", myTutorClasses.value);
  } catch (error) {
    console.error('❌ Lỗi khi tải lớp học (Tutor):', error);
  }
};


onMounted(loadTutorClasses);
</script>

<style scoped>
.container {
  display: flex;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.class-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.class-table th,
.class-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  vertical-align: middle;
}

.class-table th {
  background-color: #f2f2f2;
}

.class-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.class-table tbody tr:hover {
  background-color: #f1f1f1;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
