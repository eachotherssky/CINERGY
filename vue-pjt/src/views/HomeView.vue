<template>
  <div class="home-container">
    <div class="movie-list">
      <div 
        v-for="(movie, index) in popularMovies" 
        :key="movie.id" 
        class="movie-item"
        @click="toggleSize(index)"
        :class="{ inactive: expandedIndex !== index }"
      >
        <!-- 순위 -->
        <div class="rank">{{ index + 1 }}</div>
        <img 
          :src="getImageUrl(movie.backdrop_path)" 
          alt="Movie Image" 
          class="movie-image" 
          :class="{ expanded: expandedIndex === index }" 
        />
        
        <!-- 제목 위의 수평 라인 (선택된 영화에서만 보임) -->
        <div class="title-line" v-if="expandedIndex === index"></div>
        
        <!-- 영화 제목 -->
        <div class="movie-title" v-if="expandedIndex === index">{{ movie.title }}</div>
        
        <!-- 영화 줄거리 -->
        <div class="movie-overview" v-if="expandedIndex === index">
          {{ truncateText(movie.overview, 150) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
const popularMovies = ref([])
const expandedIndex = ref(0)
let autoSlideInterval = null

// 인기 영화 데이터를 가져오는 함수
const fetchPopularMovies = async () => {
  try {
    popularMovies.value = await counterStore.getPopularMovies(5)
  } catch (error) {
    console.error('영화 데이터를 가져오는 중 오류 발생:', error)
  }
}

// 영화 클릭 시 크기를 확장하거나 축소하는 함수
const toggleSize = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

// 영화 줄거리를 150자로 제한하고 단어가 끊기지 않도록 처리하는 함수
const truncateText = (text, limit) => {
  if (!text) return ''
  if (text.length <= limit) return text

  const truncated = text.slice(0, limit)
  const lastSpace = truncated.lastIndexOf(' ')

  return truncated.slice(0, lastSpace) + '...'
}

// 배경 이미지 URL을 반환하는 함수
const getImageUrl = (path) => {
  return `https://image.tmdb.org/t/p/original${path}`
}

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    expandedIndex.value = (expandedIndex.value + 1) % popularMovies.value.length
  }, 2000)
}

// 컴포넌트가 마운트될 때 영화 데이터를 가져오기 및 슬라이드 시작
onMounted(() => {
  fetchPopularMovies()
  startAutoSlide()
})

// 컴포넌트가 언마운트될 때 슬라이드 정지
onBeforeUnmount(() => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
  }
})
</script>

<style scoped>
.home-container {
  text-align: center;
  margin: 150px;
}

.movie-list {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.movie-item {
  position: relative;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
  border-radius: 15px;
  overflow: hidden;
}

.movie-item.inactive {
  opacity: 0.3;
}

.rank {
  position: absolute;
  top: -20px;
  right: 15px;
  font-size: 120px;
  font-weight: bolder;
  color: transparent;
  -webkit-text-stroke: 1px white;
  text-stroke: 1px white;
  z-index: 10;
}

.movie-image {
  width: 150px;
  height: 700px;
  object-fit: cover;
  transition: width 0.3s ease-in-out;
  position: relative;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%), url(''); /* 그라디언트 덮어씌우기 */
  background-size: cover;
  background-position: center center;
}

.movie-image.expanded {
  width: 450px;
}

.title-line {
  position: absolute;
  top: 470px;
  left: 50%;
  width: 120px;
  height: 2px;
  background-color: white;
  transform: translateX(-50%);
}

.movie-title {
  position: absolute;
  bottom: 150px;
  left: 15px;
  color: white;
  font-size: 45px;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  transition: visibility 0.3s ease-in-out;
}

.movie-overview {
  position: absolute;
  top: 560px;
  left: 15px;
  color: white;
  font-size: 12px;
  font-weight: normal;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  max-width: 90%;
  margin: 0 2%;
  white-space: normal;
  line-height: 1.4;
  text-align: left; /* 좌측 정렬 */
}

.movie-title,
.rank {
  visibility: visible;
}

.movie-item.inactive .movie-title,
.movie-item.inactive .rank,
.movie-item.inactive .movie-overview {
  visibility: hidden; /* 선택되지 않은 영화의 제목, 순위 및 줄거리 숨김 */
}
</style>
