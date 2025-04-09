<template>
  <div class="student-schedule">
    <h2>📘 Lịch học của bạn</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Ngày</th>
          <th>Thứ</th>
          <th>Ca</th>
          <th>Khung giờ</th>
          <th>Link học</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(sch, index) in mySchedules" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ formatDate(sch.scheduleDate) }}</td>
          <td>{{ getDayLabel(sch.day) }}</td>
          <td>Slot {{ sch.slot }}</td>
          <td>{{ getSlotTime(sch.slot) }}</td>
          <td>
            <a :href="sch.linkMeeting" target="_blank">🔗 Vào lớp</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import jwtDecode from 'jwt-decode';
import classService from '../api/classService';
import scheduleService from '../api/scheduleService';
import classroomService from '../api/classroomService';

const studentId = ref(null);
const tutorId = ref(null);
const myClasses = ref([]);
const allSchedules = ref([]);
const mySchedules = ref([]);
const classrooms = ref([]);
const classes = ref([]);

const getDayLabel = (day) => {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return days[day] || '???';
};

const getSlotTime = (slot) => {
  const slots = {
    1: '08:00 - 09:30',
    2: '09:30 - 11:00',
    3: '14:00 - 15:30',
    4: '15:30 - 17:00'
  };
  return slots[slot] || '??';
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
};

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('❗ Bạn chưa đăng nhập!');
    return;
  }

  const decoded = jwtDecode(token);
  studentId.value = decoded['StudentId'];
  tutorId.value = decoded['TutorId'];

  console.log('🔑 Token đã giải mã:', decoded);
  console.log('🆔 StudentId:', studentId.value);
  console.log('🆔 TutorId:', tutorId.value);

  try {
    const classRes = await classService.getAllClasses();
    classes.value = classRes.data;
    const roomRes = await classroomService.getAllClassrooms();
    classrooms.value = roomRes.data;

    if (studentId.value) {
      myClasses.value = classes.value.filter((cls) =>
        cls.studentIds.includes(Number(studentId.value))
      );
    } else if (tutorId.value) {
      myClasses.value = classes.value.filter((cls) =>
        cls.tutorId === Number(tutorId.value)
      );
    } else {
      alert('Không xác định được vai trò người dùng!');
      return;
    }

    console.log('📘 Các lớp của tôi:', myClasses.value);

    const scheduleRes = await scheduleService.getAllSchedules();
    allSchedules.value = scheduleRes.data;

    const myClassIds = myClasses.value.map((cls) => cls.id);
    mySchedules.value = allSchedules.value.filter((s) =>
      myClassIds.includes(s.classId)
    );

    console.log('🗓️ Lịch học của tôi:', mySchedules.value);
  } catch (err) {
    console.error('❌ Lỗi khi tải dữ liệu:', err);
  }
});
</script>

<style scoped>
.student-schedule {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #f4f4f4;
}
a {
  color: #007bff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
