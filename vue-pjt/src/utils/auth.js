export const checkAuthStatus = async () => {
  try {
    // counter에서 토큰 가져오기
    const counterData = localStorage.getItem('counter');
    let token = null;
    
    if (counterData) {
      try {
        const parsed = JSON.parse(counterData);
        token = parsed.token;
      } catch (error) {
        console.error('Counter data parsing failed:', error);
      }
    }

    // Extension storage 확인
    const storage = await chrome.storage.local.get(['auth_token']);
    
    if (!token && !storage.auth_token) {
      console.log('No token found in any storage');
      return { isAuthenticated: false };
    }

    // 토큰이 있으면 Extension storage에 저장
    if (token) {
      await chrome.storage.local.set({ 'auth_token': token });
    }

    return { isAuthenticated: true };
  } catch (error) {
    console.error('Auth check failed:', error);
    return { isAuthenticated: false };
  }
};