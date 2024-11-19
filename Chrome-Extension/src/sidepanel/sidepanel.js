let currentVideoTime = 0;
let comments = [];

// DOM이 로드된 후 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
  // 버튼 클릭 이벤트 리스너 등록
  const submitButton = document.getElementById('submit-comment');
  submitButton.addEventListener('click', submitComment);
});

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
    
    comments.push(comment);
    updateCommentsDisplay();
    document.getElementById('comment-text').value = '';
  }
}

// 댓글 목록 표시 업데이트
function updateCommentsDisplay() {
  const container = document.getElementById('comments-container');
  container.innerHTML = '';
  
  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment-item';
    
    const timeElement = document.createElement('div');
    timeElement.className = 'comment-time';
    timeElement.textContent = formatTime(comment.timestamp);
    
    const textElement = document.createElement('div');
    textElement.className = 'comment-text';
    textElement.textContent = comment.text;
    
    commentElement.appendChild(timeElement);
    commentElement.appendChild(textElement);
    container.appendChild(commentElement);
  });
}

// 시간 포맷 변환
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}