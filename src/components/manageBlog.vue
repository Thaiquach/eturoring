<template>
  <userLayout>
    <div class="blog-container">
      <!-- Header với nút Add New Blog -->
      <div class="header">
        <h2>Student_Blog</h2>
        <button v-if="!isAdmin" @click="showCreateForm = true" class="add-btn">
          ➕ Add New Blog
        </button>
      </div>

      <!-- Form tạo/chỉnh sửa blog -->
      <CreateBlogForm
        v-if="showCreateForm"
        :editingBlog="editingBlog"
        @blogUpdated="handleBlogUpdated"
        @close="showCreateForm = false"
      />

      <!-- Danh sách Blog -->
      <div v-for="blog in sortedBlogs" :key="blog.id" class="blog-card">
        <!-- Header: Thông tin người đăng -->
        <div class="blog-header">
          <div class="blog-info">
            <div class="username"><strong>{{ blog.user }}</strong></div>
            <div class="timestamp">{{ formatDate(blog.createdAt) }}</div>
          </div>
          <!-- Icon Edit/Delete nếu có quyền -->
          <div class="blog-actions">
            <button v-if="canEdit(blog)" class="edit-btn" @click="editBlog(blog)">
              ✏️
            </button>
            <button v-if="canDelete(blog)" class="delete-btn" @click="removeBlog(blog.id)">
              🗑️
            </button>
          </div>
        </div>

        <!-- Body: Nội dung blog -->
        <div class="blog-body">
          <h3>{{ blog.title }}</h3>
          <div v-if="isImage(blog.url)">
            <img :src="getFileUrl(blog.url)" alt="Uploaded image" class="blog-image" />
          </div>
          <div v-else>
            <a :href="getFileUrl(blog.url)" target="_blank">Download document</a>
          </div>
          <p>{{ blog.content }}</p>
        </div>
      </div>
    </div>
  </userLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import userLayout from './userLayout.vue';
import blogService from '../api/blogService';
import CreateBlogForm from './createBlogForm.vue';

const blogs = ref([]);
const editingBlog = ref(null);
const showCreateForm = ref(false);
const BASE_API_URL = 'https://localhost:7050';

// ✅ Tải danh sách blog từ API
const loadBlogs = async () => {
  try {
    const response = await blogService.getAllBlogs();
    blogs.value = response;
  } catch (error) {
    console.error("Error loading blogs:", error);
  }
};

// ✅ Định dạng ngày giờ
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// ✅ Sắp xếp blog theo thời gian giảm dần
const sortedBlogs = computed(() =>
  blogs.value.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
);

const isImage = (url) => {
  const ext = url.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
};

const getFileUrl = (url) => {
  if (!url) return '/placeholder.jpg';
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  return `${BASE_API_URL}${url}`;
};

const isAdmin = computed(() => {
  return localStorage.getItem("role")?.toLowerCase() === "admin";
});

const canEdit = (blog) => {
  // Chỉ cho phép chỉnh sửa nếu người tạo blog trùng với username của người đang đăng nhập
  const storedUsername = localStorage.getItem("username");
  return blog.user === storedUsername;
};

const canDelete = (blog) => {
  // Cho phép xóa nếu blog được tạo bởi chính người dùng hoặc nếu vai trò của người dùng là admin
  const storedUsername = localStorage.getItem("username");
  const storedRole = localStorage.getItem("role")?.toLowerCase();
  return (blog.user === storedUsername) || (storedRole === "admin");
};




// ✅ Sửa blog
const editBlog = (blog) => {
  editingBlog.value = { ...blog };
  showCreateForm.value = true;
};

// ✅ Xóa blog
const removeBlog = async (id) => {
  if (confirm('Are you sure you want to delete this blog?')) {
    const success = await blogService.deleteBlog(id);
    if (success) {
      blogs.value = blogs.value.filter((b) => b.id !== id);
    }
  }
};

// ✅ Xử lý cập nhật blog
const handleBlogUpdated = (updatedBlog) => {
  const index = blogs.value.findIndex((b) => b.id === updatedBlog.id);
  if (index !== -1) {
    blogs.value[index] = updatedBlog;
  } else {
    blogs.value.push(updatedBlog);
  }
  showCreateForm.value = false;
};

onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("⚠️ No token found. Redirecting to login...");
    window.location.href = "/login";
  } else {
    loadBlogs(); // Tải danh sách blog nếu token hợp lệ
  }
});
</script>

<style scoped>
.blog-container {
  flex: 0 0 70%;
  background: #fff;
  padding: 100px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Right sidebar */
.right-sidebar {
  flex: 0 0 28%;
  background: #fff;
  padding: 100px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* Add New Button */
.add-btn {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Blog Card */
.blog-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Blog Header */
.blog-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

/* Blog Info */
.blog-info {
  flex: 1;
}

.username {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 2px;
}

.timestamp {
  font-size: 12px;
  color: #999;
}

/* Blog Body */
.blog-body {
  text-align: left;
}

.image-container {
  width: 20px;  /* Chỉnh sửa kích thước theo ý muốn */
  height: 20px;
  overflow: hidden;
  border-radius: 8px;
  margin-top: 8px;
}

.blog-image {
  width: 50%;
  height: 50%;
  object-fit: cover;
}
/* Blog Actions */
.blog-actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-left: 8px;
}

.edit-btn {
  color: #ff9800;
}

.delete-btn {
  color: #f44336;
}
</style>
