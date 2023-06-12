use std::path::*;
use std::process::Command;

#[tauri::command]
pub fn open_plugins() {
  let plugin_folder = tauri::api::path::home_dir()
    .unwrap()
    .join("dexcord")
    .join("plugins");

  open_folder(plugin_folder)
}

#[tauri::command]
pub fn open_themes() {
  let theme_folder = tauri::api::path::home_dir()
    .unwrap()
    .join("dorion")
    .join("themes");

  open_folder(theme_folder)
}

#[cfg(target_os = "windows")]
fn open_folder(path: PathBuf) {
  Command::new("explorer").arg(path).spawn().unwrap();
}


#[cfg(target_os = "windows")]
pub fn resource_folder() -> PathBuf {
  let mut path = std::env::current_exe().unwrap();
  path.pop();

  path
}
