<script setup>
import { ref, watch } from 'vue';
//import { addStudent, updateStudent, fetchStudents } from '../api/studentService';
import studentService from '../api/studentService';

const props = defineProps(['editingStudent']);
const emit = defineEmits(['studentUpdated']);

const id = ref(null);
const fullName = ref('');
const studentCode = ref('');
const email = ref('');
const userName = ref('');

const course = ref('');
const status = ref('');



watch(() => props.editingStudent, (newVal) => {
  if (newVal) {
    console.log("Editing student with id:", newVal.id);
    id.value = newVal.id;
    // Lấy thông tin từ nested user object
    fullName.value = newVal.user?.fullName || '';
    email.value = newVal.user?.email || '';
    userName.value = newVal.user?.userName || '';
    
    // Các field khác
    studentCode.value = newVal.studentCode || '';
    course.value = newVal.course || '';
    status.value = newVal.status || '';
    
    // Nếu backend không trả về password, bạn có thể để rỗng để nhập lại
    //password.value = '';
  
  }
}, { deep: true });

const submitForm = async () => {
  let updatedStudent = null;

  
  const studentPayload = {
    //fullName: fullName.value,
    StudentCode: studentCode.value,
    //email: email.value,
    //userName: userName.value,
    
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

  course.value = '';
  status.value = '';
};

</script>

<template>
  <form @submit.prevent="submitForm" class="form-container student-theme">
    <h3>{{ id ? 'Edit Student' : 'Add Student' }}</h3>

    <!-- <div class="input-group">
      <input v-model="fullName" required placeholder="fullName" />
    </div> -->

    <div class="input-group">
      <input v-model="studentCode" required placeholder="Student ID" />
    </div>

    <!-- <div class="input-group">
      <input v-model="email" type="email" required placeholder="Email" />
    </div> -->

    <!-- <div class="input-group">
      <input v-model="userName" required placeholder="userName" />
    </div> -->

    <!-- <div class="input-group">
      <input v-model="password" type="password" required placeholder="Password" />
    </div> -->

    <div class="input-group">
      <input v-model="course" required placeholder="course" />
    </div>

    <div class="input-group">
      <input v-model="status" required placeholder="status" />
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
