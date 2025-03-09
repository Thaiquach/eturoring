<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="Enter username" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Enter password" 
            required 
          />
        </div>
        <button type="submit">Login</button>
        <p v-if="errorMessage" style="color:red;">{{ errorMessage }}</p>
      </form>
    </div>
    <button>A</button>
    <button>A</button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import authService from '../api/authService.js';  // Dùng đường dẫn tương đối
  
  const username = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  async function handleLogin() {
    try {
      const response = await authService.login({
        username: username.value,
        password: password.value
      });
      // Kiểm tra nếu login thành công, giả sử token có trong response.data.token
      const token = response.data.accessToken;
      if (token) {
        localStorage.setItem('token', token);
        router.push('/homeview');
      } else {
        errorMessage.value = response.data.message || 'Login failed';
      }
    } catch (error) {
      errorMessage.value = error.response?.data?.message || error.message || 'An error occurred during login.';
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  label {
    display: block;
    margin-bottom: 5px;
  }
  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  button {
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>
  