<template>
  <div class="col">
    <div class="movie-card">
      <RouterLink :to="{ name: 'MovieDetailView', params: { movieId: movie.id } }">
        <div class="poster-container">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" class="card-img-top" :alt="movie.title" />
          <div class="overlay">
            <div class="title-container">
              <p class="card-title">{{ movie.title }}</p>
              <div class="title-line"></div>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  movie: Object
})
</script>

<style scoped>
/* 카드 스타일 */
.movie-card {
  position: relative;
  max-width: 300px; /* 카드의 최대 너비 */
  margin: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer; /* 마우스 오버 시 포인터 커서 */
  border-radius: 15px;
  overflow: hidden;
}

/* 포스터 컨테이너 (비율 유지) */
.poster-container {
  position: relative;
  width: 100%;
  padding-top: 150%; /* 포스터 비율 설정 (3:4 비율) */
  overflow: hidden;
}

/* 포스터 이미지 스타일 */
.card-img-top {
  object-fit: cover;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

/* 오버레이 스타일 (제목을 감싸는 영역) */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  flex-direction: column;
}
.movie-card:hover .overlay {
  opacity: 1;
}
.title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5%;
}
.card-title {
  color: white;
  font-family: "Inter-Black", sans-serif;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
}
.title-line {
  width: 50px;
  height: 2px;
  background-color: white;
  margin-bottom: 10px;
}

</style>
