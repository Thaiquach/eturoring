<template>
    <div class="chat-container">
      <ClassList @selectClass="selectClass" />
      <UserList v-if="selectedClass" :classData="selectedClass" @selectUser="selectUser" />
      <MessageBox v-if="selectedUser" :receiver="selectedUser" />
    </div>
  </template>
  
  <script>
  import ClassList from './ClassList.vue';
  import UserList from './UserList.vue';
  import MessageBox from './MessageBox.vue';
  
  export default {
    components: { ClassList, UserList, MessageBox },
    data() {
      return {
        selectedClass: null,
        selectedUser: null
      };
    },
    methods: {
      selectClass(classData) {
        this.selectedClass = classData;
        this.selectedUser = null;
      },
      selectUser(user) {
        this.selectedUser = user;
      }
    }
  };
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    gap: 20px;
  }
  </style>
  