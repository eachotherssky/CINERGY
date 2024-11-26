import { createRouter, createWebHistory } from 'vue-router'
import { useCounterStore } from '@/stores/counter'

import HomeView from '@/views/HomeView.vue'
import MovieView from '@/views/MovieView.vue'
import MovieDetailView from '@/views/MovieDetailView.vue'
import ReviewCreateView from '@/views/ReviewCreateView.vue'
import ReviewDetailView from '@/views/ReviewDetailView.vue'
import ReviewView from '@/views/ReviewView.vue'
import SignupView from '@/views/SignupView.vue'
import LoginView from '@/views/LoginView.vue'
import KakaoCallback from '@/components/KakaoCallback.vue'
import ProfileView from '@/views/ProfileView.vue'
import YoutubeReviewSearchView from '@/views/YoutubeReviewSearchView.vue'
import RecommendedView from '@/views/RecommendedView.vue'
import EditReview from '@/components/EditReview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      name:'SignupView',
      component: SignupView
    },
    {
      path: '/login',
      name:'LoginView',
      component: LoginView
    },
    {
      path: '/profile',
      name: 'ProfileView',
      component: ProfileView
    },
    {
      path: '/',
      name: 'HomeView',
      component: HomeView
    },
    {
      path: '/movies',
      name: 'MovieView',
      component: MovieView,
    },
    {
      path: '/movie/:movieId',
      name: 'MovieDetailView',
      component: MovieDetailView
    },
    {
      path: '/reviews',
      name: 'ReviewView',
      component: ReviewView
    },
    {
      path: '/review/:id',
      name: 'ReviewDetailView',
      component: ReviewDetailView
    },
    {
      path: '/review/:id/edit',
      name: 'EditReview',
      component: EditReview
    },
    {
      path: '/review/create',
      name: 'ReviewCreateView',
      component: ReviewCreateView
    },
    {
      path: '/review/youtube',
      name: 'YoutubeReviewSearchView',
      component: YoutubeReviewSearchView

    },
    {
      path: '/recommended',
      name: 'RecommendedView',
      component: RecommendedView
    },
    {
      path: '/kakao/callback',
      name: 'KakaoCallback',
      component: KakaoCallback
    },
  ],
})

router.beforeEach((to, from) => {
  const store = useCounterStore()
  if (to.name === 'ReviewView' && !store.isLogin) {
    window.alert('로그인이 필요합니다.')
    return { name: 'LoginView' }
  }
  if ((to.name === 'SignupView' || to.name === 'LoginView' ) && (store.isLogin)) {
    window.alert(('이미 로그인이 되어있습니다.'))
    return { name: ReviewView}
  }
})

export default router
