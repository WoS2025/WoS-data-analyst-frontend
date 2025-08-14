import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/login.vue';
import MainApp from '@/components/MainApp.vue';

const routes = [
  {
    path: '/',
    name: 'MainApp',
    component: MainApp,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory('/2024project/'), // 修復 base URL
  routes
});

// 路由守衛 - 修復重定向邏輯
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt');
  const userId = localStorage.getItem('userId');
  
  // 檢查是否已登入
  const isAuthenticated = token && userId;
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 需要認證但未登入，重定向到登入頁
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // 已登入但訪問登入頁，重定向到首頁
    next('/');
  } else {
    // 其他情況正常導航
    next();
  }
});

export default router;