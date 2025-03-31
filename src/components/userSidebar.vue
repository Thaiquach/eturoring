<template>
    <aside class="user-sidebar">
      <ul>
        <li><router-link to="/schedule">Schedule</router-link></li>
        <li><router-link to="/manageblog">Blog</router-link></li>
        <li><router-link to="/message">Message</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
      </ul>
    </aside>
  </template>
  
  <script>
  export default {
    name: "userSidebar"
  };
  </script>
  
  <style scoped>
  .user-sidebar {
    width: 200px;
    background-color: #f4f4f4;
    padding: 20px;
  }
  .user-sidebar ul {
    list-style: none;
    padding: 0;
  }
  .user-sidebar ul li {
    margin-bottom: 10px;
  }
  </style>
  