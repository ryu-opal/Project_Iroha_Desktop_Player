// 這是 Tauri 的魔法橋樑，用來呼叫 Rust 和轉換檔案路徑！
import { invoke } from "@tauri-apps/api/core";
import { convertFileSrc } from "@tauri-apps/api/core"; 
import { getCurrentWebview } from "@tauri-apps/api/webview"; 
import { getCurrentWindow } from "@tauri-apps/api/window";

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
  // 把所有的內容先通通隱藏
  document.querySelectorAll('.widget-content').forEach(el => {
      el.classList.remove('active');
  });

  // 如果點擊的是原本就打開的，就關掉，否則打開新的
  if (currentOpenWidget === widgetName) {
      currentOpenWidget = null;
  } else {
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

  // === 🎵 音樂播放器魔法 ===
  const btnPlay = document.getElementById('btn-play') as HTMLButtonElement;
  const audioPlayer = document.getElementById('audio-player') as HTMLAudioElement;
  
  let isPlaying = false; // 這是用來記住現在有沒有在唱歌的記憶體喔！

  btnPlay?.addEventListener('click', () => {
    // 如果還沒有餵給它音樂，就先提醒一下！
    if (!audioPlayer.src || audioPlayer.src.includes(window.location.host)) {
      alert("主人～你還沒有給余放音樂檔案啦！( ´• ω •` )");
      return;
    }

    if (isPlaying) {
      audioPlayer.pause();
      btnPlay.textContent = '▶️'; // 暫停時變回播放圖示
      isPlaying = false;
    } else {
      audioPlayer.play();
      btnPlay.textContent = '⏸️'; // 播放時變成暫停圖示
      isPlaying = true;
    }
  }); 
  // === 📂 讀取音樂資料夾魔法 ===
  const btnLoadMusic = document.getElementById('btn-load-music');
  let playlist: string[] = []; // 余幫你準備一個空歌單，用來裝找到的音樂！
  let currentSongIndex = 0; // 記住現在播到第幾首

  btnLoadMusic?.addEventListener('click', async () => {
    // 為了先簡單測試，我們跳出一個框框讓主人輸入路徑～
    const folderPath = prompt("主人，請把你的音樂資料夾路徑貼給余！\n(例如 Windows 可能是 C:\\Users\\你的名字\\Music )");
    
    if (!folderPath) return; // 如果主人按取消，就不做事

    try {
      // 🌟 這裡就是見證奇蹟的時刻！呼叫我們在 Rust 寫的 get_audio_files！
      const files: string[] = await invoke("get_audio_files", { path: folderPath });
      
      if (files.length === 0) {
        alert("欸？裡面沒有 mp3 或 wav 檔耶... ( ´• ω •` )");
        return;
      }

      // 把找到的歌放進歌單！
      playlist = files;
      currentSongIndex = 0;
      alert(`太棒了！余幫你找到了 ${playlist.length} 首歌喔！(≧∇≦)/`);
      
      // 準備播第一首歌！
      playSong(currentSongIndex);

    } catch (error) {
      console.error(error);
      alert("嗚嗚，讀取失敗了... 主人是不是路徑打錯了呀？( ´•̥̥̥ω•̥̥̥` )");
    }
  });

  // === 🎶 播放指定歌曲的函數 ===
  function playSong(index: number) {
    if (playlist.length === 0) return;
    
    const filePath = playlist[index];
    
    // ⚠️ Tauri 的安全魔法：因為安全限制，瀏覽器不能直接讀 C 槽的檔案
    // 所以我們要把路徑轉成 Tauri 看得懂的專屬網址！
    const assetUrl = convertFileSrc(filePath);
    
    audioPlayer.src = assetUrl;
    audioPlayer.play();
    
    // 把按鈕變成暫停圖案
    btnPlay.textContent = '⏸️';
    isPlaying = true;
    
    // 把歌名顯示出來 (切掉前面的路徑，只留最後的檔名)
    const fileName = filePath.split('\\').pop()?.split('/').pop() || "未知的神秘歌曲";
    const titleDisplay = document.getElementById('song-title');
    if (titleDisplay) titleDisplay.textContent = fileName;
  }
  // === 📺 播放清單與拖曳魔法 (Tauri 專屬進階版！✨) ===
  const btnPlaylist = document.getElementById('btn-playlist');
  const contentPlaylist = document.getElementById('content-playlist');
  const playlistContainer = document.getElementById('playlist-container');
  const mediaPlayer = document.getElementById('main-media-player') as HTMLVideoElement;
  
  // 🌟 我們改用字串陣列來存檔案路徑喔！
  let myPlaylist: string[] = [];

  btnPlaylist?.addEventListener('click', () => {
    toggleWidget('playlist', contentPlaylist);
  });


  async function setupDragDrop() {
    const appWindow = getCurrentWindow();
    
    // 當有檔案拖進來時...
    appWindow.onDragDropEvent((event) => {
      if (event.payload.type === 'drop') {
        const paths = event.payload.paths; // 這是 Tauri 給我們的路徑清單！
        
        // 幫主人過濾一下，只要 mp4 檔！
        const mp4Files = paths.filter(p => p.toLowerCase().endsWith('.mp4'));
        
        if (mp4Files.length > 0) {
          myPlaylist.push(...mp4Files);
          updatePlaylistUI();
          toggleWidget('playlist', contentPlaylist); // 自動切換畫面
        }
      }
    });
  }
  
  // 記得要呼叫這個初始化魔法喔！
  setupDragDrop();

  function updatePlaylistUI() {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = ''; 

    myPlaylist.forEach((filePath) => {
      const fileName = filePath.split('\\').pop()?.split('/').pop() || "未知影片";
      const item = document.createElement('div');
      item.className = 'playlist-item';
      item.textContent = `🎬 ${fileName}`;
      
      item.onclick = () => playMedia(filePath);
      playlistContainer.appendChild(item);
    });
  } 

  async function playMedia(filePath: string) {
    try {
      // 🌟 直接從 Rust 讀取檔案內容並轉成 Blob
      const fileData: Uint8Array = await invoke("read_file_as_bytes", { path: filePath }); 

      const blob = new Blob([fileData], { type: 'video/mp4' });
      const fileUrl = URL.createObjectURL(blob);
      
      mediaPlayer.src = fileUrl;
      mediaPlayer.style.display = 'block'; 
      mediaPlayer.play();
      
      const titleDisplay = document.getElementById('song-title');
      if (titleDisplay) titleDisplay.textContent = filePath.split('\\').pop()?.split('/').pop() || "正在播放";
    } catch (e) {
      console.error("嗚嗚，讀不到檔案：", e);
    }
  }
}); 
