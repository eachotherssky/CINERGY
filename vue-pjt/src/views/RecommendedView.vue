<template>
    <div class="recommended-container">
      <h2 class="section-title">이번 주 인기 콘텐츠</h2>
      
      <div class="content-list">
        <div v-for="(content, index) in store.recommendedContents" 
             :key="content.netflix_id" 
             class="content-item"
             @mouseover="hoveredIndex = index"
             @mouseleave="hoveredIndex = null">
          
          <!-- 순위 숫자 -->
          <div class="rank-wrapper">
            <span class="rank">{{ index + 1 }}</span>
          </div>
          
          <!-- 콘텐츠 정보 -->
          <div class="content-info">
            <div class="title-section">
              <h3 class="content-title">{{ content.title }}</h3>
              <div class="chat-count">
                <span class="count-value">실시간 인기도 {{ content.chat_count }}</span>
              </div>
            </div>
            
            <a :href="`https://www.netflix.com/watch/${content.netflix_id}`" 
               target="_blank"
               class="watch-button"
               :class="{ 'button-visible': hoveredIndex === index }">
              <span class="button-text">지금 시청하기</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useCounterStore } from '@/stores/counter'

  const hoveredIndex = ref(null)  
  
  const store = useCounterStore()
  const expandedIndex = ref(0)
  
  const toggleSize = (index) => {
    expandedIndex.value = expandedIndex.value === index ? null : index
  }
  
  onMounted(() => {
    store.getRecommendedContent()
  })
  </script>
  
  <style scoped>
  .recommended-container {
  padding: 60px 40px;
  background-color: #141414;
  min-height: 100vh;
}

.section-title {
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 700;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  padding-left: 120px;
}

/* .content-item {
  position: relative;
  background: linear-gradient(90deg, rgba(47,47,47,0.9) 0%, rgba(47,47,47,0.8) 50%, rgba(47,47,47,0.4) 100%);
  border-radius: 8px;
  padding: 2.5rem 3rem;
  cursor: pointer;
  transition: all 0.4s ease;
  min-height: 180px;
  display: flex;
  align-items: center;
  overflow: hidden;
} */
.content-item {
  position: relative;
  background: linear-gradient(90deg, rgba(47,47,47,0.95) 0%, rgba(47,47,47,0.9) 50%, rgba(47,47,47,0.7) 100%);
  margin-left: 120px;
  padding: 2.5rem 3rem;
  border-radius: 8px;
  min-height: 180px;
}


.content-item:hover {
  transform: scale(1.02);
  background: linear-gradient(90deg, rgba(47,47,47,1) 0%, rgba(47,47,47,0.9) 50%, rgba(47,47,47,0.6) 100%);
}

/* .rank-wrapper {
  position: absolute;
  left: -140px;
  top: 50%;
  transform: translateY(-50%);
} */
.rank-wrapper {
  position: absolute;
  left: -180px; /* 더 왼쪽으로 이동 */
  top: 50%;
  transform: translateY(-50%);
  width: 200px; /* 숫자 영역 확보 */
  text-align: center;
}

/* .rank {
  font-size: 240px;
  font-weight: 900;
  background: linear-gradient(135deg, #BF0615 0%, #590207 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.8;
  line-height: 1;
  font-family: 'Arial Black', sans-serif;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
} */
.rank {
  font-size: 280px; /* 크기 증가 */
  font-weight: 900;
  background: linear-gradient(135deg, #E50914 0%, #BF0615 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-stroke: 2px #BF0615; /* 외곽선 추가 */
  text-stroke: 2px #BF0615;
  opacity: 0.9; /* 투명도 증가 */
  line-height: 1;
  font-family: 'Arial Black', sans-serif;
  text-shadow: 
    4px 4px 8px rgba(0,0,0,0.3),
    -2px -2px 4px rgba(255,255,255,0.1); /* 입체감을 위한 그림자 효과 */
}

/* 호버 효과 추가 */
.content-item:hover .rank {
  opacity: 1;
  transform: scale(1.05);
  transition: all 0.3s ease;
}

.content-info {
  position: relative;
  z-index: 2;
  width: 100%;
}

.title-section {
  margin-bottom: 1rem;
}

.content-title {
  color: #fff;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.chat-count {
  margin-top: 0.5rem;
}

.count-value {
  color: #BF0615;
  font-size: 1.1rem;
  font-weight: 500;
}

.watch-button {
  display: inline-flex;
  align-items: center;
  background: #BF0615;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.button-visible {
  opacity: 1;
  transform: translateY(0);
}

.watch-button:hover {
  background: #960611;
}

.button-text {
  font-size: 1rem;
}

/* @media (max-width: 768px) {
  .recommended-container {
    padding: 40px 20px;
  }

  .content-list {
    padding-left: 80px;
  }

  .rank {
    font-size: 160px;
    left: -90px;
  }

  .content-title {
    font-size: 1.8rem;
  }
  
} */
@media (max-width: 768px) {
  .content-item {
    margin-left: 80px;
  }

  .rank-wrapper {
    left: -100px;
  }

  .rank {
    font-size: 180px;
    -webkit-text-stroke: 1px #BF0615;
  }
}

  </style>