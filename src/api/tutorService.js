
import axios from 'axios';

const API_URL = 'http://localhost:7050/api/tutors'; 

// Lấy danh sách tutor từ API
export async function fetchTutors() {
  const response = await axios.get(API_URL);
  return response.data;
}

// Thêm tutor mới vào API
export async function addTutor(tutorData) {
  const response = await axios.post(API_URL, tutorData);
  return response.data;
}

// Cập nhật thông tin tutor
export async function updateTutor(tutorData) {
  const response = await axios.put(`${API_URL}/${tutorData.id}`, tutorData);
  return response.data;
}

// Xóa tutor khỏi API
export async function deleteTutor(id) {
  await axios.delete(`${API_URL}/${id}`);
}

