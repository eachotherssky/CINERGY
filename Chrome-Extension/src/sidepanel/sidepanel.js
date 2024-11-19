// src/sidepanel/sidepanel.js
let currentVideoTime = 0;

// 메시지 리스너 설정
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TIME_UPDATE') {
    updateTimeDisplay(message.data.formattedTime);
    currentVideoTime = message.data.currentTime;
  }
});

// 시간 표시 업데이트
function updateTimeDisplay(formattedTime) {
  const timeDisplay = document.getElementById('current-time');
  if (timeDisplay) {
    timeDisplay.textContent = formattedTime;
  }
}

// 댓글 제출
function submitComment() {
  const commentText = document.getElementById('comment-text').value;
  if (commentText.trim()) {
    const comment = {
      text: commentText,
      timestamp: currentVideoTime,
      created: new Date().toISOString()
    };
    
    // 여기에 댓글 저장 로직 추가
    console.log('New comment:', comment);
    document.getElementById('comment-text').value = '';
  }
}