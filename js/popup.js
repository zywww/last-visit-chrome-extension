let tab_list = new TabList();
tab_list.deserialize();
function showTab(tab) {
    var url = tab.getUrl();
    chrome.tabs.create({ "url": url, "selected": false });
}
function createLink(idx) {
    let tab = tab_list.getTabList()[idx];
    let link = document.createElement('a');
    link.href = tab.getUrl();
    link.title = tab.getUrl();
    link.setAttribute("idx", idx.toString());
    if (tab.getDel())
        link.setAttribute("style", "opacity:0.5;");
    let html = "<img src=\"chrome://favicon/" + tab.getUrl() + "\" alt=\"" + tab.getUrl() + "\" width=16 height=16>";
    if (tab.getDel())
        html += "<div style=\"text-decoration:line-through\">" + tab.getTitle() + "</div>";
    else
        html += "<div >" + tab.getTitle() + "</div>";
    html += "<span class='del del-small'>x</span>";
    link.innerHTML = html;
    link.onclick = function (e) {
        if (e.target.classList.contains('del')) {
            var parent = e.target.parentNode;
            let tab = tab_list.getTabList()[idx];
            if (tab.getDel()) {
                tab_list.recoverItem(idx);
                parent.setAttribute("style", "opacity:1;");
                let title = link.getElementsByTagName("div");
                title[0].setAttribute("style", "text-decoration:none");
            }
            else {
                tab_list.remItem(idx);
                parent.setAttribute("style", "opacity:0.5;");
                let title = link.getElementsByTagName("div");
                title[0].setAttribute("style", "text-decoration:line-through");
            }
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            e.preventDefault();
            showTab(tab);
            var parent = e.target.parentNode;
            tab_list.remItem(idx);
            parent.setAttribute("style", "opacity:0.5;");
            let title = link.getElementsByTagName("div");
            title[0].setAttribute("style", "text-decoration:line-through");
        }
    };
    return link;
}
let content = document.getElementById("content");
let tabs = tab_list.getTabList();
for (let i = tab_list.last_len - 1; i >= 0; --i) {
    let link = createLink(i);
    content.appendChild(link);
}
let btn_open = document.getElementById("open_all");
btn_open.onclick = function (e) {
    let tabs = tab_list.getTabList();
    for (let i = 0; i < tab_list.last_len; ++i) {
        showTab(tabs[i]);
    }
};
