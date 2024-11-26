<template>
  <div>
    <div class="movie-detail-example">
      <img class="movie-background-1" :src="`https://image.tmdb.org/t/p/original${movieDetail.backdrop_path}`" :alt="movieDetail.title" />
    </div>
    
    <div class="movie-data">
        <div v-if="isNowPlaying" class="now-playing">Now playing</div>
        <div v-else class="now-playing">To be released</div>
        <div class="title2">{{ movieDetail.title }}</div>
        <div class="movie-info responsive-text">
          {{ getReleaseYear(movieDetail.release_date) }} 
          {{ getFormattedRuntime(movieDetail.runtime) }} 
          [{{ movieDetail.spoken_languages && movieDetail.spoken_languages[0] 
            ? movieDetail.spoken_languages[0].iso_639_1 
            : '정보 없음' }}]
          {{ getDirector() }} 
          {{ getCast() }}
        </div>

      <div class="ott">
        <img class="netflix"src="@/assets/NETFLIX.svg" alt="coupangplay">
        <img class="tving"src="@/assets/TVING.svg" alt="coupangplay">
        <img class="watcha"src="@/assets/WATCHA.svg" alt="coupangplay">
        <img class="disneyplus"src="@/assets/DISNEYPLUS.svg" alt="coupangplay">
        <img class="coupangplay"src="@/assets/COUPANGPLAY.webp" alt="coupangplay">
      </div>

      <div class="overview">
        {{ movieDetail.overview }}
      </div>
      
      <div class="movie-score">
      <div class="percent">%</div>
      <div class="vote-average">{{ Math.round(movieDetail.vote_average*10) }}</div>
      <div class="tmdb">TMDB</div>
      <div class="circle"></div>
    </div>
    
    <div class="line-1"></div>
    
    <img class="poster" :src="`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`" :alt="movie-poster" />
    <div class="original-title">{{ movieDetail.original_title }}</div>
    <div v-if="movieDetail.tagline" class="tagline">“ {{ movieDetail.tagline }} ”</div>
    <div class="genre-info">
      <div class="genre">GENRE</div>
      <div v-if="movieDetail.genres" class="movie-genre">{{ movieDetail.genres.map(genre => genre.name).join(', ') }}</div>
    </div>
    <div class="keyword-info">
      <div class="keyword">KEYWORD</div>
      <div class="movie-keyword">
        {{ movieDetail.keywords && movieDetail.keywords.keywords && movieDetail.keywords.keywords.length > 0 
        ? movieDetail.keywords.keywords.map(keyword => keyword.name).join(', ') 
        : '정보 없음' }}
      </div>
    </div>
    
    <div v-if="trailerUrl" class="youtube">
      <img 
      @click="openTrailerModal" 
      src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" 
      alt="YouTube logo" 
      style="width: 50px; cursor: pointer;" 
      />
    </div>
    <YoutubeTrailerModal ref="modal" />
  </div>
      
  </div>
</template>


<script setup>

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/counter'
import YoutubeTrailerModal from './YoutubeTrailerModal.vue'

const store = useCounterStore()
const route = useRoute()
const movieId = route.params.movieId
const movieDetail = ref({})
const trailerUrl = ref()
const modal = ref()

const fetchMovieDetail = async () => {
  try {
    movieDetail.value = await store.getMovieDetail(movieId);
    const trailerData = await store.getMovieTrailer(movieId);
    if (trailerData.results && trailerData.results.length > 0) {
      trailerUrl.value = `https://www.youtube.com/embed/${trailerData.results[0].key}`;
    }
  } catch (error) {
    console.error("Error fetching movie detail:", error);
  }
}

const getReleaseYear = (releaseDate) => {
  return releaseDate ? new Date(releaseDate).getFullYear() : '정보 없음';
}

const getFormattedRuntime = (runtime) => {
  if (!runtime || runtime < 0) return '정보 없음';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

const getDirector = () => {
  if (movieDetail.value.credits && movieDetail.value.credits.crew) {
    const director = movieDetail.value.credits.crew.find(person => person.job === 'Director')
    return director ? director.name : '정보 없음'
  }
  return '정보 없음'
}

const getCast = () => {
  if (movieDetail.value.credits && movieDetail.value.credits.cast) {
    return movieDetail.value.credits.cast.slice(0, 3).map(actor => actor.name).join(', ');
  }
  return '정보 없음';
}

const isNowPlaying = computed(() => {
  if (!movieDetail.value || !movieDetail.value.release_date) return false;
  const today = new Date();
  const releaseDate = new Date(movieDetail.value.release_date);
  return releaseDate <= today;
})

const openTrailerModal = () => {
  if (trailerUrl.value) {
    modal.value.openModal(trailerUrl.value);
  }
}

onMounted(fetchMovieDetail)
</script>

<style scoped>
.movie-detail-example,
.movie-detail-example * {
  box-sizing: border-box;
}
.movie-detail-example {
  background: #0D0B09;
  height: 1024px;
  position: relative;
  overflow: hidden;
}
.movie-background-1 {
  width: 1440px;
  height: 1024px;
  position: absolute;
  left: calc(50% - 720px);
  top: 0px;
  object-fit: cover;
  filter: brightness(60%);
}
.div {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Light", sans-serif;
  font-size: 36px;
  font-weight: 300;
  position: absolute;
  left: 1391px;
  top: 60px;
  width: 26px;
  height: 12px;
  transform-origin: 0 0;
  transform: rotate(-180deg) scale(1, 1);
}
.movie-detail {
  position: absolute;
  inset: 0;
}
.movie-data {
  width: 1500px;
  height: 326px;
  position: absolute;
  left: calc(50% - 720px);
  top: 20px;
}
.ott {
  width: 356px;
  height: 15px;
  position: static;
}
.coupangplay {
  width: 100px;
  height: 15px;
  position: absolute;
  left: 514px;
  top: 522px;
  object-fit: cover;
}
.disneyplus {
  width: 27.46px;
  height: 15px;
  position: absolute;
  left: 471px;
  top: 522px;
  object-fit: cover;
}
.watcha {
  width: 51.14px;
  height: 15px;
  position: absolute;
  left: 404px;
  top: 522px;
  object-fit: cover;
}
.tving {
  width: 59.47px;
  height: 15px;
  position: absolute;
  left: 329px;
  top: 522px;
  object-fit: cover;
}
.netflix {
  width: 55.56px;
  height: 15px;
  position: absolute;
  left: 258px;
  top: 522px;
  object-fit: cover;
}
.overview {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Regular", sans-serif;
  font-size: 15px;
  line-height: 25px;
  font-weight: 400;
  position: absolute;
  left: 258px;
  top: 380px;
  width: 800px;
  height: 124px;
}
.movie-info {
  height: 18px;
  position: static;
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Regular", sans-serif;
  font-size: 15px;
  font-weight: 400;
  position: absolute;
  left: 258px;
  top: 350px;
}
.cast {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Regular", sans-serif;
  font-size: 15px;
  font-weight: 400;
  position: absolute;
  left: 486px;
  top: 358px;
}
.director {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Regular", sans-serif;
  font-size: 15px;
  font-weight: 400;
  position: absolute;
  left: 395px;
  top: 358px;
}
.spoken-languages {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Regular", sans-serif;
  font-size: 15px;
  font-weight: 400;
  position: absolute;
  left: 367px;
  top: 358px;
}
.runtime {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Regular", sans-serif;
  font-size: 15px;
  font-weight: 400;
  position: absolute;
  left: 305px;
  top: 358px;
}
.release-date {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Regular", sans-serif;
  font-size: 15px;
  font-weight: 400;
  position: absolute;
  left: 258px;
  top: 358px;
}
.title2 {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Black", sans-serif;
  font-size: 90px;
  font-weight: 900;
  position: absolute;
  left: 258px;
  top: 225px;
}
.now-playing {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-ExtraBold", sans-serif;
  font-size: 20px;
  font-weight: 800;
  position: absolute;
  left: 258px;
  top: 211px;
}
.movie-score {
  width: 150px;
  height: 150px;
  position: static;
}
.vote-count {
  color: #ffffff;
  text-align: center;
  font-family: "Inter-Light", sans-serif;
  font-size: 16px;
  letter-spacing: 0.2em;
  font-weight: 300;
  position: absolute;
  left: 1110px;
  top: 481px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.percent {
  color: #ffffff;
  text-align: center;
  font-family: "Inter-Black", sans-serif;
  font-size: 20px;
  line-height: 25px;
  font-weight: 900;
  position: absolute;
  left: 1198px;
  top: 460px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vote-average {
  color: #ffffff;
  text-align: center;
  font-family: "Inter-Black", sans-serif;
  font-size: 40px;
  line-height: 25px;
  font-weight: 900;
  position: absolute;
  left: 1148px;
  top: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tmdb {
  color: #ffffff;
  text-align: center;
  font-family: "Inter-Bold", sans-serif;
  font-size: 12px;
  letter-spacing: 0.3em;
  font-weight: 700;
  position: absolute;
  left: 1152px;
  top: 418px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.circle {
  border: 8px solid white;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  position: absolute;
  left: 1100PX;
  top: 384px;
}
.line-1 {
  margin-top: -1px;
  border-style: solid;
  border-color: #ffffff;
  border-width: 1px 0 0 0;
  width: 1021px;
  height: 0px;
  position: absolute;
  left: 224px;
  top: 560px;
  transform-origin: 0 0;
  transform: rotate(-0.112deg) scale(1, 1);
}
.poster {
  width: 192px;
  height: 288.1px;
  position: absolute;
  left: 258px;
  top: 609px;
  object-fit: cover;
}
.original-title {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-ExtraBold", sans-serif;
  font-size: 36px;
  line-height: 25px;
  font-weight: 800;
  position: absolute;
  left: 557px;
  top: 609px;
}
.tagline {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Light", sans-serif;
  font-size: 18px;
  line-height: 25px;
  font-weight: 300;
  position: absolute;
  left: 557px;
  top: 654px;
  width: 469px;
}
.genre-info {
  width: 469px;
  height: 50px;
  position: static;
}
.movie-genre {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Light", sans-serif;
  font-size: 15px;
  line-height: 25px;
  font-weight: 300;
  position: absolute;
  left: 557px;
  top: 722px;
  width: 469px;
}
.genre {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Bold", sans-serif;
  font-size: 20px;
  line-height: 25px;
  font-weight: 700;
  position: absolute;
  left: 557px;
  top: 697px;
}
.keyword-info {
  width: 469px;
  height: 125px;
  position: static;
}
.movie-keyword {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Light", sans-serif;
  font-size: 15px;
  line-height: 25px;
  font-weight: 300;
  position: absolute;
  left: 557px;
  top: 797px;
  width: 469px;
}
.keyword {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Bold", sans-serif;
  font-size: 20px;
  line-height: 25px;
  font-weight: 700;
  position: absolute;
  left: 557px;
  top: 772px;
}
.youtube {
  width: 72.23px;
  height: 50px;
  position: absolute;
  left: 1129px;
  top: 815px;
  object-fit: cover;
}
.chatting {
  position: absolute;
  inset: 0;
}
.full-screen {
  background: #0D0B09;
  border-radius: 10px;
  width: 1000px;
  height: 750px;
  position: absolute;
  left: 220px;
  top: 1161px;
  filter: opacity(50%);
}
.message {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Thin", sans-serif;
  font-size: 20px;
  line-height: 25px;
  font-weight: 100;
  position: absolute;
  left: 343px;
  top: 1817px;
}
.line {
  margin-top: -1px;
  border-style: solid;
  border-color: #ffffff;
  border-width: 1px 0 0 0;
  width: 800px;
  height: 0px;
  position: absolute;
  left: calc(50% - 400px);
  top: 1796px;
  transform-origin: 0 0;
  transform: rotate(0deg) scale(1, 1);
}
.user-comment {
  width: 887px;
  height: 82px;
  position: static;
}
.commentbox {
  background: #f8f3f4;
  border-radius: 25px;
  width: 750px;
  height: 52px;
  position: absolute;
  left: 412px;
  top: 1315px;
}
.comment {
  color: #000000;
  text-align: left;
  font-family: "Inter-Medium", sans-serif;
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  position: absolute;
  left: 441px;
  top: 1328px;
}
.time {
  color: #f8f3f4;
  text-align: left;
  font-family: "Inter-Black", sans-serif;
  font-size: 15px;
  line-height: 25px;
  font-weight: 900;
  position: absolute;
  left: 333px;
  top: 1328px;
}
.username2 {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Medium", sans-serif;
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  position: absolute;
  left: 318px;
  top: 1287px;
}
.userprofile-image {
  background: #bf0615;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  position: absolute;
  left: 275px;
  top: 1285px;
}
.commentbox2 {
  background: #f8f3f4;
  border-radius: 25px;
  width: 750px;
  height: 52px;
  position: absolute;
  left: 415px;
  top: 1417px;
}
.comment2 {
  color: #000000;
  text-align: left;
  font-family: "Inter-Medium", sans-serif;
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  position: absolute;
  left: 444px;
  top: 1430px;
}
.time2 {
  color: #f8f3f4;
  text-align: left;
  font-family: "Inter-Black", sans-serif;
  font-size: 15px;
  line-height: 25px;
  font-weight: 900;
  position: absolute;
  left: 336px;
  top: 1430px;
}
.username3 {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Medium", sans-serif;
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  position: absolute;
  left: 321px;
  top: 1389px;
}
.userprofile-image2 {
  background: #bf0615;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  position: absolute;
  left: 278px;
  top: 1387px;
}
.commentbox3 {
  background: #f8f3f4;
  border-radius: 25px;
  width: 750px;
  height: 52px;
  position: absolute;
  left: 415px;
  top: 1519px;
}
.comment3 {
  color: #000000;
  text-align: left;
  font-family: "Inter-Medium", sans-serif;
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  position: absolute;
  left: 444px;
  top: 1532px;
}
.time3 {
  color: #f8f3f4;
  text-align: left;
  font-family: "Inter-Black", sans-serif;
  font-size: 15px;
  line-height: 25px;
  font-weight: 900;
  position: absolute;
  left: 336px;
  top: 1532px;
}
.username4 {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Medium", sans-serif;
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  position: absolute;
  left: 321px;
  top: 1491px;
}
.userprofile-image3 {
  background: #bf0615;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  position: absolute;
  left: 278px;
  top: 1489px;
}
.commentbox4 {
  background: #f8f3f4;
  border-radius: 25px;
  width: 750px;
  height: 52px;
  position: absolute;
  left: 415px;
  top: 1621px;
}
.comment4 {
  color: #000000;
  text-align: left;
  font-family: "Inter-Medium", sans-serif;
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  position: absolute;
  left: 444px;
  top: 1634px;
}
.time4 {
  color: #f8f3f4;
  text-align: left;
  font-family: "Inter-Black", sans-serif;
  font-size: 15px;
  line-height: 25px;
  font-weight: 900;
  position: absolute;
  left: 336px;
  top: 1634px;
}
.username5 {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Medium", sans-serif;
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  position: absolute;
  left: 321px;
  top: 1593px;
}
.userprofile-image4 {
  background: #bf0615;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  position: absolute;
  left: 278px;
  top: 1591px;
}
.commentbox5 {
  background: #f8f3f4;
  border-radius: 25px;
  width: 750px;
  height: 52px;
  position: absolute;
  left: 412px;
  top: 1723px;
}
.comment5 {
  color: #000000;
  text-align: left;
  font-family: "Inter-Medium", sans-serif;
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  position: absolute;
  left: 441px;
  top: 1736px;
}
.time5 {
  color: #f8f3f4;
  text-align: left;
  font-family: "Inter-Black", sans-serif;
  font-size: 15px;
  line-height: 25px;
  font-weight: 900;
  position: absolute;
  left: 333px;
  top: 1736px;
}
.username6 {
  color: #ffffff;
  text-align: left;
  font-family: "Inter-Medium", sans-serif;
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  position: absolute;
  left: 318px;
  top: 1695px;
}
.userprofile-image5 {
  background: #bf0615;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  position: absolute;
  left: 275px;
  top: 1693px;
}
.line2 {
  margin-top: -1px;
  border-style: solid;
  border-color: #ffffff;
  border-width: 1px 0 0 0;
  width: 800px;
  height: 0px;
  position: absolute;
  left: calc(50% - 400px);
  top: 1259px;
  transform-origin: 0 0;
  transform: rotate(0deg) scale(1, 1);
}
.title3 {
  color: #ffffff;
  text-align: right;
  font-family: "Inter-SemiBold", sans-serif;
  font-size: 32px;
  line-height: 25px;
  font-weight: 600;
  position: absolute;
  left: calc(50% - 400px);
  top: 1212px;
  width: 800px;
}
</style>
