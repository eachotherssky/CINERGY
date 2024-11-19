let currentVideoTime = 0;
let comments = [];
let lastDisplayedCommentTime = 0;

document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit-comment');
  const commentInput = document.getElementById('comment-text');
  
  submitButton.addEventListener('click', submitComment);
  commentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  });
});

// 메시지 리스너 설정
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TIME_UPDATE') {
    updateTimeDisplay(message.data.formattedTime);
    handleTimeUpdate(message.data.currentTime);
  }
});

// 시간 업데이트 처리
function handleTimeUpdate(newTime) {
  const previousTime = currentVideoTime;
  currentVideoTime = newTime;
  
  // 시간이 되돌아갔거나 앞으로 갔을 때
  if (Math.abs(newTime - previousTime) > 1) {
    lastDisplayedCommentTime = 0;
    updateCommentsDisplay();
  } else {
    // 정상 재생 중일 때
    displayNewComments();
  }
}

// 새로운 댓글 표시
function displayNewComments() {
  const newComments = comments
    .filter(comment => 
      comment.timestamp > lastDisplayedCommentTime && 
      comment.timestamp <= currentVideoTime
    )
    .sort((a, b) => a.timestamp - b.timestamp);

  if (newComments.length > 0) {
    newComments.forEach(comment => {
      appendCommentToDisplay(comment);
    });
    lastDisplayedCommentTime = currentVideoTime;
  }
}

// 전체 댓글 목록 업데이트
function updateCommentsDisplay() {
  const container = document.getElementById('comments-container');
  container.innerHTML = '';
  
  const visibleComments = comments
    .filter(comment => comment.timestamp <= currentVideoTime)
    .sort((a, b) => a.timestamp - b.timestamp);
    
  visibleComments.forEach(comment => {
    appendCommentToDisplay(comment);
  });
}

// 댓글 요소 추가
function appendCommentToDisplay(comment) {
  const container = document.getElementById('comments-container');
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
  
  // 자동 스크롤
  container.scrollTop = container.scrollHeight;
}

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
    comments.sort((a, b) => a.timestamp - b.timestamp);
    document.getElementById('comment-text').value = '';
  }
}

// 시간 포맷 변환
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}