import axios from 'axios';

const BASE_URL = 'https://localhost:7050/api/Subjects';

export default {
  createSubject(payload) {
    return axios.post(BASE_URL, payload);
  },
  getSubjects() { return axios.get(BASE_URL) },

  updateSubject(id, subject) {
    return axios.put(`https://localhost:7050/api/Subjects/${id}`, subject)
  },
  
  deleteSubject(id) {
    return axios.delete(`https://localhost:7050/api/Subjects/${id}`)
  }
};
