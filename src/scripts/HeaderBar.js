import { ref, watch } from "vue";

const temp_id_user = ref("fb0965e5-2288-48a7-be44-ffb6fe4e5b36");
const temp_username = ref("abc");

export default {
  name: "HeaderBar",
  data() {
    return {
      isLoginModalVisible: false,
      isRegisterModalVisible: false,
      isResetPasswordModalVisible: false,
      isLoggedIn: false,
      loginEmail: "",
      loginPassword: "",
      registerEmail: "",
      registerPassword: "",

      otp: "",
      newPassword: "",
    };
  },
  mounted() {
    const token = this.getCookie("token");
    if (token) {
      this.isLoggedIn = true;
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/login'); // Navigate to the Login page
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
      if (!this.validateEmail(this.registerEmail)) {
        alert("請輸入有效的電子郵件地址");
        return;
      }
      if (!this.validatePassword(this.registerPassword)) {
        alert("密碼至少包含6個字符，包括英文字母和數字");
        return;
      }

      const currentUser = temp_id_user; // 之後要放user的id

      const username = temp_username;

      const userData = {
        username: username, // 目前還沒有這個變數 要之後加
        email: this.registerEmail,
        password: this.registerPassword,
      };

      try {
        // 提交email 密碼
        // "註冊"
        const response = await fetch(
          "https://backend-refactor-nqz1.onrender.com/user/register",
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
          alert(`註冊成功: ${result.message}`);
          this.hideModal();
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        alert(`註冊失敗: ${error.message}`);
      }
    },
    async login() {
      const currentUser = temp_id_user;
      const username = temp_username;

      const userData = {
        username: this.loginUsername, // 還沒有這個變數 要之後加
        email: this.loginEmail,
        password: this.loginPassword,
      };

      try {
        // 提交email 密碼
        // "登入"
        const response = await fetch(
          "https://backend-refactor-nqz1.onrender.com/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );

        const result = await response.json();
        //console.log(result);
        localStorage.setItem("jwt", result.jwt);
        localStorage.setItem("userEmail", this.loginEmail);
        //console.log(result.jwt, "!!!");

        if (response.ok) {
          alert(`登入成功: ${result.message}`);
          this.isLoggedIn = true;
          this.setCookie("token", result.token, 7);
          this.hideModal();
          window.location.reload(); // 重新整理頁面
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        alert(`登入失敗: ${error.message}`);
      }
    },
    // async forgotPassword() {
    //   if (!this.validateEmail(this.loginEmail)) {
    //     alert("請輸入有效的電子郵件地址");
    //     return;
    //   }

    //   const userData = {
    //     email: this.loginEmail,
    //   };

    //   try {
    //     // 會送出email
    //     // "忘記密碼?"：把登入列email交給後端 供重設密碼
    //     const response = await fetch(
    //       "https://wos-data-analysis-backend.onrender.com/api/auth/forgotPassword",
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(userData),
    //       }
    //     );

    //     const result = await response.json();

    //     if (response.ok) {
    //       alert(`已寄送重設密碼的信件至該信箱: ${result.message}`);
    //       this.hideModal();
    //     } else {
    //       throw new Error(result.message);
    //     }
    //   } catch (error) {
    //     alert(`重設密碼信件寄出失敗: ${error.message}`);
    //   }
    // },

    async resetPassword() {
      // const userData = {
      //   otp: this.otp,
      //   newPassword: this.password,
      // };

      try {
        // 提交OTP與新密碼後點下"重設密碼"
        // 要等後端的API
        const response = await fetch(
          "https://backend-refactor-nqz1.onrender.com//forgotPassword",
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
      this.isLoggedIn = false;
      this.deleteCookie("token");
      alert("已登出");
      window.location.reload(); // 重新整理頁面
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
