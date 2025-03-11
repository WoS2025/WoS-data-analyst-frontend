import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    // No component needed here because App.vue is your main page
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use base URL from Vite
  routes
});

export default router;