<template>
  <div class="review-detail-container">
    <div v-if="review" class="review-detail">
      <h3 class="review-title">제목: {{ review.title }}</h3>
      <p>영화 제목: {{ review.movie_title }}</p>
      <p>내용: {{ review.content }}</p>
      <h4>-</h4>
      <p class="review-id">{{ review.id }}번째 게시글</p>
      <p>작성 시간: {{ formattedCreatedAt }}</p>
      <p>수정 시간: {{ formattedUpdatedAt }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()
const route = useRoute()
const review = ref(null)

onMounted(async () => {
  const reviewId = route.params.id
  if (reviewId) {
    review.value = await store.getReviewDetail(reviewId)
  } else {
    console.error('Review ID is missing')
  }
})

// 포맷팅된 날짜 계산
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 작성 시간과 수정 시간을 포맷팅
const formattedCreatedAt = computed(() => {
  return review.value ? formatDate(review.value.created_at) : ''
})

const formattedUpdatedAt = computed(() => {
  return review.value ? formatDate(review.value.updated_at) : ''
})
</script>

<style scoped>
.review-detail-container {
  max-width: 60%;
  margin: auto;
  color: #FFFFFF;
  text-align: center;
}

.review-id {
  font-size: 10px;
  font-weight: lighter;
  margin-bottom: 10px;
}

.review-title {
  font-size: 24px;
  font-weight: bold;
  color: #FFFFFF;
}

.review-detail p {
  font-size: 16px;
  margin: 10px 0;
}

.review-detail p:not(.review-id) {
  color: #FFFFFF;
}
</style>
