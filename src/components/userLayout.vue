<template>
    <div class="user-layout">
      <userSidebar />
      <div class="main-content">
        <userTopbar @logout="logout" />
        <div class="content">
          <slot></slot>
        </div>
        <footer class="footer">
          <p>&copy; Website E-Tutoring</p>
        </footer>
      </div>
    </div>
  </template>
  
  <script>
  import userSidebar from './userSidebar.vue';
  import userTopbar from './userTopbar.vue';
  
  export default {
    name: "userLayout",
    components: {
      userSidebar,
      userTopbar
    },
    methods: {
      logout() {
        localStorage.removeItem("token");
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .user-layout {
    display: flex;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .content {
    flex: 1;
    padding: 20px;
  }
  
  .footer {
    background-color: #ddd;
    text-align: center;
    padding: 10px;
  }
  </style>
  