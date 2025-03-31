import axios from 'axios';

const BASE_URL = 'https://localhost:7050/api';

export default {
  // Lấy toàn bộ danh sách student
  getAllStudents() {
    const token = localStorage.getItem('token');
    return axios.get(`${BASE_URL}/profile/students`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Gửi dữ liệu tạo lớp học mới
  createClass(classData) {
    const token = localStorage.getItem('token');
    return axios.post(`${BASE_URL}/Class/create-class`, classData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Lấy danh sách tutor (đính kèm token)
  getAllTutors() {
    const token = localStorage.getItem('token');
    return axios.get(`${BASE_URL}/profile/tutors`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Lấy danh sách subject
  getAllSubjects() {
    return axios.get(`${BASE_URL}/Subjects/get-all-subjects`);
  },
  getAllClasses() {
    const token = localStorage.getItem('token');
    return axios.get(`${BASE_URL}/Class/get-all-classes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  updateClass(id, classData) {
    const token = localStorage.getItem('token');
    return axios.put(`${BASE_URL}/Class/update-class/${id}`, classData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

};




