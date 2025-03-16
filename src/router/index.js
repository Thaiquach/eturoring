// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import Home_Tutor from '../Tutor_views/Home_Tutor.vue';
import Home_Student from '../Student_views/Home_Student.vue';


const routes = [
  {
    path: '/',
    redirect: '/login'  // Khi vào đường dẫn gốc sẽ chuyển hướng sang trang Login
  },
  {
    path: '/homeview',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/forgotpassword',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/hometutor',
    name: 'HomeTutor',
    component: Home_Tutor
  },
  {
    path: '/homestudent',
    name: 'HomeStudent',
    component: Home_Student
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard: nếu route yêu cầu auth và không có token, chuyển hướng về Login
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
