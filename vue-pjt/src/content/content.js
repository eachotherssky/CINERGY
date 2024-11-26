let videoPlayer = null;

// Netflix 영화 정보 추출 함수 추가
function getNetflixInfo() {
  try {
      const pathMatch = window.location.pathname.match(/watch\/(\d+)/);
      const netflixId = pathMatch ? pathMatch[1] : null;
      const currentTime = videoPlayer ? videoPlayer.currentTime : 0;
      
      // title 추출 우선순위 설정
      let title = null;
      
      // 1. 비디오 제목 요소들 (여러 선택자 시도)
      const titleSelectors = [
          '[data-uia="video-title"]',
          '.video-title h4',
          '.watch-title',
          '[data-uia="player-title"]',
          '.title-title'
      ];

      for (const selector of titleSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent.trim() && 
              element.textContent.trim() !== '넷플릭스') {
              title = element.textContent.trim();
              break;
          }
      }

      // 2. 동적 로딩 대응
      if (!title || title === '넷플릭스') {
          console.log('Waiting for title element...');
          return null;
      }

      const info = {
          netflix_id: netflixId,
          current_url: window.location.href,
          video_time: currentTime,
          title: title
      };
      
      console.log('Netflix Info:', info);
      return info;
  } catch (error) {
      console.error('Failed to get Netflix info:', error);
      return null;
  }
}


// DOM 변경 감지를 위한 MutationObserver 추가
function initializeVideoTracking() {
  const observer = new MutationObserver(() => {
      if (!videoPlayer) {
          videoPlayer = document.querySelector('video');
          if (videoPlayer) {
              setupTimeTracking();
              // 페이지 로드 후 약간의 지연을 두고 정보 가져오기
              setTimeout(() => {
                  const netflixInfo = getNetflixInfo();
                  if (netflixInfo?.netflix_id) {
                      chrome.runtime.sendMessage({
                          type: 'NETFLIX_ID_CHANGED',
                          netflix_id: netflixInfo.netflix_id
                      });
                  }
              }, 1000);
              observer.disconnect();
          }
      }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// 비디오 플레이어 요소 감지
// function initializeVideoTracking() {
//   const observer = new MutationObserver(() => {
//       if (!videoPlayer) {
//           videoPlayer = document.querySelector('video');
//           if (videoPlayer) {
//               setupTimeTracking();
//               // Netflix ID 변경 감지 시 채팅 로드
//               const netflixInfo = getNetflixInfo();
//               if (netflixInfo?.netflix_id) {
//                   chrome.runtime.sendMessage({
//                       type: 'NETFLIX_ID_CHANGED',
//                       netflix_id: netflixInfo.netflix_id
//                   });
//               }
//               observer.disconnect();
//           }
//       }
//   });
//   observer.observe(document.body, { childList: true, subtree: true });
// }
function initializeVideoTracking() {
  const observer = new MutationObserver(() => {
      if (!videoPlayer) {
          videoPlayer = document.querySelector('video');
          if (videoPlayer) {
              setupTimeTracking();
              
              // title이 제대로 로드될 때까지 반복 시도
              let attempts = 0;
              const titleInterval = setInterval(() => {
                  const netflixInfo = getNetflixInfo();
                  if (netflixInfo?.title && netflixInfo.title !== '넷플릭스') {
                      chrome.runtime.sendMessage({
                          type: 'NETFLIX_ID_CHANGED',
                          netflix_id: netflixInfo.netflix_id
                      });
                      clearInterval(titleInterval);
                  } else if (attempts++ > 10) {
                      clearInterval(titleInterval);
                      console.error('Failed to get proper title after multiple attempts');
                  }
              }, 1000);
              
              observer.disconnect();
          }
      }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// 시간 추적 설정
function setupTimeTracking() {
  videoPlayer.addEventListener('timeupdate', () => {
    const currentTime = videoPlayer.currentTime;
    const formattedTime = formatTime(currentTime);
    const netflixInfo = getNetflixInfo();
    
    console.log('Time Update with Netflix Info:', {
      currentTime,
      formattedTime,
      netflixInfo
    });  // 디버깅 로그 추가
    
    chrome.runtime.sendMessage({
      type: 'TIME_UPDATE',
      data: {
        currentTime,
        formattedTime,
        netflixInfo
      }
    });
  });
}

// 시간 포맷 변환
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


window.addEventListener('message', function(event) {
  if (event.origin !== "http://localhost:5173") return;
  
  if (event.data.type === 'AUTH_TOKEN') {
    // Netflix 정보 가져오기
    const netflixInfo = getNetflixInfo();

    // 기존 토큰 초기화 후 새 토큰 저장
    chrome.runtime.sendMessage({
      type: 'AUTH_TOKEN_CLEAR'
    }, () => {
      chrome.runtime.sendMessage({
        type: 'STORE_AUTH_TOKEN',
        token: event.data.token,
        userInfo: event.data.userInfo,
        netflixInfo: netflixInfo  // Netflix 정보 추가
      });
    });
  } else if (event.data.type === 'AUTH_TOKEN_CLEAR') {
    chrome.runtime.sendMessage({
      type: 'AUTH_TOKEN_CLEAR'
    });
  }
});


function getStoredToken() {
  const counterData = localStorage.getItem('counter');
  if (!counterData) return null;
  
  try {
    const parsed = JSON.parse(counterData);
    return parsed.token || null;
  } catch (error) {
    console.error('Token parsing failed:', error);
    return null;
  }
}

function monitorToken() {
  const token = getStoredToken();
  if (token) {
    chrome.runtime.sendMessage({
      type: 'STORE_AUTH_TOKEN',
      token: token,
      userInfo: { token: token }
    });
  }
}

// 초기화에 토큰 모니터링 추가
initializeVideoTracking();
monitorToken();