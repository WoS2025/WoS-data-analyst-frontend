import { ref } from "vue";
import { backendURL } from "../scripts/config";
import AuthService from "../scripts/AuthService";

export default {
  name: "Login",
  data() {
    return {
      isLoginModalVisible: false,
      isRegisterModalVisible: false,
      isResetPasswordModalVisible: false,
      isLoggedIn: false,
      isSignUp: false,
      loginEmail: "test@test.com", // 預設測試帳號
      loginPassword: "test123", // 預設測試密碼
      registerEmail: "",
      registerPassword: "",
      otp: "",
      newPassword: "",
    };
  },
  mounted() {
    // 檢查是否已登入
    console.log('Login component mounted');
    console.log('Vue instance methods:', Object.keys(this.$options.methods || {}));
    if (AuthService.isAuthenticated()) {
      this.isLoggedIn = true;
      this.$router.push('/');
    }
  },
  methods: {
    toggleSignUp() {
      console.log('toggleSignUp called, current isSignUp:', this.isSignUp);
      this.isSignUp = !this.isSignUp; // Toggle the state
      console.log('new isSignUp:', this.isSignUp);
    },
    showLoginModal() {
      this.isLoginModalVisible = true;
    },
    showRegisterModal() {
      this.isRegisterModalVisible = true;
    },
    showResetPasswordModal() {
      this.isResetPasswordModalVisible = true;
      this.isLoginModalVisinle = false;
    },
    hideModal() {
      this.isLoginModalVisible = false;
      this.isRegisterModalVisible = false;
      this.isResetPasswordModalVisible = false;
    },
    validateEmail(email) {
      const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      return re.test(email);
    },
    validatePassword(password) {
      const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      return re.test(password);
    },
    async register() {
      console.log('Register method called');
      console.log('Register Email:', this.registerEmail);
      console.log('Register Password:', this.registerPassword);
      
      if (!this.validateEmail(this.registerEmail)) {
        alert("請輸入有效的電子郵件地址");
        return;
      }
      if (!this.validatePassword(this.registerPassword)) {
        alert("密碼至少包含6個字符，包括英文字母和數字");
        return;
      }

      const result = await AuthService.register(this.registerEmail, this.registerPassword);
      console.log('Register result:', result);
      
      if (result.success) {
        alert(`註冊成功: ${result.message}`);
        this.hideModal();
      } else {
        alert(`註冊失敗: ${result.message}`);
      }
    },
    async login() {
      console.log('Login method called');
      console.log('Email:', this.loginEmail);
      console.log('Password:', this.loginPassword);
      
      if (!this.loginEmail || !this.loginPassword) {
        alert('請輸入電子郵件和密碼');
        return;
      }

      const result = await AuthService.login(this.loginEmail, this.loginPassword);
      console.log('Login result:', result);

      if (result.success) {
        alert(`登入成功: ${result.message}`);
        this.isLoggedIn = true;
        this.hideModal();
        this.$router.push('/'); // 使用路由導航到根路徑
      } else {
        alert(`登入失敗: ${result.message}`);
      }
    },

    async resetPassword() {
      // const userData = {
      //   otp: this.otp,
      //   newPassword: this.password,
      // };

      try {
        // 提交OTP與新密碼後點下"重設密碼"
        // 要等後端的API
        const response = await fetch(
          `${backendURL}/forgotPassword`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );

        const result = await response.json();

        if (response.ok) {
          alert(`密碼重設成功： ${result.message}`);
          this.hideModal();
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        alert(`密碼重設失敗：${error.message}`);
      }
    },

    logout() {
      AuthService.logout();
    },
    forgotPassword() {
      console.log('Forgot password clicked');
      // 這裡可以實現忘記密碼的邏輯
      alert('忘記密碼功能尚未實現');
    },
    setCookie(name, value, days) {
      const d = new Date();
      d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = "expires=" + d.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    },
    getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
    deleteCookie(name) {
      document.cookie =
        name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
  },
};
