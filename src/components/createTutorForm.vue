<script setup>
import { ref, watch } from 'vue';
import tutorService from '../api/tutorService';

const props = defineProps(['editingTutor']);
const emit = defineEmits(['tutorUpdated']);

const id = ref(null);
const fullName = ref('');
const email = ref('');
const userName = ref('');
const password = ref('');
const department = ref('');
const experienceYears = ref(0);
const rating = ref(0);

// Cập nhật giá trị khi props.editingTutor thay đổi
watch(() => props.editingTutor, (newVal) => {
  if (newVal) {
    id.value = newVal.id;
    fullName.value = newVal.fullName || '';
    email.value = newVal.email || '';
    userName.value = newVal.username || '';
    password.value = newVal.password || '';
    department.value = newVal.department || '';
    experienceYears.value = newVal.experienceYears || 0;
    rating.value = newVal.rating || 0;
  }
}, { deep: true });

const submitForm = async () => {
  let updatedTutor = null;

  const tutorPayload = {
    fullName: fullName.value,
    email: email.value,
    username: userName.value,
    password: password.value,
    department: department.value,
    experienceYears: experienceYears.value,
    rating: rating.value
  };

  if (id.value) {
    console.log("Submit form update tutor, id:", id.value);
    const success = await tutorService.updateTutor(id.value, tutorPayload);
    if (success) {
      updatedTutor = { id: id.value, ...tutorPayload };
    }
  } else {
    const success = await tutorService.createTutor(tutorPayload);
    if (success) {
      updatedTutor = { id: Date.now(), ...tutorPayload };
    }
  }

  if (updatedTutor) {
    emit('tutorUpdated', updatedTutor);
  }

  // Reset lại các trường
  id.value = null;
  fullName.value = '';
  email.value = '';
  userName.value = '';
  password.value = '';
  department.value = '';
  experienceYears.value = 0;
  rating.value = 0;
};
</script>

<template>
  <form @submit.prevent="submitForm" class="form-container tutor-theme">
    <h3>{{ id ? 'Edit Tutor' : 'Add Tutor' }}</h3>

    <!-- Full Name -->
    <div class="input-group">
      <label for="fullName" class="input-label">Full Name</label>
      <input id="fullName" v-model="fullName" required placeholder="Full Name" :disabled="id" />
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
      <input id="password" v-model="password" type="password" required placeholder="Password" :disabled="id" />
    </div>

    <!-- Department -->
    <div class="input-group">
<label for="department" class="input-label">Department</label>
      <input id="department" v-model="department" required placeholder="Department" />
    </div>

    <div class="input-group">
      <label for="experienceYears" class="input-label">Experience Years</label>
      <input
        id="experienceYears"
        v-model.number="experienceYears"
        type="number"
        min="1"
        required
        placeholder="Experience Years"
      />
    </div>

    <!-- Rating Dropdown -->
    <div class="input-group">
      <label for="rating" class="input-label">Rating</label>
      <div class="select-group">
        <select id="rating" v-model="rating" required>
          <option disabled value="">Select Rating</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <span class="custom-arrow">&#9662;</span>
      </div>
    </div>

    <button type="submit">{{ id ? 'Update Tutor' : 'Add Tutor' }}</button>
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
  display: flex;
  align-items: center;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #28a745;
  font-size: 14px;
  outline: none;
  background: transparent;
  transition: border-bottom 0.3s ease;
}

.input-group input:focus {
  border-bottom: 2px solid #218838;
}

.input-label {
  flex: 0 0 80px;
  color: #28a745;
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
  border-bottom: 2px solid #28a745;
  font-size: 14px;
  outline: none;
  background: transparent;
  transition: border-bottom 0.3s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.select-group select:focus {
  border-bottom: 2px solid #218838;
}

.select-group .custom-arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 14px;
  color: #28a745;
}

button {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  font-weight: bold;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #218838;
}

/* Green Theme Border */
.tutor-theme {
  border-left: 5px solid #28a745;
}
</style>