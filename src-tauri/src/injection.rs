use std::{env, fs};

use crate::{helpers::resource_folder};

#[tauri::command]
pub fn is_injected() {
  env::set_var("TAURI_INJECTED", "1");
}

pub fn preinject(window: &tauri::Window) {
    let injection_js = match fs::read_to_string(resource_folder().join("./src/injection/injection.js"))
    {
        Ok(f) => f,
        Err(e) => {
        println!("Failed to read preinject JS in local dir: {}", e);
            return;
        }
    };

    window.eval(injection_js.as_str()).unwrap_or(())
}