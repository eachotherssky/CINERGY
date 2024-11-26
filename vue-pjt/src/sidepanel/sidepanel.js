// 전역 변수 선언
let currentVideoTime = 0;
let comments = [];
let lastDisplayedCommentTime = 0;
let isSubmitDisabled = false;
let isAuthenticated = false;
let currentUser = null;
let currentNetflixInfo = null;

// 디버깅 패널 정의를 최상단으로 이동
const debugPanel = document.createElement('div');
debugPanel.className = 'debug-panel';
debugPanel.style.cssText = `
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #202124;
  padding: 10px;
  border-top: 1px solid #3c4043;
`;

async function checkAuthStatus() {
  try {
    // counter 객체에서 토큰 확인
    const counterData = localStorage.getItem('counter');
    let counterToken = null;
    
    if (counterData) {
      try {
        const parsed = JSON.parse(counterData);
        counterToken = parsed.token;
      } catch (error) {
        console.error('Counter parsing failed:', error);
      }
    }

    // Extension storage 확인
    const storage = await chrome.storage.local.get(['auth_token']);
    
    // counter의 토큰이 있고 Extension storage에 없는 경우
    if (counterToken && !storage.auth_token) {
      await chrome.storage.local.set({
        'auth_token': counterToken,
        'timestamp': Date.now()
      });
      isAuthenticated = true;
    } else {
      isAuthenticated = !!storage.auth_token;
    }

    updateDebugInfo();
    updateChatUIState();
    return isAuthenticated;
  } catch (error) {
    console.error('Auth check failed:', error);
    isAuthenticated = false;
    updateDebugInfo();
    updateChatUIState();
    return false;
  }
}

function updateDebugInfo() {
  chrome.storage.local.get(['auth_token', 'timestamp'], (result) => {
    debugPanel.innerHTML = `
      <div style="color: #9aa0a6">
        <div>Token Status: ${result.auth_token ? 'Present' : 'Missing'}</div>
        ${result.timestamp ? 
          `<div>Last Updated: ${new Date(result.timestamp).toLocaleString()}</div>` 
          : ''}
      </div>
    `;
  });
}

// 상수 정의
const badWords = [
  '씨발', '시발', 'ㅆㅂ', 'ㅅㅂ', '병신', 'ㅄ', 'ㅂㅅ',
  '지랄', '새끼', '개새끼', '미친', '씨팔', '존나', '좆', 
  '니미', '엿먹어', '뒤져', '죽어'
];

const MAX_COMMENT_LENGTH = 300;

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === 'TIME_UPDATE') {
//     updateTimeDisplay(message.data.formattedTime);
//     handleTimeUpdate(message.data.currentTime);
//     // Netflix 정보 업데이트
//     if (message.data.netflixInfo) {
//       currentNetflixInfo = message.data.netflixInfo;
//       console.log('Netflix Info Updated:', currentNetflixInfo);
//     }
//   } else if (message.type === 'AUTH_STATUS_CHANGED') {
//     isAuthenticated = message.isAuthenticated;
//     updateDebugInfo();
//     updateChatUIState();
//   }
// });

// Netflix ID 변경 감지 리스너 추가
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TIME_UPDATE') {
      updateTimeDisplay(message.data.formattedTime);
      handleTimeUpdate(message.data.currentTime);
      
      // Netflix 정보 업데이트 및 채팅 로드
      if (message.data.netflixInfo?.netflix_id) {
          currentNetflixInfo = message.data.netflixInfo;
          loadChats(currentNetflixInfo.netflix_id);
      }
  } else if (message.type === 'NETFLIX_ID_CHANGED') {
      loadChats(message.netflix_id);
  }
});

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
// function displayNewComments() {
//   if (!currentNetflixInfo) return;
  
//   const container = document.getElementById('comments-container');
//   const timeNotice = container.querySelector('.time-notice');
  
//   // 시간 이동 알림이 있으면 유지
//   if (timeNotice) {
//       container.innerHTML = '';
//       container.appendChild(timeNotice);
//   }
  
//   // 현재 시간까지의 모든 채팅을 표시
//   const visibleComments = comments
//       .filter(comment => 
//           comment.netflix_id === currentNetflixInfo.netflix_id &&
//           comment.timestamp <= currentVideoTime
//       )
//       .sort((a, b) => a.timestamp - b.timestamp);

//   // 이미 표시된 채팅은 다시 표시하지 않음
//   visibleComments.forEach(comment => {
//       if (!document.querySelector(`[data-timestamp="${comment.timestamp}"]`)) {
//           const commentElement = document.createElement('div');
//           commentElement.className = 'comment-item';
//           commentElement.dataset.timestamp = comment.timestamp;
          
//           const usernameElement = document.createElement('div');
//           usernameElement.className = 'comment-username';
//           usernameElement.textContent = comment.username;
          
//           const timeElement = document.createElement('div');
//           timeElement.className = 'comment-time';
//           timeElement.textContent = formatTime(comment.timestamp);
          
//           const textElement = document.createElement('div');
//           textElement.className = 'comment-text';
//           textElement.textContent = comment.text;
          
//           commentElement.appendChild(usernameElement);
//           commentElement.appendChild(timeElement);
//           commentElement.appendChild(textElement);
//           container.appendChild(commentElement);
//       }
//   });

//   container.scrollTop = container.scrollHeight;
// }

function displayNewComments() {
  const newComments = comments
      .filter(comment => 
          comment.timestamp > lastDisplayedCommentTime && 
          comment.timestamp <= currentVideoTime + 1
      )
      .sort((a, b) => a.timestamp - b.timestamp);

  if (newComments.length > 0) {
      newComments.forEach(comment => {
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
          
          const container = document.getElementById('comments-container');
          container.appendChild(commentElement);
      });
      
      lastDisplayedCommentTime = Math.max(...newComments.map(c => c.timestamp));
      const container = document.getElementById('comments-container');
      container.scrollTop = container.scrollHeight;
  }
}

// 시간 관련 함수
// function handleTimeUpdate(newTime) {
//   const previousTime = currentVideoTime;
//   currentVideoTime = newTime;
  
//   if (Math.abs(newTime - previousTime) > 1) {
//       // 시간 이동이 발생한 경우
//       const container = document.getElementById('comments-container');
//       container.innerHTML = '';
      
//       const timeNotice = document.createElement('div');
//       timeNotice.className = 'time-notice';
//       timeNotice.textContent = `${formatTime(newTime)} 이후의 채팅입니다.`;
//       container.appendChild(timeNotice);
      
//       // lastDisplayedCommentTime 초기화하지 않음
//       displayNewComments();
//   } else {
//       // 일반적인 재생 중
//       displayNewComments();
//   }
// }

function handleTimeUpdate(newTime) {
  const previousTime = currentVideoTime;
  currentVideoTime = newTime;
  
  if (Math.abs(newTime - previousTime) > 1) {
      // 시간 이동이 발생한 경우
      const container = document.getElementById('comments-container');
      container.innerHTML = '';
      
      const timeNotice = document.createElement('div');
      timeNotice.className = 'time-notice';
      timeNotice.textContent = `${formatTime(newTime)} 이후의 채팅입니다.`;
      container.appendChild(timeNotice);
      
      lastDisplayedCommentTime = newTime - 1;
      displayNewComments();
  } else {
      // 일반적인 재생 중
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
// function handleSubmit() {
//   if (!isAuthenticated || isSubmitDisabled) {
//     return;
//   }
  
//   const commentInput = document.getElementById('comment-text');
//   const commentText = commentInput.value;
//   const charCounter = document.querySelector('.char-counter');
  
//   if (commentText.trim() && commentText.length <= MAX_COMMENT_LENGTH) {
//     const comment = createComment(commentText);
//     comments.push(comment);
//     comments.sort((a, b) => a.timestamp - b.timestamp);
//     commentInput.value = '';
//     updateCharCounter(commentInput, charCounter);
//   }
// }

async function handleSubmit() {
  if (!isAuthenticated || isSubmitDisabled) return;
  
  const commentInput = document.getElementById('comment-text');
  const commentText = commentInput.value;
  const charCounter = document.querySelector('.char-counter');
  
  if (commentText.trim() && commentText.length <= MAX_COMMENT_LENGTH) {
    // 기존 로컬 채팅 생성
    const comment = createComment(commentText);
    
    // DB 저장 시도
    const savedChat = await saveChat(commentText);
    if (savedChat) {
      comments.push(comment);  // 로컬 채팅 추가
      comments.sort((a, b) => a.timestamp - b.timestamp);
      commentInput.value = '';
      updateCharCounter(commentInput, charCounter);
      displayNewComments();  // 화면에 표시
    }
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
document.addEventListener('DOMContentLoaded', async () => {
  document.body.appendChild(debugPanel);
  await checkAuthStatus();
  updateDebugInfo();
  setupTokenMonitoring();

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

  // pending 채팅 로드
  const storage = await chrome.storage.local.get(['pending_chats']);
  if (storage.pending_chats) {
      comments.push(...storage.pending_chats);
      comments.sort((a, b) => a.timestamp - b.timestamp);
      displayNewComments();
  }
});

// Chrome 메시지 리스너 통합
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TIME_UPDATE') {
    updateTimeDisplay(message.data.formattedTime);
    handleTimeUpdate(message.data.currentTime);
  } else if (message.type === 'AUTH_STATUS_CHANGED') {
    isAuthenticated = message.isAuthenticated;
    updateDebugInfo();
    updateChatUIState();  // UI 상태 업데이트 추가
  }
});

function setupTokenMonitoring() {
  // localStorage의 counter 객체 변경 감지
  window.addEventListener('storage', async (e) => {
    if (e.key === 'counter') {
      try {
        const counterData = JSON.parse(e.newValue);
        if (counterData?.token) {
          await chrome.storage.local.set({
            'auth_token': counterData.token,
            'timestamp': Date.now()
          });
          checkAuthStatus();
        }
      } catch (error) {
        console.error('Token sync failed:', error);
      }
    }
  });

  // 주기적 토큰 확인
  setInterval(async () => {
    await checkAuthStatus();
  }, 5000);
}

// 로그인 관련 채팅 UI 상태 관리 함수
function updateChatUIState() {
  const commentInput = document.getElementById('comment-text');
  const submitButton = document.getElementById('submit-comment');
  const charCounter = document.querySelector('.char-counter');
  
  if (!isAuthenticated) {
    commentInput.disabled = true;
    submitButton.disabled = true;
    commentInput.placeholder = '로그인이 필요한 서비스입니다';
    charCounter.style.display = 'none';
  } else {
    commentInput.disabled = false;
    submitButton.disabled = false;
    commentInput.placeholder = '채팅을 입력하세요';
    charCounter.style.display = 'block';
  }
}

// 채팅 저장 함수
async function saveChat(text) {
  if (!isAuthenticated || !currentNetflixInfo?.netflix_id) {
      console.error('Missing auth or Netflix info');
      return null;
  }

  try {
      const storage = await chrome.storage.local.get(['auth_token']);
      // title이 반드시 포함되도록 수정
      const chatData = {
          content: text,
          video_time: currentVideoTime,
          netflix_id: currentNetflixInfo.netflix_id,
          title: currentNetflixInfo.title || document.title.replace(' | Netflix', '').trim()
      };

      console.log('Sending chat data:', chatData); // 디버깅용

      const response = await fetch('http://127.0.0.1:8000/community/api/chats/create/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${storage.auth_token}`
          },
          body: JSON.stringify(chatData)
      });

      if (!response.ok) {
          throw new Error('Failed to save chat');
      }
      
      return await response.json();
  } catch (error) {
      console.error('Chat save failed:', error);
      // 실패한 요청 저장
      const pendingChat = {
          ...chatData,
          created_at: new Date().toISOString(),
          pending: true
      };
      
      const storage = await chrome.storage.local.get(['pending_chats']);
      const pendingChats = storage.pending_chats || [];
      pendingChats.push(pendingChat);
      await chrome.storage.local.set({ pending_chats: pendingChats });
      
      return pendingChat;
  }
}

// 주기적 동기화 실행 (5초마다)
setInterval(syncPendingChats, 5000);

// 채팅 불러오기 함수
// async function loadChats(netflixId) {
//   if (!netflixId) return;
  
//   try {
//       const storage = await chrome.storage.local.get(['auth_token']);
//       const response = await fetch(`http://127.0.0.1:8000/community/api/chats/${netflixId}/`, {
//           headers: {
//               'Authorization': `Token ${storage.auth_token}`
//           }
//       });

//       if (!response.ok) throw new Error('Failed to load chats');
      
//       const chats = await response.json();
//       // 데이터 구조 맞추기
//       comments = chats.map(chat => ({
//           text: chat.content,          // content를 text로 변환
//           timestamp: chat.video_time,  // video_time을 timestamp로 변환
//           username: chat.username,
//           created: chat.created_at
//       }));
      
//       // 시간순 정렬
//       comments.sort((a, b) => a.timestamp - b.timestamp);
      
//       // 현재 시간 기준으로 이전 채팅만 표시되도록 설정
//       lastDisplayedCommentTime = 0;  // 시간 초기화
//       displayNewComments();          // 현재 시간 기준으로 채팅 표시
      
//   } catch (error) {
//       console.error('Chat load failed:', error);
//   }
// }
async function loadChats(netflixId) {
  if (!netflixId) return;
  
  try {
      const storage = await chrome.storage.local.get(['auth_token']);
      const response = await fetch(`http://127.0.0.1:8000/community/api/chats/${netflixId}/`, {
          headers: {
              'Authorization': `Token ${storage.auth_token}`
          }
      });

      if (!response.ok) throw new Error('Failed to load chats');
      
      const chats = await response.json();
      // DB에서 받아온 채팅을 크롬 로컬 스토리지에 저장
      await chrome.storage.local.set({
          'saved_chats': chats.map(chat => ({
              text: chat.content,
              timestamp: parseFloat(chat.video_time),
              username: chat.username
          }))
      });

      // comments 배열 업데이트
      const storage_chats = await chrome.storage.local.get(['saved_chats']);
      comments = storage_chats.saved_chats || [];
      comments.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
      console.error('Chat load failed:', error);
  }
}