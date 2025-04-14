import axios from 'axios';

// Lấy token từ localStorage để thêm Authorization
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Lấy tất cả blog
const getAllBlogs = async () => {
  try {
    const response = await axios.get('https://localhost:7050/api/Blog/all', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

// Tạo blog mới
const createBlog = async (formData) => {
  try {
    const response = await axios.post('https://localhost:7050/api/Blog/create', formData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Lấy chi tiết blog theo ID
const getBlogById = async (id) => {
  try {
    const response = await axios.get(`https://localhost:7050/api/Blog/blog/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog details:', error);
    throw error;
  }
};

// Cập nhật blog
const updateBlog = async (id, blog) => {
  try {
    const response = await axios.put(`https://localhost:7050/api/Blog/update/${id}`, blog, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

// Xóa blog
const deleteBlog = async (id) => {
  try {
    await axios.delete(`https://localhost:7050/api/Blog/delete/${id}`, getAuthHeaders());
    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    return false;
  }
};

export default {
  getAllBlogs,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog
};
