<!-- YoutubeCard.vue -->
<template>
  <div class="video-card" @click="$emit('click')">
    <div class="thumbnail">
      <img :src="video.snippet.thumbnails.medium.url" :alt="video.snippet.title">
      <div class="hover-play">
        <span class="play-icon">▶</span>
      </div>
    </div>
    <div class="video-info">
      <div class="info-container">
        <h3 class="video-title">{{ video.snippet.title }}</h3>
        <p class="channel-title">{{ video.snippet.channelTitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  video: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.video-card {
  position: relative;
  background: #2f2f2f; /* 통일된 배경색 사용 */
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.video-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(191, 6, 21, 0.3);
}

.thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hover-play {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .hover-play {
  opacity: 1;
}

.play-icon {
  color: #BF0615;
  font-size: 3rem;
}

.video-info {
  flex: 1;
  background: #0D0B09 ;
  padding: 1rem;
  min-height: 100px; /* 최소 높이 설정 */
}

.info-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.video-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.channel-title {
  margin: 0;
  font-size: 0.9rem;
  color: #999;
}
</style>