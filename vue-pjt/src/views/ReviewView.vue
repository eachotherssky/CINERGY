<template>
    <div class="community">
        <h1>Community</h1>
        <RouterLink :to="{ name: 'ReviewCreateView' }" class="create-link">CREATE</RouterLink>
        <div class="reviewlist">
            <ReviewList />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { RouterLink } from 'vue-router'
import ReviewList from '@/components/ReviewList.vue'

const store = useCounterStore()

onMounted(() => {
    store.getReviews()
})
</script>

<style scoped>
h1 {
    margin-top: 5%;
    margin-bottom: 5%;
    font-weight: bolder;
    font-size: 40px;
    color: #ffffff;
    text-align: center;
}

.community {
    margin: 0 auto;
    width: 70%;
    padding: 20px;
}

.create-link {
    display: block;
    margin: 30px auto;
    color: #BF0615;
    border: 2px solid #BF0615;
    background-color: #0D0B09;
    padding: 12px 30px;
    text-decoration: none;
    font-weight: bold;
    border-radius: 5px;
    text-align: center;
    transition: background-color 0.1s ease, color 0.1s ease;
}

.create-link:hover {
    color: #0D0B09;
    background-color: #BF0615;
}

.reviewlist {
    margin-top: 20px;
    padding: 50px;
    background-color: rgb(54, 54, 54, 0.2);
    border-radius: 10px;
}
</style>
