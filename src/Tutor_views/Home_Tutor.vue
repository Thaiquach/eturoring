<template>
    <div class="student-main-container">
      <!-- Nội dung chính -->
      <div class="main-content">
        <!-- Header: Nút tạo blog -->
        <div class="header">
          <h2>Trang ơi, bạn đang nghĩ gì thế?</h2>
        <!-- Nút Tạo Blog -->
        <button class="open-form-btn" @click="showForm = true">
          <i class="fa fa-pencil"></i>
          Tạo Blog
        </button>
        </div>
  
        <!-- Form tạo/chỉnh sửa blog (BlogForm) -->
        <blog-form
          v-if="showForm"
          :blog="formData"
          :editing="isEditing"
          @save-blog="handleSaveBlog"
          @cancel="handleCancelForm"
        />
  
        <!-- Danh sách blog hiển thị -->
        <div class="blog-list">
          <div class="blog-item" v-for="(blog, index) in blogs" :key="index">
            <div class="blog-header">
              <h3>{{ blog.title }}</h3>
              <div class="blog-actions">
                <button @click="handleEditBlog(index)">
                  <i class="fa fa-edit"></i> Sửa
                </button>
                <button @click="handleDeleteBlog(index)">
                  <i class="fa fa-trash"></i> Xóa
                </button>
              </div>
            </div>
            <p class="blog-content">{{ blog.content }}</p>
            <div class="blog-meta">
              <span>Tác giả: {{ blog.author }}</span> |
              <span>Đăng lúc: {{ blog.post_at }}</span>
            </div>
  
            <!-- Khu vực comment (Comments) -->
            <comments
              :comments="blog.comments"
              @add-comment="(commentText) => handleAddComment(index, commentText)"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import BlogForm from "../components/BlogForm.vue";
  import Comments from "../components/Comment.vue";
  
  export default {
    name: "Home_Tutor",
    components: {
      BlogForm,
      Comments,
    },
    data() {
      return {
        // Quản lý form
        showForm: false,
        isEditing: false,
        editingIndex: null,
  
        // Dữ liệu form
        formData: {
          title: "",
          content: "",
          author: "",
          post_at: "",
        },
  
        // Danh sách blog
        blogs: [],
      };
    },
    mounted() {
      // Khi component mount, tự động gọi API để lấy dữ liệu
      this.fetchBlogs();
    },
    methods: {
      // Gọi GET request đến dummyjson.com/products để "bắt" dữ liệu
      async fetchBlogs() {
        try {
          const response = await axios.get("https://dummyjson.com/products");
          // Kết quả trả về có dạng { products: [ {id, title, description, ...}, ... ] }
          const rawProducts = response.data.products;
  
          // Chuyển dữ liệu products thành cấu trúc blog
          this.blogs = rawProducts.map((p) => {
            return {
              title: p.title,
              content: p.description,   // Lấy description làm content
              author: p.brand,         // Lấy brand làm author
              post_at: new Date().toLocaleString(), // Gắn thời gian hiện tại
              comments: [],            // Khởi tạo mảng comments rỗng
            };
          });
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu từ dummy API:", error);
        }
      },
  
      // Xử lý khi lưu blog (thêm hoặc cập nhật)
      handleSaveBlog(newBlogData) {
        if (this.isEditing && this.editingIndex !== null) {
          // Cập nhật blog
          this.blogs[this.editingIndex] = {
            ...this.blogs[this.editingIndex],
            ...newBlogData,
          };
        } else {
          // Thêm blog mới
          this.blogs.push({ ...newBlogData, comments: [] });
        }
        this.handleCancelForm();
      },
  
      // Huỷ form (đóng form, reset trạng thái)
      handleCancelForm() {
        this.showForm = false;
        this.isEditing = false;
        this.editingIndex = null;
        this.formData = {
          title: "",
          content: "",
          author: "",
          post_at: "",
        };
      },
  
      // Mở form ở chế độ sửa blog
      handleEditBlog(index) {
        this.editingIndex = index;
        const blog = this.blogs[index];
        this.formData = {
          title: blog.title,
          content: blog.content,
          author: blog.author,
          post_at: blog.post_at,
        };
        this.isEditing = true;
        this.showForm = true;
      },
  
      // Xoá blog
      handleDeleteBlog(index) {
        if (confirm("Bạn có chắc chắn muốn xóa blog này?")) {
          this.blogs.splice(index, 1);
        }
      },
  
      // Thêm comment
      handleAddComment(index, commentText) {
        this.blogs[index].comments.push(commentText);
      },
    },
  };
  </script>
  
  <style scoped>
  .student-main-container {
    display: flex;
    font-family: Arial, sans-serif;
  }
  .main-content {
    flex: 1;
    padding: 0 20px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
  }
  .header h2 {
    margin: 0;
    font-size: 1.2rem;
  }
  .open-form-btn {
    background-color: #4caf50;
    color: #fff;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
  }
  .blog-list .blog-item {
    border: 1px solid #ccc;
    margin-bottom: 15px;
    padding: 12px;
    border-radius: 4px;
    background: #f9f9f9;
  }
  .blog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .blog-header h3 {
    margin: 0;
  }
  .blog-actions button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-left: 5px;
    color: #333;
  }
  .blog-actions button i {
    margin-right: 5px;
  }
  .blog-content {
    margin: 10px 0;
  }
  .blog-meta {
    font-size: 0.9rem;
    color: #666;
  }
  </style>
  