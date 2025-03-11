<template>
    <header>
      <h1>登入頁面</h1>
      <div class="header-buttons">
        <button @click="goToShop">🛒 返回商店</button>
      </div>
    </header>
    <div class="container" :class="{ 'sign-up-mode': isSignUp }">
      <div class="forms-container">
        <div class="signin-signup">
          <!-- Sign-in Form -->
          <form @submit.prevent="login" class="sign-in-form">
            <h2 class="title">Sign in</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" v-model="loginEmail" placeholder="Username" />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input type="password" v-model="loginPassword" placeholder="Password" />
            </div>
            <input type="submit" value="Login" class="btn solid" />
            <p class="social-text">Or Sign in with social platforms</p>
            <div class="social-media">
              <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-google"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </form>
  
          <!-- Sign-up Form -->
          <form @submit.prevent="register" class="sign-up-form">
            <h2 class="title">Sign up</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" v-model="registerUsername" placeholder="Username" />
            </div>
            <div class="input-field">
              <i class="fas fa-envelope"></i>
              <input type="email" v-model="registerEmail" placeholder="Email" />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input type="password" v-model="registerPassword" placeholder="Password" />
            </div>
            <input type="submit" class="btn" value="Sign up" />
            <p class="social-text">Or Sign up with social platforms</p>
            <div class="social-media">
              <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-google"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </form>
        </div>
      </div>
      
      <div class="panels-container">
        <div class="panel left-panel">
          <div class="content">
            <h3>New here?</h3>
            <p>Sign up and discover great opportunities!</p>
            <button class="btn transparent" @click="toggleSignUp">Sign up</button>
          </div>
        </div>
        <div class="panel right-panel">
          <div class="content">
            <h3>One of us?</h3>
            <p>To stay connected, please login with your personal info.</p>
            <button class="btn transparent" @click="toggleSignUp">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isSignUp: false,
        loginEmail: "",
        loginPassword: "",
        registerUsername: "",
        registerEmail: "",
        registerPassword: "",
      };
    },
    methods: {
      toggleSignUp() {
        this.isSignUp = !this.isSignUp;
      },
      goToShop() {
        window.location.href = "index.html";
      },
      login() {
        alert(`Logging in with ${this.loginEmail}`);
      },
      register() {
        alert(`Registering with ${this.registerEmail}`);
      },
    },
  };
  </script>
  
  <style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");
  @import "../styles/HeaderBar.css";
  </style>
  