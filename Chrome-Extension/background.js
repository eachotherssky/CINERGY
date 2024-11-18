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