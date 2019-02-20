let tab_list = new TabList();
tab_list.refresh();

function update_new_tabs()
{
    chrome.tabs.query({}, tab_list.update.bind(tab_list));
    console.log("update tab");
}

function start_up()
{
    tab_list.refresh();
    console.log("chrome 启动");
}

function open_popup()
{
    chrome.tabs.create({"url": "./popup.html", "selected":true});
}


// 标签的更新
chrome.tabs.onCreated.addListener(update_new_tabs);
chrome.tabs.onUpdated.addListener(update_new_tabs);
chrome.tabs.onMoved.addListener(update_new_tabs);
chrome.tabs.onRemoved.addListener(update_new_tabs);
// 启动浏览器
chrome.runtime.onStartup.addListener(start_up)
chrome.runtime.onStartup.addListener(open_popup)