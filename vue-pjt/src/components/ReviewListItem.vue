<template>
    <div class="review-item">
        <h5>{{ review.id }}번째 게시글</h5>
        <p>제목: {{ review.title }}</p>
        <RouterLink :to="{ name: 'ReviewDetailView', params: { id: review.id } }" class="detail-review">DETAIL</RouterLink>
        <hr>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
defineProps({
    review: Object
})
</script>

<style scoped>
.review-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
}

h5 {
    color: #ffffff;
    font-size: 12px;
    font-weight: lighter;
}

p {
    color: #ffffff;
    font-size: 16px;
    font-weight: bolder;
    margin: 10px 0;
}

hr {
    width: 400px;
    height: 4px;
    background-color: #ffffff;
    border: none;
    margin: 10px 0;
}

.detail-review {
    color: #0D0B09;
    font-size: 10px;
    background-color: #ffffff;
    padding: 5px 10px;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bolder;
    transition: all 0.3s ease;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

.detail-review:hover {
    background-color: #BF0615;
    color: #ffffff;
}
</style>
