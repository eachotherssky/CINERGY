<template>
  <div class="signup-page">
    <div class="signup-card">
      <!-- 왼쪽 섹션 -->
      <div class="info-section">
        <h1>Create Your Account</h1>
        <p>Join our community and get access to exclusive content and features. Your journey begins here.</p>
      </div>

      <!-- 오른쪽 회원가입 섹션 -->
      <div class="signup-section">
        <div class="signup-header">
          <p class="login-text">Already have an account? 
            <router-link to="/login" class="login-link">Login</router-link>
          </p>
        </div>

        <form @submit.prevent="signUp" class="signup-form">
          <div class="form-group">
            <input 
              type="text" 
              id="username" 
              v-model.trim="username"
              placeholder="Username"
              class="signup-input"
            >
          </div>
          
          <div class="form-group">
            <input 
              type="password" 
              id="password1" 
              v-model.trim="password1"
              placeholder="Password"
              class="signup-input"
            >
          </div>

          <div class="form-group">
            <input 
              type="password" 
              id="password2" 
              v-model.trim="password2"
              placeholder="Confirm Password"
              class="signup-input"
            >
          </div>
          
          <button type="submit" class="signup-button">Create Account</button>
        </form>

        <div class="social-signup">
          <button @click="handleKakaoLogin" class="kakao-signup-btn">
            카카오로 시작하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'

const username = ref(null)
const password1 = ref(null)
const password2 = ref(null)

const store = useCounterStore()

const signUp = function () {
    const payload = {
        username: username.value,
        password1: password1.value,
        password2: password2.value
    }
    store.signUp(payload)
}

</script>

<style scoped>
.signup-page {
  width: 100%;
  min-height: 70vh;
  background-color: #0D0B09;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.signup-card {
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  background: #f7f7f7;
  border-radius: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.info-section {
  padding: 3rem;
  background: #960611;
  color: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: bolder;
}

.info-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.signup-section {
  padding: 3rem;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
}

.signup-header {
  text-align: right;
  margin-bottom: 3rem;
}

.login-text {
  color: #666;
}

.login-link {
  color: #59070E;
  text-decoration: none;
  margin-left: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
}

.signup-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.signup-input:focus {
  outline: none;
  border-color: #BF0615;
}

.signup-button {
  width: 100%;
  padding: 1rem;
  background: #BF0615;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
}

.signup-button:hover {
  background: #960611;
}

.social-signup {
  margin-top: auto;
}

.kakao-signup-btn {
  width: 100%;
  padding: 1rem;
  background: #FEE500;
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.kakao-signup-btn:hover {
  background: #E6CF00;
}

@media (max-width: 768px) {
  .signup-card {
    grid-template-columns: 1fr;
  }
  
  .info-section {
    display: none;
  }
  
  .signup-section {
    padding: 2rem;
  }
}
</style>
