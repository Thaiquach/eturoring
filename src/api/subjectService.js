import axios from 'axios';


const BASE_URL = 'https://localhost:7050/api/Subjects';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};
``
export default {
  createSubject(payload) {
    return axios.post(`https://localhost:7050/api/Subjects/create-subject`, payload, getAuthHeaders());
  },
  getSubjects() { return axios.get(`https://localhost:7050/api/Subjects/get-all-subjects`, getAuthHeaders()) },

  updateSubject(id, subject) {
    return axios.put(`https://localhost:7050/api/Subjects/${id}`, subject, getAuthHeaders())
  },
  
  deleteSubject(id) {
    return axios.delete(`https://localhost:7050/api/Subjects/delete-subject/${id}`,getAuthHeaders())

  }
};
