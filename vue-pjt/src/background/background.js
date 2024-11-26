// 사이드 패널을 툴바 아이콘 클릭으로 열 수 있게 설정
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// 확장 프로그램이 설치될 때 기본 동작 설정
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({
    enabled: true
  });
});

// Extension의 background.js에서 테스트
chrome.storage.local.get(null, function(items) {
  console.log('All storage items:', items);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 넷플릭스 콘텐츠 ID 관련
  if (message.type === 'TIME_UPDATE') {
    console.log('Background received Netflix info:', message.data.netflixInfo);
  }
  
  if (message.type === 'STORE_AUTH_TOKEN') {
    // 토큰 저장 시 Promise 사용
    chrome.storage.local.set({
      'auth_token': message.token,
      'user_info': message.userInfo,
      'timestamp': Date.now()
    }).then(() => {
      console.log('Token stored successfully');
      chrome.runtime.sendMessage({
        type: 'AUTH_STATUS_CHANGED',
        isAuthenticated: true
      });
    });
  } else if (message.type === 'AUTH_TOKEN_CLEAR') {
    // 로그아웃 처리
    chrome.storage.local.clear(() => {
      console.log('Storage cleared');
      chrome.runtime.sendMessage({
        type: 'AUTH_STATUS_CHANGED',
        isAuthenticated: false
      });
    });
  }
});

// 스토리지 변경 감지
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.auth_token) {
    console.log('Token updated:', changes.auth_token.newValue);
    // 사이드패널에 메시지 전달
    chrome.runtime.sendMessage({
      type: 'AUTH_TOKEN_UPDATED',
      token: changes.auth_token.newValue
    });
  }
});