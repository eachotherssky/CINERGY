<template>
    <div>
        <div class="reviewlist">
            <ReviewListItem 
                v-for="review in store.reviews"
                :key="review.id"
                :review="review"
            />
        </div>
    </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'
import ReviewListItem from './ReviewListItem.vue'

const store = useCounterStore()
</script>

<style scoped>

.reviewlist {
    display: flex;
    flex-direction: column; 
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin: 0 auto;
}
</style>
