
import { Client } from "../communication/CLIENT";
import { Server } from "../communication/SERVER";
import { CafeModActionDisplay } from "../ui/modActionDisplay";
import { CafeDom } from "../util/cafeDom";
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
export class ModActionsReportSection extends CafeSection {
    
    container        : HTMLDivElement
    activeActions    : CafeModActionDisplay[]
    actionContainer  : HTMLDivElement
    
    input: {
        from      : HTMLInputElement
        to        : HTMLInputElement
        forUser   : HTMLInputElement
        forDomain : HTMLInputElement
        submit    : HTMLButtonElement
    }
    
    /*
    dropDownContainer: HTMLDivElement;
    requestModRecordsButton : HTMLButtonElement;
    recsTable: HTMLTableElement;
    from: HTMLInputElement;
    to: HTMLInputElement;
    forUser: HTMLInputElement;
    forDomain: HTMLInputElement;
    */
    
    constructor() {
        super()
        
        let sectionLabel = Dom.div("View Moderator Actions", CSS.sectionLabel)
        sectionLabel.title = "The moderator actions section, used to view records of moderation actions taken on comments."
        this.container = Dom.div()
        
        this.activeActions = []
        this.actionContainer = Dom.div()
        
        this.input = {
            from      : Dom.createInputElement("datetime-local"),
            to        : Dom.createInputElement("datetime-local"),
            forUser   : Dom.createInputElement("text"),
            forDomain : Dom.createInputElement("text"),
            submit    : CafeDom.formSubmitButtonSmallCenteredBlock("Request Actions")
        }
        
        this.container.append(
            this.actionContainer,
            Dom.createContainerWithLabel("From:", CSS.inputLabel, "div", this.input.from),
            Dom.createContainerWithLabel("To:", CSS.inputLabel, "div", this.input.to),
            Dom.createContainerWithLabel("User:", CSS.inputLabel, "div", this.input.forUser),
            Dom.createContainerWithLabel("Domain:", CSS.inputLabel, "div", this.input.forDomain),
            this.input.submit
        )
        
        this.el.append(sectionLabel, this.container)
        this.eventman.watchEventListener('click', sectionLabel, this.toggleFold, true)
        this.eventman.watchEventListener('click', this.input.submit, this.requestActionsClicked, true)
        
        /*
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

        this.requestModRecordsButton = CafeDom.formSubmitButtonCenteredBlock("Request Actions")
        this.requestModRecordsButton.title = "Send the request to view moderation action records."
        
        requestContainer.append(
            Dom.createContainerWithLabel("From:", CSS.inputLabel, "div", this.from),
            Dom.createContainerWithLabel("To:", CSS.inputLabel, "div", this.to),
            Dom.createContainerWithLabel("User:", CSS.inputLabel, "div", this.forUser),
            Dom.createContainerWithLabel("Domain:", CSS.inputLabel, "div", this.forDomain),
            this.requestModRecordsButton
        )


        this.recsTable = Dom.el("table")

        this.dropDownContainer.append(requestContainer, this.recsTable)

        this.el.append(sectionLabel, this.dropDownContainer)
        this.eventman.watchEventListener('click', sectionLabel, this.toggleFold, true)
        this.eventman.watchEventListener('click', this.requestModRecordsButton, this.requestActionsClicked, true)
        */
    }
    
    toggleFold() {
        if(this.container.style.display != "none") {
            this.container.style.display = "none"
        } else {
            this.container.style.display = "block"
        }
    }
    
    requestActionsClicked() {
        let start = this.input.from.valueAsDate ? this.input.from.valueAsDate.valueOf() : null
        let end = this.input.to.valueAsDate ? this.input.to.valueAsDate.valueOf() : null
        
        let ev = new CustomEvent<Client.ViewModRecords>("viewModRecords", {
            detail: {
                ForDomain : this.input.forDomain.value,
                ByUser : this.input.forUser.value,
                From : start,
                To: end 
            }
        })
        
        document.dispatchEvent(ev)
    }
    
    populateModActions(records: Server.ModRecord[]) {
        
        for (let a of this.activeActions) {
            a.destroy()
            a.el.remove()
        }
        
        this.activeActions = []
        
        for (let r of records) {
            let a = new CafeModActionDisplay(r)
            this.activeActions.push(a)
            this.actionContainer.append(a.el)
        }
        
    }
    
}