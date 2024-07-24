chrome.runtime.onInstalled.addListener(() => {
    // Csak a .gov.hu domainekhez adunk hozzá menüpontot
    chrome.contextMenus.create({
        id: "deleteSiteData",
        title: "Sütik és webhely adatok törlése",
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
                    title: "Süti és webhely adat törlő", //Cookie and Site Data Deleter
                    message: `Sütik és webhely adatok törölve a következőhöz: ${origin}` //Cookies and site data deleted for 
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
