
import { Client } from "../CLIENT";
import { DatetimeNowString, DatetimeOffsetString } from "../util/date";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    inputLabel : "section-input-label-medium",
}

/**
 * The ModActionsReportSection is part of the Moderator panel.
 * 
 * It allows a moderator to view an (optionally filtered) selection of moderator actions.
 * 
 * It uses the standard section drop-down paradigm.
 */
export class ModActionsReportSection  extends CafeSection {
    dropDownContainer: HTMLDivElement;
    requestModRecordsButton : HTMLButtonElement;
    recsTable: HTMLTableElement;
    from: HTMLInputElement;
    to: HTMLInputElement;
    forUser: HTMLInputElement;
    forDomain: HTMLInputElement;
    constructor() {
        super()
        let sectionLabel = Dom.div("View Moderator Actions", CSS.sectionLabel)
        sectionLabel.title = "The moderator actions section, used to view records of moderation actions taken on comments."
        
        this.dropDownContainer = Dom.div()

        let requestContainer = Dom.div()

        this.from = Dom.createInputElement("datetime-local")
        this.from.value = DatetimeOffsetString(0,0,-7) // Default: 1 week earlier
        this.from.title = "Select start time for mod action records to view. No entry will select access records from the beginning."
        
        this.to = Dom.createInputElement("datetime-local")
        this.to.value = DatetimeNowString()
        this.to.title = "Select end time for mod action records to view. No entry will select records up to the current moment."

        this.forUser = Dom.createInputElement("text")
        this.forUser.title = "An optional filter to limit records only to those taken by a particular user."

        this.forDomain = Dom.createInputElement("text")
        this.forDomain.title = "An optional filter to limit records only to those taken on a particular domain. No value will view all actions pertaining to domains you have authority to moderate."

        this.requestModRecordsButton = Dom.button("Request Actions")
        this.requestModRecordsButton.title = "Send the request to view moderation action records."

        requestContainer.append(
            Dom.createContainerWithLabel("From:", CSS.inputLabel, "div", this.from),
            Dom.createContainerWithLabel("To:", CSS.inputLabel, "div", this.to),
            Dom.createContainerWithLabel("User:", CSS.inputLabel, "div", this.forUser),
            Dom.createContainerWithLabel("Domain:", CSS.inputLabel, "div", this.forDomain),
            this.requestModRecordsButton
        )


        this.recsTable = Dom.el("table")

        this.dropDownContainer.append(requestContainer)

        this.el.append(sectionLabel, this.dropDownContainer)
        this.clickListen(sectionLabel, this.toggleFold, true)
        this.clickListen(this.requestModRecordsButton, this.requestActionsClicked, true)
    }

    toggleFold() {
        if(this.dropDownContainer.style.display != "none") {
            this.dropDownContainer.style.display = "none"
        } else {
            this.dropDownContainer.style.display = "block"
        }
    }

    requestActionsClicked() {
        let start = this.from.valueAsDate ? this.from.valueAsDate.valueOf() : null
        let end = this.to.valueAsDate ? this.to.valueAsDate.valueOf() : null
        let ev = new CustomEvent<Client.ViewModRecords>("viewModRecords", {
            detail: {
                ForDomain : this.forDomain.value,
                ByUser : this.forUser.value,
                From : start,
                To: end 
            }
        })
        document.dispatchEvent(ev)
    }
}