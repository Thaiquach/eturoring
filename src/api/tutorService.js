
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
  const tutorData = await axios.get('https://localhost:7050/api/profile/tutors', getAuthHeaders());
  console.log(tutorData
  );
  return tutorData;
  
};

const createTutor = async (tutor) => {
  try {
    const response = await axios.post('https://localhost:7050/api/account/register-tutor', tutor, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating tutor:', error);
    if (error.response && error.response.data) {
      console.error('📛 Backend says:', error.response.data);
    }
    throw error;
  }
};

const updateTutor = async (id, tutor) => {
  try {
    const response = await axios.put(`https://localhost:7050/api/profile/update-tutor/${id}`, tutor, getAuthHeaders());
    console.log("Response:", response, "ID:", id); 
    return response.data;
  } catch (error) {
    console.error('Error updating tutor:', error);
    if (error.response && error.response.data) {
      console.error('📛 Backend says:', error.response.data);
    }
    throw error;
  }
};

const deleteTutor = async (id) => {
  try {
    await axios.delete(`https://localhost:7050/api/profile/delete-tutor/${id}`, getAuthHeaders());
    return true;
  } catch (error) {
    console.error('Error deleting tutor:', error);
    if (error.response && error.response.data) {
      console.error('📛 Backend says:', error.response.data);
    }
    return false;
  }
};
export default {
  getAll,
  createTutor,
  updateTutor,
  deleteTutor,

};

