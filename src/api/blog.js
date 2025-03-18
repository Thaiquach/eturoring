import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Thay API phù hợp

const blog = {
  async fetchBlogs() {
    try {
      const response = await axios.get(API_URL);
      return response.data.map((post) => ({
        title: post.title,
        content: post.body,
        author: "Admin", // API này không có author, đặt mặc định
        post_at: new Date().toLocaleString(),
        comments: [],
      }));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu blog:", error);
      return [];
    }
  },

  async saveBlog(newBlogData, isEditing, blogs, editingIndex) {
    try {
      newBlogData.post_at = new Date().toISOString();
      
      let response;
      if (isEditing && editingIndex !== null) {
        response = await axios.put(`${API_URL}/${blogs[editingIndex].id}`, newBlogData);
        blogs[editingIndex] = { ...blogs[editingIndex], ...response.data };
      } else {
        response = await axios.post(API_URL, newBlogData);
        blogs.push({ ...response.data, comments: [] });
      }

      return blogs;
    } catch (error) {
      console.error("Lỗi khi lưu blog:", error);
      return blogs;
    }
  }
};

export default blog;
