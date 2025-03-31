<script setup>
import { ref, watch } from 'vue';
import studentService from '../api/studentService';

const props = defineProps(['editingStudent']);
const emit = defineEmits(['studentUpdated']);

const id = ref(null);
const fullName = ref('');
const studentCode = ref('');
const email = ref('');
const userName = ref('');
const password = ref('');
const course = ref('');
const status = ref('');



watch(() => props.editingStudent, (newVal) => {
  if (newVal) {
    console.log("Editing student with id:", newVal.id);
    id.value = newVal.id;
    fullName.value = newVal.user?.fullName || '';
    email.value = newVal.user?.email || '';
    userName.value = newVal.user?.userName || '';
    password.value = newVal.password || '';
    studentCode.value = newVal.studentCode || '';
    course.value = newVal.course || '';
    status.value = newVal.status || '';
    
  
  }
}, { deep: true });

const submitForm = async () => {
  let updatedStudent = null;

  
  const studentPayload = {
    FullName: fullName.value,
    StudentCode: studentCode.value,
    Email: email.value,
    UserName: userName.value,
    Password: password.value,
    
    Course: course.value,
    Status: status.value
  };

  if (id.value) {
    console.log("Submit form update student, id:", id.value);
    const success = await studentService.updateStudent(id.value, studentPayload);
    if (success) {
      updatedStudent = { id: id.value, ...studentPayload };
    }
  } else {
    const success = await studentService.createStudent(studentPayload);
    if (success) {
      updatedStudent = { id: Date.now(), ...studentPayload };
    }
  }

  if (updatedStudent) {
    emit('studentUpdated', updatedStudent);
  }

  id.value = null;
  fullName.value = '';
  studentCode.value = '';
  email.value = '';
  userName.value = '';
  password.value = '';
  course.value = '';
  status.value = '';
};

</script>

<template>
  <form @submit.prevent="submitForm" class="form-container student-theme">
    <h3>{{ id ? 'Edit Student' : 'Add Student' }}</h3>

    <!-- Full Name -->
    <div class="input-group">
      <label for="fullName" class="input-label">Full Name</label>
      <input id="fullName" v-model="fullName" required placeholder="Full Name" :disabled="id" />
    </div>

    <!-- Student ID -->
    <div class="input-group">
      <label for="studentCode" class="input-label">Student ID</label>
      <input id="studentCode" v-model="studentCode" required placeholder="Student ID" />
    </div>

    <!-- Email -->
    <div class="input-group">
      <label for="email" class="input-label">Email</label>
      <input id="email" v-model="email" type="email" required placeholder="Email" :disabled="id" />
    </div>

    <!-- Username -->
    <div class="input-group">
      <label for="userName" class="input-label">Username</label>
      <input id="userName" v-model="userName" required placeholder="Username" :disabled="id" />
    </div>

    <!-- Password -->
    <div class="input-group">
      <label for="password" class="input-label">Password</label>

      <input id="password" v-model="password" type="password" required placeholder="******" :disabled="id" />
    </div>

    <!-- Course Dropdown -->
    <div class="input-group">
      <label for="course" class="input-label">Course</label>
      <div class="select-group">
        <select id="course" v-model="course" @change="handleCourseChange" required>
          <option disabled value="">Select Course</option>
          <option value="IT">IT</option>
          <option value="Business">Business</option>
          <option value="Design">Design</option>
        </select>
        <span class="custom-arrow">&#9662;</span>
      </div>
    </div>

    <!-- Status -->
    <div class="input-group">
      <label for="status" class="input-label">Status</label>
      <input id="status" v-model="status" required placeholder="Status" />
    </div>

    <button type="submit">{{ id ? 'Update Student' : 'Add Student' }}</button>
  </form>
</template>

<style scoped>
.form-container {
  width: 280px;
  padding: 16px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: transform 0.2s ease-in-out;
}

.form-container:hover {
  transform: translateY(-5px);
}

.input-group {
  position: relative;
  margin-bottom: 12px;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #007bff;
  font-size: 14px;
  outline: none;
  background: transparent;
  transition: border-bottom 0.3s ease;
}

.input-group input:focus {
  border-bottom: 2px solid #0056b3;
}

/* Custom styling cho dropdown */
.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.input-label {
  flex: 0 0 80px; /* Chiều rộng cố định cho label */
  color: #007bff; /* Màu xanh blue */
  font-weight: bold;
  text-align: left;
  margin-right: 8px;
}

.select-group {
  position: relative;
  flex: 1;
}

.select-group select {
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #007bff;
  font-size: 14px;
  outline: none;
  background: transparent;
  transition: border-bottom 0.3s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.select-group select:focus {
  border-bottom: 2px solid #0056b3;
}

.select-group .custom-arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 14px;
  color: #007bff;
}
button {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  font-weight: bold;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #0056b3;
}

/* Blue Theme Border */
.student-theme {
  border-left: 5px solid #007bff;
}
</style>