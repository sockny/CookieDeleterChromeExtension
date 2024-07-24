chrome.runtime.onInstalled.addListener(() => {
    // Csak a .gov.hu domainekhez adunk hozzá menüpontot
    chrome.contextMenus.create({
        id: "deleteSiteData",
        title: "Delete Cookies and Site Data",
        contexts: ["all"],
        documentUrlPatterns: ["*://*.gov.hu/*"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "deleteSiteData") {
        if (tab.url) {
            const url = new URL(tab.url);
            const origin = url.origin;

            // Törli az aktuális oldalhoz tartozó összes adatot
            chrome.browsingData.remove({
                origins: [origin]
            }, {
                cookies: true,
                localStorage: true,
                cache: true,
                fileSystems: true,
                indexedDB: true,
                webSQL: true,
                serviceWorkers: true
            }, () => {
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "icon.png",
                    title: "Cookie and Site Data Deleter",
                    message: `Cookies and site data deleted for ${origin}`
                }, function(notificationId) {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    } else {
                        console.log("Notification created with ID:", notificationId);
                        // Átirányít a kívánt oldalra
                        chrome.tabs.update(tab.id, { url: "https://ugyfelkapu.gov.hu/" });
                    }
                });
            });
        }
    }
});
