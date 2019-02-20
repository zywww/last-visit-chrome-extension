const LogError = console.error;
const LogInfo = console.info;


class Tab
{
    /*private*/ change_time:number = 0;
    /*private*/ url:string = "";
    /*private*/ title:string = "";
    /*private*/ del:boolean = false;

    constructor(time?:number, url?:string, title?:string, del?:boolean)
    {
        this.change_time = time;
        this.url = url;
        this.title = title;
        this.del = del;
    }
    

    getUrl():string
    {
        return this.url;
    }

    getTitle():string
    {
        return this.title;
    }

    // setDel(val:boolean)
    // {
    //     this.del = val;
    // }
    getDel():boolean
    {
        return this.del;
    }


    
    serialize():string
    {
        let delimiter = "%%";
        let str = this.change_time + delimiter 
            + this.url + delimiter 
            + this.title + delimiter
            + (this.del?"1":"0");
        return str;
    }
    deserialize(data:string)
    {
        let arr = data.split("%%")
        this.change_time = parseInt(arr[0]);
        this.url = arr[1];
        this.title = arr[2];
        this.del = parseInt(arr[3]) != 0;
        // console.log("del parseInt(arr[3]):%d", parseInt(arr[3]));
    }
}

class TabList
{
    list:Array<Tab> = [];
    last_len:number = 0; // 上次未关闭页面的数量
    now_len:number = 0; // 当前未关闭页面的数量（包含上次）


    // 重启浏览器时调用
    public refresh()
    {
        this.deserialize();
        let new_list:Array<Tab> = [];
        for (let i = 0; i < this.now_len; ++i)
        {
            const tab = this.list[i];
            if (!tab.del)
                new_list.push(tab);
        }
        this.list = new_list;
        this.last_len = this.now_len = new_list.length;
        this.save();
    }

    // 删除上次未关闭标签
    public remItem(idx:number):boolean
    {
        // this.deserialize();
        if (idx >= this.last_len || idx < 0)
            return false;
        this.list[idx].del = true;
        this.save();
        return true;
    }

    // 恢复已删除的上次未关闭标签
    public recoverItem(idx:number):boolean
    {
        // this.deserialize();
        if (idx >= this.last_len || idx < 0)
            return false;
        this.list[idx].del = false;
        this.save();
    }

    // 实时更新已打开标签
    public update(browser_tabs:Array<any>)
    {
        this.deserialize();
        this.clearNewTab();
        for (let tab of browser_tabs)
        {
            let re = /^chrome/;
            if (re.test(tab.url))
                continue;
            let new_tab = new Tab(new Date().getTime(), tab.url, tab.title, false);
            this.list[this.now_len++] = new_tab;
        }
        this.save();
    }

    public getTabList()
    {
        this.deserialize();
        return this.list;
    }

    public getTab(idx:number)
    {
        return this.list[idx];
    }

    public deserialize()
    {
        // 从 localStorage load出来
        this.last_len = parseInt(localStorage["last_len"]) || 0;
        this.now_len = parseInt(localStorage["now_len"]) || 0;
        this.list = [];
        for (let i = 0; i < this.now_len; ++i)
        {
            let tab = new Tab();
            tab.deserialize(localStorage[i]);
            this.list.push(tab);
        }
    }



    private save()
    {
        // 将所有数据保存到 localStorage
        for (let i = 0; i < this.now_len; ++i)
        {
            localStorage[i] = this.list[i].serialize();
        }
        localStorage["last_len"] = this.last_len;
        localStorage["now_len"] = this.now_len;
    }

    private clearNewTab()
    {
        this.now_len = this.last_len;
    }
}