import axios from 'axios';
const BASE_URL = 'https://localhost:7050/api';

const token = localStorage.getItem('token');

export default {
  sendMessage(message) {
    return axios.post(`${BASE_URL}/Messages/send`, message, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  getConversation(receiverId) {
    return axios.get(`${BASE_URL}/Messages/conversation/${receiverId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
