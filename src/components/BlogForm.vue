<template>
    <div class="blog-form">
      <label>Title:</label>
      <input type="text" v-model="localBlog.title" placeholder="Nhập tiêu đề" />
  
      <label>Content:</label>
      <textarea v-model="localBlog.content" placeholder="Nội dung blog..."></textarea>
  
      <div class="form-actions">
        <button @click="onSubmit">
          {{ editing ? "Cập nhật" : "Xác nhận" }}
        </button>
        <button @click="$emit('cancel')">Hủy</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "BlogForm",
    props: {
      blog: {
        type: Object,
        default: () => ({
          title: "",
          content: "",
        }),
      },
      editing: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        localBlog: { ...this.blog },
      };
    },
    watch: {
      blog(newVal) {
        this.localBlog = { ...newVal };
      },
    },
    methods: {
      onSubmit() {
        this.$emit("save-blog", this.localBlog);
      },
    },
  };
  </script>
  
  <style scoped>
  .blog-form {
    border: 1px solid #ccc;
    padding: 16px;
    margin-bottom: 20px;
    border-radius: 4px;
  }
  .blog-form label {
    display: block;
    margin-top: 10px;
  }
  .blog-form input,
  .blog-form textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .blog-form textarea {
    resize: vertical;
    min-height: 80px;
  }
  .form-actions {
    margin-top: 10px;
  }
  .form-actions button {
    margin-right: 10px;
    padding: 8px 16px;
  }
  </style>
  