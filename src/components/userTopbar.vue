<template>
    <header class="user-topbar">
      <button @click="$emit('logout')">Logout</button>
    </header>
  </template>
  
  <script>
  export default {
    name: "userTopbar"
  };
  </script>
  
  <style scoped>
  .user-topbar {
    background-color: #333;
    color: white;
    padding: 10px;
    text-align: right;
  }
  </style>
  