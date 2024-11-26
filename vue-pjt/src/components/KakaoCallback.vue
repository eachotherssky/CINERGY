// views/KakaoCallback.vue
<template>
  <div class="callback-container">
    <h3>카카오 로그인 처리중...</h3>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter'

const router = useRouter()
const store = useCounterStore()

onMounted(async () => {
  const code = new URL(window.location.href).searchParams.get('code')
  if (code) {
    try {
      // 백엔드로 인증 코드 전송
      await store.handleKakaoCallback(code)
      router.push({ name: 'HomeView' })
    } catch (error) {
      console.error('카카오 로그인 처리 실패:', error)
      router.push({ name: 'LoginView' })
    }
  }
})
</script>