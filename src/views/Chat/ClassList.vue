<template>
    <div class="class-list">
      <h3>Danh sách lớp học</h3>
      <ul>
        <li v-for="classData in classes" :key="classData.id" @click="selectClass(classData)">
          {{ classData.className }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import classService from '../../api/classService';
  
  export default {
    data() {
      return {
        classes: []
      };
    },
    async created() {
      const response = await classService.getAllClasses();
      this.classes = response.data;
    },
    methods: {
      selectClass(classData) {
        this.$emit('selectClass', classData);
      }
    }
  };
  </script>
  
  <style scoped>
  .class-list ul {
    list-style: none;
    padding: 0;
  }
  
  .class-list li {
    padding: 10px;
    cursor: pointer;
    border: 1px solid #ccc;
    margin-bottom: 5px;
  }
  
  .class-list li:hover {
    background-color: #f0f0f0;
  }
  </style>
  