import { Client } from "../communication/CLIENT";
import { Server } from "../communication/SERVER";
import { CafeAccessLog } from "../ui/accessLog";
import { DatetimeNowString, DatetimeTodayStartString } from "../util/date";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";

const CSS = {
    sectionLabel: ["section-label", "section-label-as-button"],
    inputLabel : "section-input-label-medium",
}

/** 
 For displaying access log records to admins, in the admin panel. 
*/
export class AccessLogSection extends CafeSection {
    dropDownContainer: any;
    from: HTMLInputElement;
    to: HTMLInputElement;
    forUser: HTMLInputElement;
    forIP: HTMLInputElement;
    forEndpoint: HTMLInputElement;
    requestLogs: any;
    logsTable: HTMLTableElement;
    activeLogs: CafeAccessLog[]

    constructor() {
        super(undefined)
        this.activeLogs = []

        let sectionLabel = Dom.div("Access Logs", CSS.sectionLabel)
        this.dropDownContainer = Dom.div()

        this.logsTable = Dom.el("table")
        this.logsTable.append(CafeAccessLog.gGetHeaderRow())
        let requestContainer = Dom.div();

        this.from = Dom.createInputElement("datetime-local")
        this.from.value = DatetimeTodayStartString()
        this.from.title = "Select start time for logs to view. No entry will select access logs from the beginning."

        this.to = Dom.createInputElement("datetime-local")
        this.to.value = DatetimeNowString()
        this.to.title = "Select end time for logs to view. No entry will select access logs until current time."

        this.forUser = Dom.createInputElement("text")
        this.forUser.title = "Enter a value to only view logs associated with a particular user. Otherwise, no user filtering will occur."

        this.forIP = Dom.createInputElement("text")
        this.forIP.title = "Enter a value to only view logs associated with a particular IP. Otherwise, no IP filtering will occur."

        this.forEndpoint = Dom.createInputElement("text")
        this.forEndpoint.title = "Enter a value to only view logs associated with a particular API endpoint. Otherwise, no api Endpoint filtering will occur."

        this.requestLogs = Dom.button("Request Logs")

        requestContainer.append(
            Dom.createContainerWithLabel("From:", CSS.inputLabel, "div", this.from),
            Dom.createContainerWithLabel("To:", CSS.inputLabel, "div", this.to),
            Dom.createContainerWithLabel("User:", CSS.inputLabel, "div", this.forUser),
            Dom.createContainerWithLabel("IP:", CSS.inputLabel, "div", this.forIP),
            Dom.createContainerWithLabel("Endpoint:", CSS.inputLabel, "div", this.forEndpoint),
            this.requestLogs
        )
        this.dropDownContainer.append(
            requestContainer,
            this.logsTable
            )
        this.el.append(sectionLabel, this.dropDownContainer)
        this.eventman.watchEventListener('click', sectionLabel, this.toggleFold, true)
        this.eventman.watchEventListener('click', this.requestLogs, this.requestLogsClicked, true)

    }
    /** Toggles whether the section is folder, by clicking on the section header. */
    toggleFold() {
        if(this.dropDownContainer.style.display == "none") {
            this.dropDownContainer.style.display = "block"
        } else {
            this.dropDownContainer.style.display = "none"
        }
    }

    /** Called when requestLogs is clicked. Populates the communication entity and dispatches it to the DOM with the appropraite event name. */
    requestLogsClicked() {
        let data : Partial<Client.ViewAccessLogs> = {}
        data.StartingAt = this.from.valueAsDate ? this.from.valueAsDate.valueOf() : null
        data.EndingAt = this.to.valueAsDate ? this.to.valueAsDate.valueOf() : null 
        data.ForUser = this.forUser.value
        data.ForIp = this.forIP.value
        data.ForEndpoint = this.forEndpoint.value
        let ev = new CustomEvent<Client.ViewAccessLogs>("viewLogs", {
            detail: data as Client.ViewAccessLogs
        })
        document.dispatchEvent(ev)
        
    }

    update(data:Server.AdminAccessLog[]) {
        data.sort( (a, b)=> {
            return b.LogId - a.LogId
        })
        for(let al of this.activeLogs) {
            al.destroy()
            al.el.remove()
        }
        this.activeLogs = []
        for(let l of data) {
            let cal = new CafeAccessLog(l)
            this.activeLogs.push(cal)
            this.logsTable.append(cal.el)
        }
    }

    destroy() {
        super.destroy()
        for(let al of this.activeLogs) {
            al.destroy()
        }
    }


}