window.addEventListener("DOMContentLoaded", () => {
  // 抓出左邊的按鈕
  const btnClock = document.getElementById('btn-clock');
  const btnCalendar = document.getElementById('btn-calendar');
  
  // 抓出右邊的內容
  const contentClock = document.getElementById('content-clock');
  const contentCalendar = document.getElementById('content-calendar');

  // 用來記住現在打開的是哪一個小工具！(一開始是 null 表示什麼都沒開)
  let currentOpenWidget: string | null = null;

  // 這是負責切換開關的魔法函數！
  function toggleWidget(widgetName: string, contentElement: HTMLElement | null) {
    // 第一步：先把所有東西都關掉 (隱藏)
    contentClock?.classList.remove('active');
    contentCalendar?.classList.remove('active');

    // 第二步：判斷你要做什麼？
    if (currentOpenWidget === widgetName) {
      // 如果點擊的是「現在已經打開的」，那就把它關掉就好，變回空空的！
      currentOpenWidget = null;
    } else {
      // 如果點擊的是別的，或者本來什麼都沒開，那就把它打開！
      contentElement?.classList.add('active');
      currentOpenWidget = widgetName;
    }
  }

  // 綁定點擊事件
  btnClock?.addEventListener('click', () => {
    toggleWidget('clock', contentClock);
  });

  btnCalendar?.addEventListener('click', () => {
    toggleWidget('calendar', contentCalendar);
  });


  // === 下面是時鐘滴答滴答的魔法，跟之前一樣喔！ ===
  const timeDisplay = document.getElementById('time-display');
  const dateDisplay = document.getElementById('date-display');

  function updateClock() {
    const now = new Date();
    if (timeDisplay) timeDisplay.textContent = now.toLocaleTimeString('zh-TW', { hour12: false });
    if (dateDisplay) {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
      dateDisplay.textContent = now.toLocaleDateString('zh-TW', options);
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
});