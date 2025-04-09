<script setup>
import { ref, onMounted, computed } from 'vue'
import TopBar from '../components/TopBar.vue'
import SideBar from '../components/SideBar.vue'
import dashboardService from '../api/dashboardService';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const dashboard = ref({
  totalStudents: 0,
  totalTutors: 0,
  totalClasses: 0,
  lessonsToday: 0,
  monthlyStudentStats: [],
  topTutors: []
});

onMounted(async () => {

  try {
    const res = await dashboardService.getDashboardData();
    dashboard.value = res.data;
  } catch (err) {
    console.error('❌ Lỗi dashboard:', err);
  }
});

const chartData = computed(() => {
  return {
    labels: dashboard.value.monthlyStudentStats.map(m => m.label),
    datasets: [
      {
        label: 'Số học sinh/đăng ký',
        data: dashboard.value.monthlyStudentStats.map(m => m.value),
        backgroundColor: '#4caf50'
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Thống kê học sinh theo tháng'
    }
  }
};
</script>

<template>
  <div class="layout-container">
    <!-- Sidebar Component -->
    <SideBar />
    <div class="main">
      <TopBar />
      <div class="content">
        <!-- Nhóm button dưới dạng link chuyển trang -->
        <div class="btn-group">
          <router-link class="btn" to="/manageStudent">Student</router-link>
          <router-link class="btn" to="/manageTutor">Tutor</router-link>
          <router-link class="btn" to="/homeclassroom">Class Room</router-link>
          <router-link class="btn" to="/manageblog">Blog</router-link>
          <router-link class="btn" to="/homeclass"> Class</router-link>
          <router-link class="btn" to="/homeSubject">Subject</router-link>
          <router-link class="btn" to="/homeschedule">Schedules</router-link>
          <router-link class="btn" to="/dashboard">Dashboard</router-link>
        </div>
      </div>

      <div class="dashboard">
      <h2>📊 Dashboard Thống kê</h2>
  
      <!-- Thông kê nhanh -->
      <div class="stats">
        <div class="stat-box">👨‍🎓 Học sinh: {{ dashboard.totalStudents }}</div>
        <div class="stat-box">👩‍🏫 Gia sư: {{ dashboard.totalTutors }}</div>
        <div class="stat-box">🏫 Lớp học: {{ dashboard.totalClasses }}</div>
        <div class="stat-box">📅 Hôm nay: {{ dashboard.lessonsToday }}</div>
      </div>
  
      <!-- Biểu đồ học sinh theo tháng -->
      <div class="chart-container">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
  
      <!-- Top tutor -->
      <h3>🏆 Top Gia sư</h3>
      <table>
        <thead>
          <tr>
            <th>👤 Họ tên</th>
            <th>📘 Số lớp</th>
            <th>⭐ Đánh giá</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tutor in dashboard.topTutors" :key="tutor.fullName">
            <td>{{ tutor.fullName }}</td>
            <td>{{ tutor.totalClasses }}</td>
            <td>{{ tutor.rating }}/5</td>
          </tr>
        </tbody>
      </table>
    </div>


    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
  overflow: hidden;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-bar-fixed {
  position: fixed;
  top: 0;
  left: 250px; /* chiều rộng sidebar nếu có */
  right: 0;
  z-index: 999;
}

.content {
  flex: 1;
  padding: 1rem;
  margin-top: 60px; /* đảm bảo không bị che bởi TopBar */
}

.btn-group {
  margin-top: 1rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.btn-group .btn {
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  background-color: #007bff;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s ease;
}


.btn-group .btn:hover {
  background-color: #0056b3;
}






/* Phần dashboard */
.dashboard {
    padding: 20px;
  }
  .stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .stat-box {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    flex: 1;
    text-align: center;
    font-weight: bold;
  }
  .chart-container {
    max-width: 600px;
    margin-bottom: 2rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  table th,
  table td {
    border: 1px solid #ccc;
    padding: 0.5rem;
    text-align: center;
  }
  table th {
    background-color: #f0f0f0;
  }
</style>
