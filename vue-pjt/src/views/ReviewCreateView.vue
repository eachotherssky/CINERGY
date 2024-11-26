<template>
    <div class="form-container">
        <h1>Create Review</h1>
        <form @submit.prevent="createReview" class="review-form">
            <div class="form-group">
                <label for="title">제목: </label>
                <input type="text" id="title" name="title" v-model.trim="title" class="form-input" placeholder="제목을 입력하세요.">
            </div>
            <div class="form-group">
                <label for="movie_title">영화 제목: </label>
                <input type="text" id="movie_title" name="movie_title" v-model.trim="movie_title" class="form-input" placeholder="영화 제목을 입력하세요">
            </div>
            <div class="form-group">
                <label for="content">내용: </label>
                <textarea id="content" name="content" v-model.trim="content" class="form-input" placeholder="내용을 입력하세요." rows="8"></textarea>
            </div>
            <input type="submit" class="submit-btn">
        </form>
    </div>
</template>

<script setup>
import axios from 'axios'
import { useCounterStore } from '@/stores/counter'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const title = ref(null)
const movie_title = ref(null)
const content = ref(null)

const store = useCounterStore()
const router = useRouter()

const createReview = function () {
    axios({
        method: 'post',
        url: `${store.API_URL}/community/reviews/`,
        data: {
            title: title.value,
            movie_title: movie_title.value,
            content: content.value
        },
        headers: {
            Authorization: `Token ${store.token}`
        }
    }).then(() => {
        router.push({ name: 'ReviewView' })
    }).catch(err => console.log(err))
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
