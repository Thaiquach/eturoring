import axios from 'axios'

const API_URL = 'https://localhost:7050/api/account/login'

export default {
  login(credentials) {
    return axios.post(API_URL, {
      username: credentials.username,
      password: credentials.password 
    })
  }
}