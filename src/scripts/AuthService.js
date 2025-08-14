// 認證服務 - 統一管理用戶認證狀態
import { backendURL } from './config';

class AuthService {
  // 檢查用戶是否已登入
  static isAuthenticated() {
    const token = localStorage.getItem('jwt');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('userEmail');
    
    return !!(token && userId && email);
  }

  // 獲取當前用戶 ID
  static getCurrentUserId() {
    return localStorage.getItem('userId');
  }

  // 獲取當前用戶 Email
  static getCurrentUserEmail() {
    return localStorage.getItem('userEmail');
  }

  // 獲取當前用戶名稱
  static getCurrentUsername() {
    return localStorage.getItem('username');
  }

  // 獲取當前用戶完整信息
  static getCurrentUser() {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    return {
      user_id: this.getCurrentUserId(),
      email: this.getCurrentUserEmail(),
      username: this.getCurrentUsername()
    };
  }

  // 獲取 JWT Token
  static getToken() {
    return localStorage.getItem('jwt');
  }

  // 創建帶認證的請求 headers
  static getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // 存儲用戶認證資訊
  static setAuthData(userData) {
    localStorage.setItem('jwt', userData.jwt);
    localStorage.setItem('userId', userData.user.user_id);
    localStorage.setItem('userEmail', userData.user.email);
    localStorage.setItem('username', userData.user.username);
  }

  // 清除認證資訊
  static clearAuthData() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
  }

  // 登入
  static async login(email, password) {
    try {
      console.log('AuthService.login called with:', email);
      console.log('Backend URL:', backendURL);
      
      const response = await fetch(`${backendURL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok && result.status === 'success') {
        this.setAuthData(result);
        return { success: true, message: result.message, user: result.user };
      } else {
        return { success: false, message: result.message || '登入失敗' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: `登入失敗: ${error.message}` };
    }
  }

  // 註冊
  static async register(email, password, username = null) {
    try {
      const userData = {
        username: username || email.split('@')[0],
        email,
        password,
      };

      const response = await fetch(`${backendURL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || '註冊失敗' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: `註冊失敗: ${error.message}` };
    }
  }

  // 登出
  static logout() {
    this.clearAuthData();
    window.location.href = '/2024project/login';
  }

  // 檢查認證狀態並重定向
  static checkAuthAndRedirect() {
    if (!this.isAuthenticated()) {
      console.log('用戶未登入，重定向到登入頁面');
      window.location.href = '/2024project/login';
      return false;
    }
    return true;
  }

  // 處理 API 錯誤（特別是認證錯誤）
  static handleApiError(response) {
    if (response.status === 401) {
      console.log('認證失效，清除本地資料並重定向到登入頁面');
      this.clearAuthData();
      window.location.href = '/2024project/login';
      return true;
    }
    return false;
  }
}

export default AuthService;
