<template>
  <UserLayout>
    <template #default>
      <div class="main-content">
        <h3>📘 My Classes (Tutor)</h3>
        <table class="class-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Tutor</th>
              <th>Slot</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Description</th>
              <th>Students</th>
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
                  <li v-for="(student, idx) in classItem.studentNames" :key="idx">
                    {{ student }}
                  </li>
                </ul>
                <span v-else>None</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </UserLayout>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import jwtDecode from 'jwt-decode';
import classService from '../api/classService';
import UserLayout from '../components/userLayout.vue';

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
.main-content {
  flex: 1;
  padding: 20px;
}

/* Bảng lớp học (đồng bộ với HomeStudent) */
.class-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
  background-color: white;
}

.class-table thead th {
  background-color: #D8B2D1; /* tím lavender */
  color: #4b3d73;
  padding: 14px;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #d6d6f0;
}

.class-table tbody td {
  padding: 12px;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
}

.class-table tbody tr:nth-child(even) {
  background-color: #f9f7fc;
}

.class-table tbody tr:hover {
  background-color: #f3e9ff;
  transition: background 0.2s ease;
}

.class-table ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>