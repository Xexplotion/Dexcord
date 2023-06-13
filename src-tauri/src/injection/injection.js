window.__TAURI__.invoke('is_injected')

window.dexcord = true

let loaded = false

/**
 * Observer that lets us know when Discord is loaded
 */
let observer = new MutationObserver(() => {
    const innerApp = document?.querySelector('div[class*="app"]')?.querySelector('div[class*="app"]')
    const loading = Array.from(
        innerApp?.children || []
    ).length === 2

    if (loading && !loaded) {
        console.log('Discord is loaded!')

        onClientLoad()

        // The comments ahead are read by tauri and used to insert plugin/theme injection code

        /* __THEMES__ */
    } else {
        console.log('Discord not loaded...')
    }
});

observer.observe(document, {
    childList: true,
    subtree: true
});

function onClientLoad() {
    loaded = true
    observer.disconnect()

    settingInserter()

    console.log("Checking for updates...")
    checkForUpdates()

}

function settingInserter() {
    let insertedSetting = false

    observer = new MutationObserver(() => {
        // Shove a new option in settings when it's open to go back to Dexcord settings
        const appSettings = document.querySelectorAll('nav[class*="sidebar-"] div[class*="header"]')[4]

        if (appSettings && !insertedSetting) {
            // Yoink the next tabs styling
            const classes = appSettings.nextSibling.classList
            const dexcordTab = document.createElement('div')

            dexcordTab.innerHTML = 'Dexcord Settings'
            dexcordTab.onclick = showSettings
            dexcordTab.classList = classes

            // There needs to be a small delay for some reason, or else the client just freezes up
            setTimeout(() => {
                appSettings.parentNode.insertBefore(dexcordTab, appSettings.nextSibling)
            }, 100)

            insertedSetting = true
        } else if (!appSettings) {
            insertedSetting = false;
        }
    })

    observer.observe(document.querySelector('div[class*="app"]'), {
        childList: true,
        subtree: true
    });
}

async function showSettings() {
    const { invoke } = window.__TAURI__
    const settingsRegion = document.querySelector('div[class*=contentRegion] div[class*=contentColumn] div')
    const settingsHTML = await invoke('get_settings')

    settingsRegion.innerHTML = settingsHTML


    initOnclickHandlers()
}

function initOnclickHandlers() {
    const { invoke } = window.__TAURI__
    const openPlugins = document.querySelector('#openPlugins')
    const openThemes = document.querySelector('#openThemes')
    const finishBtn = document.querySelector('#finishBtn')

    if (openPlugins) {
        openPlugins.addEventListener('click', () => {
            invoke('open_plugins')
        })
    }

    if (openThemes) {
        openThemes.addEventListener('click', () => {
            invoke('open_themes')
        })
    }

    if (finishBtn) {
        finishBtn.addEventListener('click', () => {
            window.__TAURI__.process.relaunch()
        })
    }
}

/**
 * Show notification
 */
async function showNotification(title, body) {
    const { invoke } = window.__TAURI__
    const notifHtml = await invoke('get_notif')
    const notif = document.createElement('div')
    notif.innerHTML = notifHtml

    const inner = notif.querySelector('#dexcord_notif')

    inner.style.top = '-100%'
    inner.style.transition = 'all 0.5s ease-in-out'

    inner.querySelector('#notif_title').innerHTML = title
    inner.querySelector('#notif_body').innerHTML = body

    const inst = document.body.appendChild(notif)

    // Move into view
    setTimeout(() => {
        inner.style.top = '5%'
    }, 100)

    // After 4 seconds, move out of view and remove
    setTimeout(() => {
        inner.style.top = '-100%'
        setTimeout(() => {
            inst.remove()
        }, 500)
    }, 4000)
}


/**
 * Check for updates
 */
async function checkForUpdates() {
    const { invoke, app } = window.__TAURI__
    const version = await app.getVersion()
    const latest = await invoke('get_latest_release')

    // remove letters from latest release
    const latestNum = latest.tag_name.replace(/[a-z]/gi, '').trim()

    if (version !== latestNum) {
        showNotification('Update Available', `<a href="${latest.link}">Dexcord v${latestNum}</a> is now available! You are currently running Dexcord v${version}`)
    }
}