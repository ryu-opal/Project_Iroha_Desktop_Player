// 我們的 Widget 核心互動邏輯
window.addEventListener("DOMContentLoaded", () => {
  const bottomLeft = document.getElementById("bottom-left");
  const rightSide = document.getElementById("right-side");

  bottomLeft?.addEventListener("click", () => {
    if (rightSide) {
      // 這裡就是你點擊後，右側會發生的魔法！
      rightSide.innerHTML = `
        <div style="padding: 20px;">
          <h2>這是擴展後的內容</h2>
          <p>我們可以在這裡放時鐘、日曆，或是你的播放列表喔！</p>
        </div>
      `;
    }
  });
}); 
