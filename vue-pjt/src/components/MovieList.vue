<template>
  <div>
    <div class="filter-options">
      <div class="left">
        <select v-model="selectedGenre" @change="applyFilter">
          <option value="">All</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>
      <div class="right">
        <button class="btn" @click="sortBy('popularity.desc')">인기순</button>
        <button class="btn" @click="sortBy('release_date.desc')">최신순</button>
        <button class="btn" @click="sortBy('vote_average.desc')">평점순</button>
      </div>
    </div>

    <div class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">
      <MovieListItem 
        v-for="movie in store.movies"
        :key="movie.id"
        :movie="movie"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCounterStore } from '@/stores/counter'
import MovieListItem from './MovieListItem.vue'

const store = useCounterStore()

const genres = ref([])
const selectedGenre = ref('')
const selectedSort = ref('popularity.desc')

const applyFilter = async () => {
  await store.getMovies(1, selectedGenre.value, selectedSort.value)
}

const sortBy = async (sortType) => {
  selectedSort.value = sortType
  await applyFilter()
}

onMounted(async () => {
  genres.value = await store.getGenres()
  await store.getMovies()
})
</script>

<style scoped>
.filter-options {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  flex: 1;
}

.right {
  display: flex;
  justify-content: flex-end;
}

.btn {
  color: white;
  font-weight: bold;
}
</style>
