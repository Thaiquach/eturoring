<script setup>
import { ref, onMounted } from 'vue';
import studentService from '../api/studentService';
import CreateStudentForm from '../components/createStudentForm.vue';
import SideBar from '../components/SideBar.vue';
import TopBar from '../components/TopBar.vue';
const { deleteStudent } = studentService;
const students = ref([]);
const editingStudent = ref(null);


const loadStudents = async () => {
  try {
    const response = await studentService.getAll();
    students.value = response.data;
  } catch (error) {
    console.error('Error loading students:', error);
    students.value = [];
  }
};

onMounted(() => {
  loadStudents();
});

const removeStudent = async (id) => {
  if (confirm('Are you sure you want to delete this student?')) {
    const success = await deleteStudent(id);
    if (success) {
      students.value = students.value.filter(s => s.id !== id);
    }
  }
};

const editStudent = (student) => {
  editingStudent.value = { ...student };
};
const handleStudentUpdated = (updatedStudent) => {
  const index = students.value.findIndex(s => s.id === updatedStudent.id);
  if (index !== -1) {
    students.value[index] = updatedStudent; // update
  } else {
    students.value.push(updatedStudent); // add mới
  }
};
</script>

<template>
  <div class="layout-container">
    <SideBar />
    <div class="main">
      <TopBar />
      <div class="content student-theme">
        <div class="btn-group">
          <router-link class="btn active" to="/manageStudent">Student</router-link>
          <router-link class="btn inactive" to="/manageTutor">Tutor</router-link>
        </div>

        <h2>Student Management</h2>
        <CreateStudentForm :editingStudent="editingStudent" @studentUpdated="handleStudentUpdated" />

        <table class="data-table">
          <thead>
            <tr>
              <th>FullName</th>
              <th>Student Code</th>
              <th>Email</th>
              <th>Username</th>
              <th>course</th>
              <th>status</th>
              <th>Action</th>
            </tr>

          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.user.fullName }}</td>
              <td>{{ student.studentCode }}</td>
              <td>{{ student.user.email }}</td>
              <td>{{ student.user.userName }}</td>          
              <td>{{ student.course }}</td>
              <td>{{ student.status }}</td>
              <td>
                <button class="edit-btn" @click="editStudent(student)">Edit</button>
                <button class="delete-btn" @click="removeStudent(student.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/tableStyles.css';

/* Layout */
.layout-container {
  display: flex;
  height: 100vh;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
<<<<<<< HEAD

=======
>>>>>>> origin/master
/* Background màu xanh nhạt */
.student-theme {
  background-color: #dfeeff;
  padding: 1rem;
  border-radius: 8px;
}

/* Table & Form - Màu chữ đậm hơn */
.data-table th,
.data-table td,
label,
h2 {
  color: #004080;
  font-weight: bold;
}

/* Button Group */
.btn-group {
  margin-bottom: 1rem;
}

.btn-group .btn {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

/* Button của trang hiện tại đậm hơn */
.btn-group .active {
  background-color: #007bff;
  color: white;
}

/* Các button khác nhạt hơn */
.btn-group .inactive {
  background-color: #b3d9ff;
  color: #004080;
}

/* Action Buttons */
.edit-btn {
  background: #ffc107;
  color: black;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

button:hover {
  opacity: 0.8;
}
</style>