// src/api/authService.js
import axios from 'axios';

const API_URL = 'https://dummyjson.com/auth';

export default {
  login(credentials) {
    return axios.post(`${API_URL}/login`, {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 30
    }, {
    });
  }
};
