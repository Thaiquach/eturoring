<script setup>
import { ref, onMounted } from 'vue';
import { fetchTutors, deleteTutor } from '../api/tutorService';
import CreateTutorForm from '../components/createTutorForm.vue';
import SideBar from '../components/SideBar.vue';
import TopBar from '../components/TopBar.vue';

const tutors = ref([]);
const editingTutor = ref(null);

const loadTutors = async () => {
  tutors.value = await fetchTutors();
};

onMounted(loadTutors);

const removeTutor = async (id) => {
  if (confirm('Are you sure you want to delete this tutor?')) {
    await deleteTutor(id);
    await loadTutors();
  }
};

const editTutor = (tutor) => {
  editingTutor.value = { ...tutor }; // ✅ Correctly sets the tutor being edited
};
</script>

<template>
  <div class="layout-container">
    <SideBar />
    <div class="main">
      <TopBar />
      <div class="content tutor-theme">
        <div class="btn-group">
          <router-link class="btn inactive" to="/manageStudent">Student</router-link>
          <router-link class="btn active" to="/manageTutor">Tutor</router-link>
        </div>

        <h2>Tutor Management</h2>
        <CreateTutorForm :editingTutor="editingTutor" @tutorUpdated="loadTutors" />

        <table class="data-table">
          <thead>
            <tr>
              <th>Fullname</th>
              <th>Email</th>
              <th>Username</th>
              <th>Password</th>
              <th>Experience</th>
              <th>Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tutor in tutors" :key="tutor.id">
              <td>{{ tutor.fullname }}</td>
              <td>{{ tutor.email }}</td>
              <td>{{ tutor.username }}</td>
              <td>{{ tutor.password }}</td>
              <td>{{ tutor.experience }}</td>
              <td>{{ tutor.rate }}</td>
              <td>
                <button class="edit-btn" @click="editTutor(tutor)">Edit</button>
                <button class="delete-btn" @click="removeTutor(tutor.id)">Delete</button>
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

/* Background màu xanh lá nhạt */
.tutor-theme {
  background-color: #dfffdc;
  padding: 1rem;
  border-radius: 8px;
}

/* Table & Form - Màu chữ đậm hơn */
.data-table th, .data-table td, label, h2 {
  color: #006400;
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
  background-color: #28a745;
  color: white;
}

/* Các button khác nhạt hơn */
.btn-group .inactive {
  background-color: #b5e7a0;
  color: #006400;
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
