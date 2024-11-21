// 전역 변수 선언
let currentVideoTime = 0;
let comments = [];
let lastDisplayedCommentTime = 0;
let isSubmitDisabled = false;

// 상수 정의
const badWords = [
  '씨발', '시발', 'ㅆㅂ', 'ㅅㅂ', '병신', 'ㅄ', 'ㅂㅅ',
  '지랄', '새끼', '개새끼', '미친', '씨팔', '존나', '좆', 
  '니미', '엿먹어', '뒤져', '죽어'
];

const MAX_COMMENT_LENGTH = 300;

// 유틸리티 함수
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function filterBadWords(text) {
  let filteredText = text;
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  return filteredText;
}

// 댓글 관련 함수
function createComment(text) {
  return {
    text: filterBadWords(text),
    timestamp: currentVideoTime,
    created: new Date().toISOString()
  };
}

function appendCommentToDisplay(comment) {
  const container = document.getElementById('comments-container');
  const commentElement = document.createElement('div');
  commentElement.className = 'comment-item';
  
  const timeElement = document.createElement('div');
  timeElement.className = 'comment-time';
  timeElement.textContent = formatTime(comment.timestamp);
  
  const textElement = document.createElement('div');
  textElement.className = 'comment-text';
  textElement.innerHTML = comment.text.split('').map(char => 
    char === '*' ? '<span class="censored">*</span>' : char
  ).join('');
  
  commentElement.appendChild(timeElement);
  commentElement.appendChild(textElement);
  container.appendChild(commentElement);
  
  container.scrollTop = container.scrollHeight;
}

// 댓글 표시 관련 함수
function displayNewComments() {
  const newComments = comments
    .filter(comment => 
      comment.timestamp > lastDisplayedCommentTime && 
      comment.timestamp <= currentVideoTime + 1
    )
    .sort((a, b) => a.timestamp - b.timestamp);

  if (newComments.length > 0) {
    newComments.forEach(appendCommentToDisplay);
    lastDisplayedCommentTime = Math.max(...newComments.map(c => c.timestamp));
  }
}

// 시간 관련 함수
function handleTimeUpdate(newTime) {
  const previousTime = currentVideoTime;
  currentVideoTime = newTime;

  if (Math.abs(newTime - previousTime) > 1) {
    const container = document.getElementById('comments-container');
    container.innerHTML = '';

    const timeNotice = document.createElement('div');
    timeNotice.className = 'time-notice';
    timeNotice.textContent = `${formatTime(newTime)} 이후의 채팅입니다.`;
    container.appendChild(timeNotice);

    lastDisplayedCommentTime = newTime;
    displayNewComments();
  } else {
    displayNewComments();
  }
}

function updateTimeDisplay(formattedTime) {
  const timeDisplay = document.getElementById('current-time');
  if (timeDisplay) {
    timeDisplay.textContent = formattedTime;
  }
}

// 글자 수 카운터 업데이트
function updateCharCounter(input, counter) {
  const currentLength = input.value.length;
  counter.textContent = `${currentLength} / ${MAX_COMMENT_LENGTH}`;
  
  if (currentLength >= MAX_COMMENT_LENGTH * 0.9) { // 90% 이상일 때
    counter.classList.add('limit');
  } else {
    counter.classList.remove('limit');
  }
}

// 이벤트 핸들러
function handleSubmit() {
  if (isSubmitDisabled) return;
  
  const commentInput = document.getElementById('comment-text');
  const commentText = commentInput.value;
  const charCounter = document.querySelector('.char-counter');
  
  if (commentText.trim() && commentText.length <= MAX_COMMENT_LENGTH) {
    const comment = createComment(commentText);
    comments.push(comment);
    comments.sort((a, b) => a.timestamp - b.timestamp);
    commentInput.value = '';
    updateCharCounter(commentInput, charCounter);
  }
}

function handleInputValidation(input, warningMessage, submitButton) {
  const hasInappropriateContent = badWords.some(word => 
    input.value.toLowerCase().includes(word.toLowerCase())
  );
  
  const exceedsLimit = input.value.length > MAX_COMMENT_LENGTH;
  
  input.classList.toggle('warning', hasInappropriateContent || exceedsLimit);
  warningMessage.style.display = (hasInappropriateContent || exceedsLimit) ? 'block' : 'none';
  warningMessage.textContent = hasInappropriateContent 
    ? '부적절한 단어가 포함되어 있습니다.' 
    : exceedsLimit 
      ? '최대 글자 수를 초과했습니다.' 
      : '';
  
  submitButton.disabled = hasInappropriateContent || exceedsLimit;
  isSubmitDisabled = hasInappropriateContent || exceedsLimit;
}

// 초기화 및 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit-comment');
  const commentInput = document.getElementById('comment-text');
  const warningMessage = document.querySelector('.warning-message');
  const charCounter = document.querySelector('.char-counter');

  // 초기 카운터 설정
  updateCharCounter(commentInput, charCounter);

  // 입력 이벤트
  commentInput.addEventListener('input', () => {
    updateCharCounter(commentInput, charCounter);
    handleInputValidation(commentInput, warningMessage, submitButton);
    
    if (commentInput.value.length > MAX_COMMENT_LENGTH) {
      commentInput.value = commentInput.value.slice(0, MAX_COMMENT_LENGTH);
      updateCharCounter(commentInput, charCounter);
    }
  });

  // 제출 이벤트
  submitButton.addEventListener('click', handleSubmit);
  commentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (commentInput.value.length <= MAX_COMMENT_LENGTH) {
        handleSubmit();
      }
    }
  });
});

// Chrome 메시지 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TIME_UPDATE') {
    updateTimeDisplay(message.data.formattedTime);
    handleTimeUpdate(message.data.currentTime);
  }
});