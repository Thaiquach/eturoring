// src/api/authService.js
import axios from 'axios';
import { ref, onMounted } from 'vue';

const API_URL = 'https://dummyjson.com/user/login';

export default {
  login(credentials) {
    return axios.post(`${API_URL}`, {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 30
    }, {
    });
  }
};

export function useToken() {
  const token = ref('');

  onMounted(() => {
    token.value = localStorage.getItem('token') || 'No token found';
  });

  return { token };
}
