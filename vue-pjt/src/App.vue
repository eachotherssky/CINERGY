<template>
  <header>
    <nav class="navbar">
      <RouterLink :to="{ name: 'HomeView' }" class="logo-container">
        <img src="@/assets/CINERGY.png" alt="Logo" class="logo" />
      </RouterLink>

      <!-- 좌측 메뉴 (Movies, Recommended, Reviews, YoutubeSearch) -->
      <div class="nav-links-left">
        <RouterLink :to="{ name: 'MovieView' }" class="nav-item">Movies</RouterLink>
        <RouterLink :to="{ name: 'RecommendedView' }" class="nav-item">Recommended</RouterLink>
        <RouterLink :to="{ name: 'ReviewView' }" class="nav-item">Reviews</RouterLink>
        <RouterLink :to="{ name: 'YoutubeReviewSearchView' }" class="nav-item">YoutubeSearch</RouterLink>
      </div>

      <!-- 우측 메뉴 (로그인 관련) -->
      <div class="nav-links-right">
        <RouterLink v-if="!store.isLogin" :to="{ name: 'SignupView' }" class="nav-item">SignUp</RouterLink>
        <RouterLink v-if="store.isLogin" :to="{ name: 'ProfileView' }" class="nav-item">Profile</RouterLink>
        <RouterLink v-if="!store.isLogin" :to="{ name: 'LoginView' }" class="nav-item">LogIn</RouterLink>
        <a v-if="store.isLogin" @click="store.logOut" href="#" class="nav-item">LogOut</a>
      </div>
    </nav>
  </header>

  <body>
    <RouterView />
  </body>

  <footer>
    <div class="footer-content">
      <div class="branding">
        <img src="@/assets/CINERGY.png" alt="CINERGY Logo" class="logo" />
        <p>Where Cinema Meets Energy</p>
      </div>
      <div class="links">
        <RouterLink :to="{ name: 'HomeView' }">Home</RouterLink> |
        <RouterLink :to="{ name: 'MovieView' }">Movies</RouterLink> |
        <RouterLink :to="{ name: 'RecommendedView' }">Recommended</RouterLink> |
        <RouterLink :to="{ name: 'ReviewView' }">Reviews</RouterLink> |
        <RouterLink :to="{ name: 'YoutubeReviewSearchView' }">YoutubeSearch</RouterLink>
      </div>
      <p class="copyright">© 2024 CINERGY. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router';
import { useCounterStore } from '@/stores/counter';
const store = useCounterStore();
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  color: white;
}

header {
  background-color: #0D0B09;
  color: white;
}

body {
  background-color: #0D0B09;
  color: white;
  padding: 20px;
  min-height: calc(100vh - 140px);
}

/* Footer 스타일 */
footer {
  background-color: #0D0B09;
  color: white;
  padding: 10px;
  text-align: center;
}

.footer-content .branding img {
  margin-bottom: 25px;
}

.footer-content .branding p {
  font-weight: 500;
  margin-bottom: 15px;
}

.footer-content .links,
.footer-content .info,
.footer-content .social {
  margin-bottom: 10px;
  color: #cecece;
}

.footer-content a {
  color: #cecece;
  text-decoration: none;
  margin: 0 5px;
}

.footer-content a:hover {
  text-decoration: underline;
}

.logo {
  width: 100px;
  height: auto;
  margin-right: 10px;
}

.copyright {
  margin-top: 30px;
}

/* Navbar 스타일 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0D0B09;
  padding: 10px 30px;
  color: white;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-left: 10px;
}

.nav-links-left, .nav-links-right {
  margin-left: 20px;
  display: flex;
  gap: 20px;
}

.nav-links-left {
  flex: 1;
}

.nav-links-right {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 16px;
  font-weight: bolder;
  transition: color 0.3s ease, background-color 0.3s ease;
  padding: 8px 12px;
  border-radius: 5px;
}

.nav-item:hover {
  color: #BF0615;
}

</style>
