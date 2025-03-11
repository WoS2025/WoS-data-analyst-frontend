<template>
  <div class="header-bar">
    <div class="title">
      <img src="/src/assets/icon.jpg" width="40" height="40" />
      Data Analysis
    </div>
    <div class="auth-buttons">
      <button v-if="!isLoggedIn" @click="showLoginModal">登入</button>
      <button v-if="!isLoggedIn" @click="goToLogin">登入</button>
      <button v-if="!isLoggedIn" class="sign" @click="showRegisterModal">
        註冊
      </button>
      <button v-if="isLoggedIn" @click="logout">登出</button>
    </div>

    <!-- 登入與忘記密碼 Modal -->
    <div v-if="isLoginModalVisible" class="modal-overlay" @click="hideModal">
      <div class="modal-content" @click.stop>
        <h2>登入</h2>
        <input type="email" v-model="loginEmail" placeholder="電子郵件" />
        <input type="password" v-model="loginPassword" placeholder="密碼" />
        <button @click="login">登入</button>
        <a href="#" @click="forgotPassword">忘記密碼？</a>
      </div>
    </div>

    <!-- 註冊 Modal -->
    <div v-if="isRegisterModalVisible" class="modal-overlay" @click="hideModal">
      <div class="modal-content" @click.stop>
        <h2>註冊</h2>
        <input type="email" v-model="registerEmail" placeholder="電子郵件" />
        <input type="password" v-model="registerPassword" placeholder="密碼" />
        <button @click="register">註冊</button>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from "../scripts/HeaderBar.js";
export default HeaderBar;
</script>

<style scoped src="../styles/HeaderBar.css"></style>
