<!-- ReviewSearchView.vue -->
<template>
  <div class="review-search">
    <div class="search-container">
      <input 
        v-model="searchQuery" 
        @keyup.enter="searchReviews" 
        placeholder="영화 제목을 입력하세요" 
        class="search-input" 
      />
      <button @click="searchReviews" class="search-button">
        Search
      </button>
    </div>
    
    <div class="video-list">
      <YoutubeCard 
        v-for="video in videos" 
        :key="video.id.videoId" 
        :video="video" 
        @click="openModal(video)"
      />
    </div>

    <div v-if="videos.length > 0" class="load-more">
      <button @click="loadMoreVideos" class="load-more-button">
        View more
      </button>
    </div>

    <YoutubeReviewModal 
      :is-open="isModalOpen"
      :video-id="selectedVideo?.id?.videoId"
      :video-title="selectedVideo?.snippet?.title"
      :channel-title="selectedVideo?.snippet?.channelTitle"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import YoutubeCard from '@/components/YoutubeCard.vue'
import YoutubeReviewModal from '@/components/YoutubeReviewModal.vue'

const searchQuery = ref('')
const videos = ref([])
const isModalOpen = ref(false)
const selectedVideo = ref(null)
const nextPageToken = ref('')
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY

const searchReviews = async () => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: apiKey,
        part: 'snippet',
        q: `${searchQuery.value} 영화 리뷰`,
        type: 'video',
        maxResults: 12,
        pageToken: ''
      }
    })
    videos.value = response.data.items
    nextPageToken.value = response.data.nextPageToken
  } catch (error) {
    console.error('검색 오류:', error)
  }
}

const loadMoreVideos = async () => {
  if (!nextPageToken.value) return
  
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: apiKey,
        part: 'snippet',
        q: `${searchQuery.value} 영화 리뷰`,
        type: 'video',
        maxResults: 12,
        pageToken: nextPageToken.value
      }
    })
    videos.value = [...videos.value, ...response.data.items]
    nextPageToken.value = response.data.nextPageToken
  } catch (error) {
    console.error('추가 영상 로딩 오류:', error)
  }
}

const openModal = (video) => {
  selectedVideo.value = video
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedVideo.value = null
}
</script>

<style scoped>
.review-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #0D0B09;
  min-height: 100vh;
  color: #fff;
}

.search-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.search-input {
  width: 400px;
  padding: 12px 20px;
  background-color: #0D0B09 ;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  outline: none;
  border-color: #BF0615;
}

.search-button {
  padding: 12px 24px;
  background-color: #BF0615;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bolde;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #960611;
}

.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 1rem;
}

/* YoutubeCard 컴포넌트 스타일 수정 */
:deep(.video-card) {
  background: #0D0B09;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
  border: none;
  padding: 0;
}

:deep(.video-card:hover) {
  transform: scale(1.05);
}

:deep(.thumbnail img) {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

:deep(.video-info) {
  padding: 1rem;
}

:deep(.video-title) {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

:deep(.channel-title) {
  color: #999;
  font-size: 0.9rem;
}

:deep(.video-description) {
  color: #999;
  font-size: 0.8rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .search-input {
    width: 300px;
  }
  
  .video-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .search-container {
    flex-direction: column;
    align-items: center;
  }

  .search-input {
    width: 100%;
  }

  .video-list {
    grid-template-columns: 1fr;
  }
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding: 1rem;
}

.load-more-button {
  padding: 12px 24px;
  background-color: #0D0B09;
  color: white;
  border: 2px solid #BF0615;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.load-more-button:hover {
  background-color: #BF0615;
  border-color: #BF0615;
}
</style>