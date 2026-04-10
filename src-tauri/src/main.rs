// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // 這裡只需要呼叫 lib.rs 裡的 run() 就可以了！
    project_iroha_player_lib::run();
}