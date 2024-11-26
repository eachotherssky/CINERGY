<template>
  <div class="form-container">
    <h1>Edit Review</h1>
    <div v-if="review">
      <form @submit.prevent="submitForm" class="review-form">
        <div class="form-group">
          <label for="title">제목:</label>
          <input v-model="review.title" id="title" class="form-input" placeholder="제목을 입력하세요." />
        </div>
        <div class="form-group">
          <label for="content">내용:</label>
          <textarea v-model="review.content" id="content" class="form-input" placeholder="내용을 입력하세요." rows="8"></textarea>
        </div>
        <button type="submit" class="submit-btn">저장</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()
const route = useRoute()
const router = useRouter()
const review = ref({})
const reviewId = route.params.id

onMounted(async () => {
  if (reviewId) {
    review.value = await store.getReviewDetail(reviewId)
  } else {
    console.error('Review ID is missing')
  }
})

const submitForm = async () => {
  try {
    await store.updateReview(review.value.id, review.value)
    router.push({ name: 'ReviewView' })
  } catch (error) {
    console.error('Failed to update review:', error)
  }
}
</script>

<style scoped>
.form-container {
    max-width: 50%;
    margin: 0 auto;
    padding: 20px;
    background-color: #0D0B09;
    color: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

h1 {
    color: #FFFFFF;
    font-weight: bolder;
    text-align: center;
    margin-bottom: 50px;
}

.review-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #BF0615;
    background-color: #0D0B09;
    color: #FFFFFF;
    border-radius: 5px;
}

.form-input:focus {
    outline: none;
    border-color: #BF0615;
}

textarea.form-input {
    resize: vertical;
    min-height: 150px;
    height: auto;
}

.submit-btn {
    padding: 10px 20px;
    background-color: #BF0615;
    border: none;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-btn:hover {
    background-color: #A50511;
}
</style>
