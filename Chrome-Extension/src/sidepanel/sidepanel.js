let currentVideoTime = 0;
let comments = [];
let lastDisplayedCommentTime = 0;
let isSubmitDisabled = false; // 제출 가능 여부를 추적하는 변수 추가

const badWords = [
  '씨발', '병신', '지랄', '새끼', '시발', 
  '개새끼', '미친', '씨팔', '존나', '좆', 
  '니미', '엿먹어', '뒤져', '죽어'
];

function filterBadWords(text) {
  let filteredText = text;
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  return filteredText;
}

document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit-comment');
  const commentInput = document.getElementById('comment-text');
  const warningMessage = document.querySelector('.warning-message');

  // 수정된 submitComment 함수
  function submitComment() {
    if (isSubmitDisabled) return; // 비활성화 상태면 제출 불가
    
    const commentText = commentInput.value;
    if (commentText.trim()) {
      const filteredText = filterBadWords(commentText);
      
      const comment = {
        text: filteredText,
        timestamp: currentVideoTime,
        created: new Date().toISOString()
      };
      
      comments.push(comment);
      comments.sort((a, b) => a.timestamp - b.timestamp);
      commentInput.value = '';
    }
  }

  // 이벤트 리스너 설정
  submitButton.addEventListener('click', submitComment);
  commentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitComment(); // isSubmitDisabled 상태에 따라 동작
    }
  });
  
  // 실시간 필터링 이벤트 리스너
  commentInput.addEventListener('input', () => {
    const text = commentInput.value;
    const hasInappropriateContent = badWords.some(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    
    if (hasInappropriateContent) {
      commentInput.classList.add('warning');
      warningMessage.textContent = '부적절한 단어가 포함되어 있습니다.';
      warningMessage.style.display = 'block';
      submitButton.disabled = true;
      isSubmitDisabled = true; // 전역 상태 업데이트
    } else {
      commentInput.classList.remove('warning');
      warningMessage.style.display = 'none';
      submitButton.disabled = false;
      isSubmitDisabled = false; // 전역 상태 업데이트
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
  
  // 필터링된 텍스트에 스타일 적용
  const textContent = comment.text;
  textElement.innerHTML = textContent.split('').map(char => 
    char === '*' ? '<span class="censored">*</span>' : char
  ).join('');
  
  commentElement.appendChild(timeElement);
  commentElement.appendChild(textElement);
  container.appendChild(commentElement);
  
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
    const filteredText = filterBadWords(commentText); // 욕설 필터링 적용
    
    const comment = {
      text: filteredText, // 필터링된 텍스트 저장
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