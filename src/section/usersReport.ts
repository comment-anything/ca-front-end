import { CafeSection } from "./base";
import { Server } from "../SERVER";
import { Client } from "../CLIENT";
import { Dom } from "../util/dom";

import "./sectionGeneralCSS.css"

const CSS = {
    labelContainer : "section-container-table",
    label : "section-container-table-td-label",
    tableData : "section-container-table-td-data",
    table : "section-container-table",
    sectionLabel : ["section-label", "section-label-as-button"]
}

/** Used to render a report on users inside the admin window for administrators, displaying things like the number of users logged in. */
export class UsersReportSection extends CafeSection {
    data?:Server.AdminUsersReport
    loggedInCount: HTMLTableCellElement;
    newestUserID: HTMLTableCellElement;
    newestUsername: HTMLTableCellElement;
    userCount: HTMLTableCellElement;
    lastReportContainer: HTMLDivElement;
    lastUpdate: HTMLTableCellElement;
    refreshButton: HTMLButtonElement;
    constructor() {
        super()
        let sectionLabel = Dom.div("Users Report", CSS.sectionLabel)
        this.lastReportContainer = Dom.div()
        let table = Dom.el("table", CSS.table)

        this.loggedInCount = Dom.el("td", CSS.tableData)
        this.newestUserID = Dom.el("td", CSS.tableData)
        this.newestUsername = Dom.el("td", CSS.tableData)
        this.userCount = Dom.el("td", CSS.tableData)
        this.lastUpdate = Dom.el("td", CSS.tableData)


        this.refreshButton = Dom.button("Get Users Report")
        
        table.append(
            Dom.tableRow("Last Update: ", this.lastUpdate, undefined, CSS.label),
            Dom.tableRow("Logged in Count: ", this.loggedInCount, undefined, CSS.label),
            Dom.tableRow("Newest User ID: ", this.newestUserID, undefined, CSS.label),
            Dom.tableRow("Newest Username: ", this.newestUsername, undefined, CSS.label),
            Dom.tableRow("Total Users: ", this.userCount, undefined, CSS.label)
        )
        this.lastReportContainer.append(table, this.refreshButton)

        this.el.append(sectionLabel, this.lastReportContainer)

        this.clickListen(sectionLabel, this.toggleFold, true)
        this.clickListen(this.refreshButton, this.getUsersReportClicked, true)

    }

    update(data: Server.AdminUsersReport) {
        let dt = new Date()
        this.lastUpdate.textContent = dt.toLocaleDateString() + " " + dt.toLocaleTimeString()
        this.loggedInCount.textContent = data.LoggedInUserCount.toString()
        this.newestUserID.textContent = data.NewestUserId.toString()
        this.newestUsername.textContent = data.NewestUsername
        this.userCount.textContent = data.UserCount.toString()
    }

    toggleFold() {
        if(this.lastReportContainer.style.display == "none") {
            this.lastReportContainer.style.display = "block"
        } else {
            this.lastReportContainer.style.display = "none";
        }
    }

    getUsersReportClicked() {
        let event = new CustomEvent<Client.ViewUsersReport>("viewUsersReport", {
            detail: {}
        })
        document.dispatchEvent(event)
    }
    
}