<template>
  <div class="profile-container">
    <div v-if="store.userProfile" class="profile-content">
      <!-- 프로필 이미지 섹션 -->
      <div class="profile-image-section">
        <div class="profile-image-wrapper">
          <img 
            v-if="store.userProfile?.profile_image" 
            :src="store.userProfile.profile_image" 
            alt="프로필 이미지" 
            class="profile-image"
          >
          <div v-else class="profile-initial">
            {{ store.userProfile?.username?.charAt(0)?.toUpperCase() }}
          </div>
        </div>
      </div>

      <!-- 프로필 정보 -->
      <div class="info-section">
        <h2 class="profile-name">{{ store.userProfile?.username }}님의 프로필</h2>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">사용자명</span>
            <span class="info-value">{{ store.userProfile?.username }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">가입일</span>
            <span class="info-value">
              {{ formatDate(store.userProfile?.date_joined) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading">프로필 정보를 불러오는 중...</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ko-KR')
}

onMounted(async () => {
  await store.getUserProfile()
})
</script>

<style scoped>
.profile-container {
  width: 100%;
  min-height: 80vh; /* 전체 높이 축소 */
  background-color: #0D0B09 ;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 상단 정렬로 변경 */
  padding-top: 8rem; /* 상단 여백 조정 */
}

.profile-content {
  width: 100%;
  max-width: 800px;
  position: relative;
}

.profile-image-section {
  position: relative;
  z-index: 2;
  margin-bottom: -80px;
}

.profile-image-wrapper {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  border: 4px solid #BF0615;  /* Cinergy 레드 컬러 유지 */
  overflow: hidden;
  background: #141414;  /* Netflix 배경색 */
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.profile-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  background: #333;  /* Netflix 스타일 배경 */
  color: #fff;
}

.info-section {
  background: #1f1f1f;  /* Netflix 카드 배경색 */
  border-radius: 4px;  /* Netflix 스타일 라운딩 */
  padding: 100px 2rem 2rem;
  text-align: center;
}

.profile-name {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem;
}

.info-content {
  background: #2f2f2f;  /* Netflix 다크 그레이 */
  border-radius: 4px;
  padding: 1.5rem;
}

.info-row {
  display: flex;
  padding: 1.2rem;
  border-bottom: 1px solid #404040;  /* Netflix 구분선 색상 */
  text-align: left;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  flex: 0 0 120px;
  font-weight: 500;
  color: #999;  /* Netflix 레이블 색상 */
}

.info-value {
  flex: 1;
  color: #fff;
}

.loading {
  color: #999;
  text-align: center;
  font-size: 1.2rem;
}

/* 반응형 디자인 유지 */
@media (max-width: 768px) {
  .profile-content {
    max-width: 600px;
  }
}

@media (max-width: 480px) {
  .profile-content {
    max-width: 100%;
  }
  
  .info-section {
    padding: 80px 1rem 1rem;
  }
}
</style>
