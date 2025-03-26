import axios from 'axios';


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const getAll = async () => {
  const studentData = await axios.get('https://localhost:7050/api/profile/students', getAuthHeaders());
  console.log(studentData);
  return studentData;
};


const createStudent = async (student) => {
  try {
    const response = await axios.post('https://localhost:7050/api/account/register-student', student, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    if (error.response && error.response.data) {
      console.error('📛 Backend says:', error.response.data);
    }
    throw error;
  }
};

const updateStudent = async (id, student) => {
  try {
    const response = await axios.put(`https://localhost:7050/api/profile/update-student/${id}`, student, getAuthHeaders());
    console.log("Response:", response, "ID:", id); 
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    if (error.response && error.response.data) {
      console.error('📛 Backend says:', error.response.data);
    }
    throw error;
  }
};
const deleteStudent = async (id) => {
  try {
    await axios.delete(`https://localhost:7050/api/profile/delete-student/${id}`, getAuthHeaders());
    return true;
  } catch (error) {
    console.error('Error deleting student:', error);
    if (error.response && error.response.data) {
      console.error('📛 Backend says:', error.response.data);
    }
    return false;
  }
};

export default {
  getAll,
  createStudent,
  updateStudent,
  deleteStudent,
};
