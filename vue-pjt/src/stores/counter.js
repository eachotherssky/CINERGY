import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useCounterStore = defineStore('counter', () => {
  const API_URL = 'http://127.0.0.1:8000'
  const TMDB_URL = 'https://api.themoviedb.org/3'
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

  const tmdbApi = axios.create({
    baseURL: TMDB_URL,
    params: {
      api_key: TMDB_API_KEY,
      language: 'ko-KR',
    }
  })

  const token = ref(null)
  const isLogin = computed(() => {
    if (token.value === null) {
      return false
    } else {
      return true
    }
  })
  const movies = ref([])
  const router = useRouter()

  // 회원가입
  const signUp = function (payload) {
    const { username, password1, password2 } = payload
    
    axios({
      method: 'post',
      url: `${API_URL}/accounts/signup/`,
      data: {
        username, password1, password2
      }
    })
      .then((res) => {
        const password = password1
        logIn({ username, password })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
  // 로그인
  const logIn = async function (payload) {
    try {
      const response = await axios({
        method: 'post',
        url: `${API_URL}/accounts/login/`,
        data: payload
      });
      
      token.value = response.data.key;
      // localStorage 직접 저장 제거 (Pinia persist가 처리)

      // 로그인 성공 직후 사용자 프로필 정보 가져오기
      await getUserProfile();
      
      // Extension으로 토큰 전달
      window.postMessage({
        type: 'AUTH_TOKEN',
        token: response.data.key,
        userInfo: {
          username: payload.username
        }
      }, 'http://localhost:5173');
      
      router.push({ name: 'HomeView' });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  
  // 로그아웃
  // counter.js의 logOut 함수 수정
  const logOut = async function () {
    try {
      await axios({
        method: 'post',
        url: `${API_URL}/accounts/logout/`,
      });
      
      token.value = null;
      userProfile.value = null;
      
      // Extension에 로그아웃 알림
      window.postMessage({
        type: 'AUTH_TOKEN_CLEAR',
      }, '*');
      
      router.push({ name: 'HomeView' });
    } catch (err) {
      console.log(err);
    }
  };

   // 영화 목록 가져오기
   const getMovies = async (page = 1, genreId = null, sortBy = 'popularity.desc') => {
    try {
      const params = { 
        page, 
        sort_by: sortBy 
      }
      if (genreId) params.with_genres = genreId
  
      const response = await tmdbApi.get('/discover/movie', { params })
      movies.value = response.data.results
    } catch (error) {
      console.error("Error fetching movies:", error)
      throw new Error("영화 목록을 불러오는 중 문제가 발생했습니다.")
    }
  }

  // 장르 데이터 가져오기
  const getGenres = async () => {
    try {
      const response = await tmdbApi.get('/genre/movie/list')
      return response.data.genres
    } catch (error) {
      console.error("Error fetching genres:", error)
      throw new Error("장르 데이터를 불러오는 중 문제가 발생했습니다.")
    }
  }

    // 영화 상세 정보 가져오기 (original_title, 배우, 감독을 영어로 가져오기)
    const getMovieDetail = async (movieId) => {
      try {
        // 한국어로 기본 영화 정보 가져오기
        const response = await tmdbApi.get(`/movie/${movieId}`, {
          params: { append_to_response: 'credits,keywords,recommendations,similar' },
        });
  
        // 원제 (original_title)와 배우, 감독은 영어로 별도 요청
        const englishResponse = await axios.get(`${TMDB_URL}/movie/${movieId}`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'en-US', // 영어로 요청
            append_to_response: 'credits',
          }
        });
  
        // 영어로 받아온 정보를 결합
        response.data.original_title = englishResponse.data.original_title;
        response.data.credits = englishResponse.data.credits;
  
        return response.data;
      } catch (error) {
        console.error("Error fetching movie detail:", error);
        throw new Error("영화 상세 정보를 불러오는 중 문제가 발생했습니다.");
      }
    };

  // getPopularMovies에서 반환되는 데이터 확인
  const getPopularMovies = async (limit = 10) => {
    try {
      const response = await tmdbApi.get('/movie/popular');
      const movies = response.data.results.slice(0, limit);
      return movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        backdrop_path: movie.backdrop_path
      }));
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw new Error("인기 영화를 불러오는 중 문제가 발생했습니다.");
    }
  };

  // 영화 예고편 가져오기
  const getMovieTrailer = async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/videos`)
      return response.data
    } catch (error) {
      console.error("Error fetching movie trailer:", error)
      throw new Error("예고편을 불러오는 중 문제가 발생했습니다.")
    }
  }

  // 영화 댓글
  const comments = ref([])
  const getComments = function (movieId) {
    if (!token.value) {
      console.error("Token is missing. Please log in first.")
      return
    }
    axios({
      method: 'get',
      url: `${API_URL}/${movieId}/comments/`,
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then(res => {
        reviews.value = res.data
      })
      .catch(err => console.log(err))
  }  

  // 리뷰
  const reviews = ref([])
  const getReviews = function () {
    if (!token.value) {
      console.error("Token is missing. Please log in first.")
      return
    }
    axios({
      method: 'get',
      url: `${API_URL}/community/reviews/`,
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then(res => {
        reviews.value = res.data
      })
      .catch(err => console.log(err))
  }  

  // 리뷰 상세 정보 가져오기
  const getReviewDetail = function (reviewId) {
    if (!token.value) {
      console.error("Token is missing. Please log in first.")
      return
    }
    return axios({
      method: 'get',
      url: `${API_URL}/community/reviews/${reviewId}/`,
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then(res => {
        return res.data
      })
      .catch(err => {
        console.error('Error fetching review detail:', err)
        return null
      })
  }

  // 리뷰 수정
  const updateReview = async function (reviewId, updatedReview) {
    if (!token.value) {
      console.error("Token is missing. Please log in first.")
      return
    }

    try {
      const response = await axios({
        method: 'put',
        url: `${API_URL}/community/reviews/${reviewId}/`,
        data: updatedReview,
        headers: {
          Authorization: `Token ${token.value}`
        }
      })
      return response.data
    } catch (err) {
      console.error('Error updating review:', err)
    }
  }

  // 리뷰 삭제
  const deleteReview = async function (reviewId) {
    if (!token.value) {
      console.error("Token is missing. Please log in first.")
      return
    }

    try {
      await axios({
        method: 'delete',
        url: `${API_URL}/community/reviews/${reviewId}/`,
        headers: {
          Authorization: `Token ${token.value}`
        }
      })
    } catch (err) {
      console.error('Error deleting review:', err)
    }
  }


  // 카카오
  const handleKakaoCallback = async function(code) {
    try {
      console.log('Handling Kakao callback with code:', code);
      
      const response = await axios({
        method: 'get',
        url: `${API_URL}/accounts/kakao/callback/`,
        params: { code },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Kakao callback response:', response.data);
      
      if (response.data.key) {
        token.value = response.data.key;
        
        // Extension으로 토큰 전달
        window.postMessage({
          type: 'AUTH_TOKEN',
          token: response.data.key,
          userInfo: {
            username: 'kakao_user'  // 또는 카카오에서 받아온 사용자 정보
          }
        }, 'http://localhost:5173');

        await getUserProfile(); // 프로필 정보 가져오기
        return true;
      }
      return false;
    } catch (err) {
      console.error('카카오 콜백 처리 실패:', err.response?.data || err);
      throw err;
    }
  };

  // 프로필 페이지 관련
  const userProfile = ref(null)

  const getUserProfile = async function () {
    try {
      const response = await axios({
        method: 'get',
        url: `${API_URL}/accounts/profile/`,
        headers: {
          Authorization: `Token ${token.value}`
        }
      })
      userProfile.value = response.data
    } catch (err) {
      console.error('프로필 정보 로드 실패:', err)
    }
  }

  const recommendedContents = ref([])

  // 추천 콘텐츠 가져오기
  const getRecommendedContent = async function() {
    if (!token.value) {
      console.error("Token is missing")
      return
    }

    try {
      const response = await axios({
        method: 'get',
        url: `${API_URL}/community/api/recommended/`,
        headers: {
          Authorization: `Token ${token.value}`
        }
      })
      recommendedContents.value = response.data
    } catch (error) {
      console.error('추천 콘텐츠 로드 실패:', error)
    }
  }


  return { 
    API_URL, TMDB_URL, token, isLogin, movies, reviews, userProfile, comments,
    recommendedContents,
    signUp, logIn, logOut, handleKakaoCallback, getUserProfile,
    getMovies, getGenres, getMovieDetail, getMovieTrailer,
    getReviews, getReviewDetail, getComments, getPopularMovies,
    updateReview, deleteReview, getRecommendedContent
  }
}, { persist: true })
