// src-tauri/src/lib.rs

// 1. 所有的魔法函數都在這裡
#[tauri::command]
fn get_audio_files(path: String) -> Vec<String> {
    let mut files = Vec::new();
    if let Ok(entries) = std::fs::read_dir(path) {
        for entry in entries.flatten() {
            let file_path = entry.path();
            if file_path.is_file() {
                if let Some(ext) = file_path.extension() {
                    if ext == "mp3" || ext == "wav" {
                        if let Some(path_str) = file_path.to_str() {
                            files.push(path_str.to_string());
                        }
                    }
                }
            }
        }
    }
    files
}

#[tauri::command]
fn read_file_as_bytes(path: String) -> Vec<u8> {
    std::fs::read(path).unwrap_or_default()
}

// 2. 這是整個 App 的唯一啟動入口
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![get_audio_files, read_file_as_bytes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}