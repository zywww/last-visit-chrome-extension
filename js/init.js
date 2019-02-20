const LogError = console.error;
const LogInfo = console.info;
class Tab {
    constructor(time, url, title, del) {
        this.change_time = 0;
        this.url = "";
        this.title = "";
        this.del = false;
        this.change_time = time;
        this.url = url;
        this.title = title;
        this.del = del;
    }
    getUrl() {
        return this.url;
    }
    getTitle() {
        return this.title;
    }
    getDel() {
        return this.del;
    }
    serialize() {
        let delimiter = "%%";
        let str = this.change_time + delimiter
            + this.url + delimiter
            + this.title + delimiter
            + (this.del ? "1" : "0");
        return str;
    }
    deserialize(data) {
        let arr = data.split("%%");
        this.change_time = parseInt(arr[0]);
        this.url = arr[1];
        this.title = arr[2];
        this.del = parseInt(arr[3]) != 0;
    }
}
class TabList {
    constructor() {
        this.list = [];
        this.last_len = 0;
        this.now_len = 0;
    }
    refresh() {
        this.deserialize();
        let new_list = [];
        for (let i = 0; i < this.now_len; ++i) {
            const tab = this.list[i];
            if (!tab.del)
                new_list.push(tab);
        }
        this.list = new_list;
        this.last_len = this.now_len = new_list.length;
        this.save();
    }
    remItem(idx) {
        if (idx >= this.last_len || idx < 0)
            return false;
        this.list[idx].del = true;
        this.save();
        return true;
    }
    recoverItem(idx) {
        if (idx >= this.last_len || idx < 0)
            return false;
        this.list[idx].del = false;
        this.save();
    }
    update(browser_tabs) {
        this.deserialize();
        this.clearNewTab();
        for (let tab of browser_tabs) {
            let re = /^chrome/;
            if (re.test(tab.url))
                continue;
            let new_tab = new Tab(new Date().getTime(), tab.url, tab.title, false);
            this.list[this.now_len++] = new_tab;
        }
        this.save();
    }
    getTabList() {
        this.deserialize();
        return this.list;
    }
    getTab(idx) {
        return this.list[idx];
    }
    deserialize() {
        this.last_len = parseInt(localStorage["last_len"]) || 0;
        this.now_len = parseInt(localStorage["now_len"]) || 0;
        this.list = [];
        for (let i = 0; i < this.now_len; ++i) {
            let tab = new Tab();
            tab.deserialize(localStorage[i]);
            this.list.push(tab);
        }
    }
    save() {
        for (let i = 0; i < this.now_len; ++i) {
            localStorage[i] = this.list[i].serialize();
        }
        localStorage["last_len"] = this.last_len;
        localStorage["now_len"] = this.now_len;
    }
    clearNewTab() {
        this.now_len = this.last_len;
    }
}
