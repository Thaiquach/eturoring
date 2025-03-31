// api/profileService.js
import axios from "axios";

const BASE_URL = "https://localhost:7050/api/profile";

// Lấy thông tin profile của Student qua API
export async function getStudentProfile(studentId, token) {
  try {
    const response = await axios.get(`${BASE_URL}/students/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin student:", error);
    throw error;
  }
}

// Lấy thông tin profile của Tutor qua API
export async function getTutorProfile(tutorId, token) {
  try {
    const response = await axios.get(`${BASE_URL}/tutors/${tutorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tutor:", error);
    throw error;
  }
}


