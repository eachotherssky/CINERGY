// src/content/content.js
let videoPlayer = null;

// 비디오 플레이어 요소 감지
function initializeVideoTracking() {
  const observer = new MutationObserver(() => {
    if (!videoPlayer) {
      videoPlayer = document.querySelector('video');
      if (videoPlayer) {
        setupTimeTracking();
        observer.disconnect();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 시간 추적 설정
function setupTimeTracking() {
  videoPlayer.addEventListener('timeupdate', () => {
    const currentTime = videoPlayer.currentTime;
    const formattedTime = formatTime(currentTime);
    
    chrome.runtime.sendMessage({
      type: 'TIME_UPDATE',
      data: {
        currentTime,
        formattedTime
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

// 초기화
initializeVideoTracking();