import axios from 'axios';



export default {
  createSubject(payload) {
    return axios.post('https://localhost:7050/api/Subjects/create-subject', payload);
  },
  getSubjects() { return axios.get('https://localhost:7050/api/Subjects/get-all-subjects') },

  updateSubject(id, subject) {
    return axios.put(`https://localhost:7050/api/Subjects/update-subject/${id}`, subject)
  },
  
  deleteSubject(id) {
    return axios.delete(`https://localhost:7050/api/Subjects/delete-subject/${id}`)
  }
};
