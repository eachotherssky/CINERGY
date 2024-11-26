<template>
  <div class="login-page">
    <div class="login-card">
      <!-- 왼쪽 섹션 -->
      <div class="info-section">
        <h1>How does a login system work?</h1>
        <p>In computer security, logging in is the process by which an individual gains access to a computer system by identifying and authenticating themselves.</p>
      </div>

      <!-- 오른쪽 로그인 섹션 -->
      <div class="login-section">
        <div class="login-header">
          <p class="signup-text">Don't have an account? 
            <router-link to="/signup" class="signup-link">Create Profile</router-link>
          </p>
        </div>

        <form @submit.prevent="logIn" class="login-form">
          <div class="form-group">
            <input 
              type="text" 
              id="username" 
              v-model.trim="username"
              placeholder="Username"
              class="login-input"
            >
          </div>
          
          <div class="form-group">
            <input 
              type="password" 
              id="password" 
              v-model.trim="password"
              placeholder="Password"
              class="login-input"
            >
          </div>
          
          <button type="submit" class="login-button">Login</button>
          
          <!-- 비밀번호 찾기 기능 추가 시 사용할 주석 -->
          <!-- <div class="forgot-password">
            <a href="#" class="forgot-link">Forgot password?</a>
          </div> -->
        </form>

        <div class="social-login">
          <button @click="handleKakaoLogin" class="kakao-login-btn">
            카카오로 시작하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

  <script setup>
  import { ref, onMounted } from 'vue'
  import { useCounterStore } from '@/stores/counter'

  const username = ref(null)
  const password = ref(null)
  const store = useCounterStore()

const logIn = async function () {
  const payload = {
    username: username.value,
    password: password.value
  }
  try {
    const response = await store.logIn(payload)
    
    if (response?.data?.key) {
      console.log('Storing token:', response.data.key)
      
      // 토큰 저장 후 페이지 리로드
      window.postMessage({
        type: 'AUTH_TOKEN',
        token: response.data.key,
        userInfo: {
          username: username.value
        }
      }, 'http://localhost:5173');

      // 약간의 지연 후 페이지 리로드
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}



  onMounted(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_CLIENT_ID)
    }
  })

  const handleKakaoLogin = () => {
    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:5173/kakao/callback'
    })
  }

  </script>

<style scoped>
.login-page {
  width: 100%;
  min-height: 70vh;
  background-color: #0D0B09;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 900px;
  min-height: 480px;
  background: #f7f7f7;
  border-radius: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.info-section {
  padding: 2.5rem;
  background: #960611;
  color: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info-section h1 {
  font-size: 2.2rem;
  margin-bottom: 1.2rem;
  font-weight: bolder;
}

.info-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.login-section {
  padding: 2.5rem;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: right;
  margin-bottom: 2rem;
}

.signup-text {
  color: #666;
}

.signup-link {
  color: #59070E;
  text-decoration: none;
  margin-left: 0.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
  width: 100%;
}

.login-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.login-input:focus {
  outline: none;
  border-color: #BF0615;
}

.login-button {
  width: 100%;
  padding: 0.8rem;
  background: #BF0615;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 0.8rem;
}

.login-button:hover {
  background: #960611;
}

.forgot-password {
  text-align: center;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
}

.forgot-link {
  color: #666;
  text-decoration: none;
}

.social-login {
  margin-top: 1rem;
}

.kakao-login-btn {
  width: 100%;
  padding: 0.8rem;
  background: #FEE500;
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.kakao-login-btn:hover {
  background: #E6CF00;
}

@media (max-width: 768px) {
  .login-card {
    grid-template-columns: 1fr;
  }
  
  .info-section {
    display: none;
  }
  
  .login-section {
    padding: 2rem;
  }
}
</style>