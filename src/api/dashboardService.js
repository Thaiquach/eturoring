// 📁 src/api/dashboardService.js
import axios from 'axios';

const BASE_URL = 'https://localhost:7050/api';
const token = () => localStorage.getItem('token');

export default {
  getDashboardData() {
    return axios.get(`${BASE_URL}/Dashboard`, {
      headers: { Authorization: `Bearer ${token()}` }
    });
  }
};
