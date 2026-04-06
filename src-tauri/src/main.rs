// 這是原本就有的設定，用來隱藏 Windows 背景的黑框框，不要刪掉喔！
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// ==========================================
// 1. 這是我們剛剛寫的「找音樂魔法」！
// 加上 #[tauri::command] 就是告訴 Tauri，這是一個可以讓前端 (TypeScript) 呼叫的魔法！
// ==========================================
#[tauri::command]
fn get_audio_files(path: String) -> Vec<String> {
    let mut files = Vec::new();
    
    // 用 Rust 的功能去打開你指定的資料夾
    if let Ok(entries) = std::fs::read_dir(path) {
        for entry in entries.flatten() {
            let file_path = entry.path();
            if file_path.is_file() {
                // 檢查副檔名是不是 mp3 或 wav
                if let Some(ext) = file_path.extension() {
                    if ext == "mp3" || ext == "wav" {
                        if let Some(path_str) = file_path.to_str() {
                            files.push(path_str.to_string()); // 找到了就放進清單裡！
                        }
                    }
                }
            }
        }
    }
    files // 把找出來的音樂清單還給前端
}

// ==========================================
// 2. 這是程式的「大門」，每次啟動都會從這裡開始！
// ==========================================
fn main() {
    tauri::Builder::default()
        // 🌟 這裡最重要！要把我們上面的 get_audio_files 名字寫進去，
        // 這樣前端才認識這個魔法喔！
        .invoke_handler(tauri::generate_handler![get_audio_files])
        .run(tauri::generate_context!())
        .expect("糟糕！Tauri 啟動失敗了！");
} 
