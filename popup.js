document.getElementById('save').addEventListener('click', function() {
    chrome.windows.getAll({ populate: true }, function(windows) {
        const tabs = [];
        windows.forEach(window=>{
            window.tabs.forEach(tab=>{
                if (tab.url){
                    tabs.push({url:tab.url,title:tab.title});
                }
            });
        });
        chrome.storage.local.set({ savedTabs: tabs });
        alert(`已保存 ${tabs.length} 个页面！`);
    });
});

document.getElementById('recover').addEventListener('click', function() {
    chrome.storage.local.get(['savedTabs'],function(result){
        const savedTabs = result.savedTabs || [];
        if (savedTabs.length === 0) {
            return;
        }
        chrome.windows.getAll(function(windows) {
            windows.forEach(window => {
                chrome.windows.remove(window.id);
            });
        });
        const urls = savedTabs.map(tab => tab.url);
        chrome.windows.create({url:urls});
    });
});
