<template>
    <div class="user-list">
      <h3>Danh sách người dùng trong lớp {{ classData.className }}</h3>
      <h4>Tutor:</h4>
      <div v-if="classData.tutor" @click="selectUser(classData.tutor.user)">
        👨‍🏫 {{ classData.tutor.user.fullName }}
      </div>
  
      <h4>Students:</h4>
      <ul>
        <li v-for="student in classData.classStudents" :key="student.student.user.id" @click="selectUser(student.student.user)">
          🎓 {{ student.student.user.fullName }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      classData: Object
    },
    methods: {
      selectUser(user) {
        this.$emit('selectUser', user);
      }
    }
  };
  </script>
  
  <style scoped>
  .user-list ul {
    list-style: none;
    padding: 0;
  }
  
  .user-list li,
  .user-list div {
    padding: 10px;
    cursor: pointer;
    border: 1px solid #ccc;
    margin-bottom: 5px;
  }
  
  .user-list li:hover,
  .user-list div:hover {
    background-color: #f0f0f0;
  }
  </style>
  