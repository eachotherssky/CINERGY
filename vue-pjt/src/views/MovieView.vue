<template>
    <div class="p-5">
        <h1>Movie Page</h1>
        <br>
        <MovieList />
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCounterStore } from '@/stores/counter'
import MovieList from '@/components/MovieList.vue'

const store = useCounterStore()

onMounted(() => {
    store.getMovies()
})
</script>

<style scoped>

</style>