<template>
    <div class="student-main-container">
      <div class="main-content">
        <!-- Header: Nút tạo blog -->
        <div class="header">
          <h2>Trang ơi, bạn đang nghĩ gì thế?</h2>
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
  import BlogForm from "@/components/BlogForm.vue";
  import Comments from "@/components/Comments.vue";
  
  export default {
    name: "StudentMain",
    components: {
      BlogForm,
      Comments,
    },
    data() {
      return {
        // Giả sử đây là ID của người dùng hiện tại (có thể lấy từ store hoặc auth)
        currentUserId: "user123",
        
        showForm: false,
        isEditing: false,
        editingIndex: null,
  
        // Dữ liệu form chỉ gồm title và content (author, post_at sẽ tự gán)
        formData: {
          title: "",
          content: "",
        },
  
        // Danh sách blog
        blogs: [],
      };
    },
    methods: {
      async handleSaveBlog(newBlogData) {
        try {
          // Gán author và post_at tự động
          newBlogData.author = this.currentUserId;
          newBlogData.post_at = new Date().toISOString();
  
          // Gửi yêu cầu POST đến dummy API (nếu cần xử lý phía backend)
          const response = await axios.post(
            "https://dummyjson.com/products/add",
            newBlogData
          );
          console.log("Response từ API:", response.data);
  
          // Cập nhật danh sách blog với dữ liệu trả về hoặc newBlogData
          // Ở đây chúng ta dùng newBlogData vì dummy API có thể trả về định dạng khác
          if (this.isEditing && this.editingIndex !== null) {
            this.blogs[this.editingIndex] = {
              ...this.blogs[this.editingIndex],
              ...newBlogData,
            };
          } else {
            this.blogs.push({ ...newBlogData, comments: [] });
          }
          this.handleCancelForm();
        } catch (error) {
          console.error("Lỗi khi tạo blog:", error);
        }
      },
  
      handleCancelForm() {
        this.showForm = false;
        this.isEditing = false;
        this.editingIndex = null;
        // Reset form chỉ cần title và content
        this.formData = {
          title: "",
          content: "",
        };
      },
  
      handleEditBlog(index) {
        this.editingIndex = index;
        const blog = this.blogs[index];
        // Cập nhật formData từ blog hiện tại (lưu ý không ghi đè author, post_at vì chúng tự gán)
        this.formData = {
          title: blog.title,
          content: blog.content,
        };
        this.isEditing = true;
        this.showForm = true;
      },
  
      handleDeleteBlog(index) {
        if (confirm("Bạn có chắc chắn muốn xóa blog này?")) {
          this.blogs.splice(index, 1);
        }
      },
  
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
  