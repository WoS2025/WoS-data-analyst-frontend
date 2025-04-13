<template>
  <div class="header-bar">
    <div class="title">
      <img src="/src/assets/icon.jpg" width="40" height="40" />
      Data Analysis
    </div>
    <div class="auth-buttons">
      <button v-if="!isLoggedIn" @click="goToLogin"><svg xmlns="http://www.w3.org/2000/svg" height="2em"viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#ff66a8" d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg></button>
      
      <button v-if="isLoggedIn" @click="logout">登出</button>
    </div>
  </div>

  <!-- 重設密碼 Modal -->
   <div v-if="isResetPasswordModalVisible" class="modal-overlay" @click="hideModal">
      <div class="modal-content" @click.stop>
        <h2>重設密碼</h2>
        <input type="text" v-model="otp" placeholder="OTP" />
        <input type="password" v-model="newPassword" placeholder="新密碼" />
        <button @click="resetPassword">重設密碼</button>
      </div>
   </div>
</template>

<script>
import HeaderBar from "../scripts/HeaderBar.js";
export default HeaderBar;
</script>

<style scoped src="../styles/HeaderBar.css"></style>

