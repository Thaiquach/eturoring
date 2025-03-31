// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';
import Home_Tutor from '../Tutor_views/Home_Tutor.vue';
import Home_Student from '../Student_views/Home_Student.vue';
import Home_Class from '../Class_views/Home_Class.vue';
import ManageStudent from '../Admin_views/manageStudent.vue';
import ManageTutor from '../Admin_views/manageTutor.vue';

import manageBlog from '../components/manageBlog.vue';
import displayProfile from '../components/displayProfile.vue';

import Home_Subject from '../Subject_views/Home_Subject.vue';


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
    path: '/resetpassword',
    name: 'ResetPassword',
    component: ResetPassword
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
  {

    path: '/homeclass',
    name: 'HomeClass',
    component: Home_Class
  },
  {

    path: '/manageStudent',
    name: 'ManageStudent',
    component: ManageStudent,
    meta: { requiresAuth: true }
  },
  {
    path: '/manageTutor',
    name: 'ManageTutor',
    component: ManageTutor,
    meta: { requiresAuth: true }
  },
  {

    path: '/manageblog',
    name: 'ManageBlog',
    component: manageBlog,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'ProfileDisplay',
    component: displayProfile
  },
  {
    path: '/homesubject',
    name: 'HomeSubject',
    component: Home_Subject,
    meta: { requiresAuth: true }
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

//Navigation Guard: nếu route yêu cầu auth và không có token, chuyển hướng về Login
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
