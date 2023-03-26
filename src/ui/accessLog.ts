import { Server } from "../SERVER";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

const CSS = {
    cell : ["data-small-centered", "data-content-bordered"],
    smHead : "header-small"
}

export class CafeAccessLog extends UIInput<Server.AdminAccessLog> {
    id: HTMLTableCellElement;
    atTime: HTMLTableCellElement;
    ip: HTMLTableCellElement;
    url: HTMLTableCellElement;
    userId: HTMLTableCellElement;
    username: HTMLTableCellElement;
    constructor(data: Server.AdminAccessLog) {
        super(data, "tr")
        this.blocker.remove()

        let date = new Date(data.AtTime)
        let date_formatted = date.toLocaleDateString() + " " + date.toLocaleTimeString()

        this.id = Dom.textEl("td", data.LogId.toString(), CSS.cell)
        this.atTime = Dom.textEl("td", date_formatted, CSS.cell)
        this.ip = Dom.textEl("td", data.Ip, CSS.cell)
        this.url = Dom.textEl("td", data.Url, CSS.cell)
        this.userId = Dom.textEl("td", data.UserId.toString(), CSS.cell)
        this.username = Dom.textEl("td", data.Username, CSS.cell)

        this.el.append(this.id, this.atTime, this.ip, this.url, this.userId, this.username)

    }

    static gGetHeaderRow() {
        let tr = Dom.el("tr")
        let id = Dom.textEl("th", "LogID")
        let tm = Dom.textEl("th", "Time")
        let ip = Dom.textEl("th", "IP")
        let url = Dom.textEl("th", "URL")
        let uid = Dom.textEl("th", "UserID", CSS.smHead)
        let un = Dom.textEl("th", "Username", CSS.smHead)
        tr.append(id, tm, ip, url, uid, un)
        return tr


    }
}