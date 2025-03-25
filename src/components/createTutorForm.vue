<script setup>
import { ref, watch } from 'vue';
import { addTutor, updateTutor, fetchTutors } from '../api/tutorService';

const props = defineProps(['editingTutor']);
const emit = defineEmits(['tutorUpdated']);

const id = ref(null);
const fullname = ref('');
const email = ref('');
const username = ref('');
const password = ref('');
const experience = ref('');
const rate = ref('');

watch(() => props.editingTutor, (newVal) => {
  if (newVal) {
    id.value = newVal.id;
    fullname.value = newVal.fullname;
    email.value = newVal.email;
    username.value = newVal.username;
    password.value = newVal.password;
    experience.value = newVal.experience;  // Fixed: Now captures Experience
    rate.value = newVal.rate;  // Fixed: Now captures Rate
  }
}, { deep: true });

const submitForm = async () => {
  if (id.value) {
    await updateTutor({
      id: id.value,
      fullname: fullname.value,
      email: email.value,
      username: username.value,
      password: password.value,
      experience: experience.value,
      rate: rate.value
    });
  } else {
    await addTutor({
      fullname: fullname.value,
      email: email.value,
      username: username.value,
      password: password.value,
      experience: experience.value,
      rate: rate.value
    });
  }

  emit('tutorUpdated', await fetchTutors());

  id.value = null;
  fullname.value = '';
  email.value = '';
  username.value = '';
  password.value = '';
  experience.value = '';  // Fixed: Reset fields properly
  rate.value = '';  // Fixed: Reset fields properly
};
</script>

<template>
  <form @submit.prevent="submitForm" class="form-container tutor-theme">
    <h3>{{ id ? 'Edit Tutor' : 'Add Tutor' }}</h3>

    <div class="input-group">
      <input v-model="fullname" required placeholder="Fullname" />
    </div>

    <div class="input-group">
      <input v-model="email" type="email" required placeholder="Email" />
    </div>

    <div class="input-group">
      <input v-model="username" required placeholder="Username" />
    </div>

    <div class="input-group">
      <input v-model="password" type="password" required placeholder="Password" />
    </div>

    <div class="input-group">
      <input v-model="experience" required placeholder="Experience (Years)" />
    </div>

    <div class="input-group">
      <input v-model="rate" required placeholder="Rating" />
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

input {
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #28a745;
  font-size: 14px;
  outline: none;
  background: transparent;
  transition: border-bottom 0.3s ease;
  margin-bottom: 12px;
}

input:focus {
  border-bottom: 2px solid #218838;
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

.tutor-theme {
  border-left: 5px solid #28a745;
}
</style>
