// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{WindowBuilder
};


mod helpers;
mod injection;
mod local_html;
mod release;

#[tauri::command]
fn do_injection(win: tauri::Window) {
  //let preload_plugins = plugin::load_plugins(Option::Some(true));

  // Execute preload scripts
   //for script in preload_plugins.values() {
  //  win.eval(script).unwrap_or(());
  //}

  // Gotta make sure the window location is where it needs to be
  std::thread::spawn(move || {
    std::thread::sleep(std::time::Duration::from_secs(2));

    injection::preinject(&win);
  });
}

fn main() {

    let mut url = String::new();

    url += "https://discord.com/app";

    let url_ext = tauri::WindowUrl::External(reqwest::Url::parse(&url).unwrap());

    tauri::Builder::default()
    
        .invoke_handler(tauri::generate_handler![
            do_injection,
            injection::is_injected,
            local_html::get_index,
            local_html::get_settings,
            local_html::get_top_bar,
            local_html::get_notif,
            helpers::open_plugins,
            helpers::open_themes,
            release::get_latest_release
            ])
        .setup(move |app| {
            let title = format!("Dexcord - v{}", app.package_info().version);
            let win = WindowBuilder::new(app, "main", url_ext)
                .title(title.as_str())
                .resizable(true)
                .build()?;

            do_injection(win);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
