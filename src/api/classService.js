// src/api/classService.js
import axios from 'axios';

const CLASS_API_URL = 'https://dummyjson.com/products';

export default {
  getClasses() {
    return axios.get(CLASS_API_URL);
  },

  createClass(newClass) {
    return axios.post(`${CLASS_API_URL}/add`, newClass);
  }
};