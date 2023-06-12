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

    alert('d')
    console.log('a')
    settingInserter()
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
    const settingsHTML = "JOe"

    settingsRegion.innerHTML = settingsHTML
}