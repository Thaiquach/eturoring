<template>
    <div class="home-container">
      <h1>Welcome Home!</h1>
      <p>Your token: {{ token }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const token = ref('');
  
  onMounted(() => {
    token.value = localStorage.getItem('token') || 'No token found';
  });
  </script>
  
  <style scoped>
  .home-container {
    text-align: center;
    padding: 20px;
  }
  </style>
  