<template>
  <div>
    <MovieDetailInfo />
  </div>
</template>

<script setup>
import MovieDetailInfo from '@/components/MovieDetailInfo.vue'

defineProps({
  movie: Object
})
</script>

<style scoped>

</style>