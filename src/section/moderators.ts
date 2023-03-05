import { Client } from "../CLIENT";
import { CafeFeedback } from "../ui/feedback";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import { Server } from "../SERVER";

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    inputLabel : "section-input-label-medium"
}
export class ModeratorsReportSection extends CafeSection {
    // forDomainInput is a unused section for now but is in the docs
    //forDomainInput                  :   HTMLInputElement;
    domainFrom                      : HTMLInputElement;
    domainTo                        : HTMLInputElement;
    domainFeedbackType              : HTMLSelectElement;
    globalFrom                      : HTMLInputElement;
    globalTo                        : HTMLInputElement;
    globalFeedbackType              : HTMLSelectElement;
    requestDomainModeratorsButton   :   HTMLButtonElement;
    requestGlobalModeratorsButton   :   HTMLButtonElement;
    domainModRecords                :   HTMLTableElement;
    globalModRecords                :   HTMLTableElement;
    domainActiveFeedbacks           : CafeFeedback[];
    globalActiveFeedbacks           : CafeFeedback[];
    dropDownContainer               : HTMLDivElement;
    constructor(){
        super()
        this.domainActiveFeedbacks = []
        this.globalActiveFeedbacks = []
        let requestContainer = Dom.div()

        this.domainFrom = Dom.createInputElement("datetime-local")
        this.domainFrom.value = "2020-01-01T00:00"
        this.domainTo = Dom.createInputElement("datetime-local")
        this.domainTo.value = "2025-01-01T00:00"
        this.domainFeedbackType  = Dom.select(["bug", "feature", "general", "all"])
        this.globalFrom = Dom.createInputElement("datetime-local")
        this.globalFrom.value = "2020-01-01T00:00"
        this.globalTo = Dom.createInputElement("datetime-local")
        this.globalTo.value = "2025-01-01T00:00"
        this.globalFeedbackType = Dom.select(["bug", "feature", "general", "all"])

        this.dropDownContainer = Dom.div()
        this.domainModRecords = Dom.el("table");
        this.domainModRecords.append(CafeFeedback.headerRow())
        this.globalModRecords = Dom.el("table");
        this.globalModRecords.append(CafeFeedback.headerRow())
        let sectionLabel = Dom.div("Moderator Reports", CSS.sectionLabel)
        this.requestDomainModeratorsButton = Dom.button("Request Feedback")
        this.requestGlobalModeratorsButton = Dom.button("Request Feedback")
        this.dropDownContainer.append(requestContainer)
        this.el.append(sectionLabel, this.dropDownContainer)
    this.clickListen(sectionLabel, this.toggleFold, true)

    requestContainer.append(
        Dom.createContainerWithLabel("From:", CSS.inputLabel, "div", this.domainFrom),
        Dom.createContainerWithLabel("To:", CSS.inputLabel, "div", this.domainTo),
        Dom.createContainerWithLabel("Type:", CSS.inputLabel, "div", this.domainFeedbackType),
        this.requestDomainModeratorsButton,
        Dom.createContainerWithLabel("From:", CSS.inputLabel, "div", this.globalFrom),
        Dom.createContainerWithLabel("To:", CSS.inputLabel, "div", this.globalTo),
        Dom.createContainerWithLabel("Type:", CSS.inputLabel, "div", this.globalFeedbackType),
        this.requestGlobalModeratorsButton
    )
    this.dropDownContainer.append(this.domainModRecords, requestContainer)
    this.dropDownContainer.append(this.globalModRecords, requestContainer)
    this.clickListen(this.requestDomainModeratorsButton, this.getDomainReportClicked, true)
    this.clickListen(this.requestGlobalModeratorsButton, this.getGlobalReportClicked, true)
    }
    toggleFold() {
        if(this.dropDownContainer.style.display == "none") {
            this.dropDownContainer.style.display = "block"
        } else {
            this.dropDownContainer.style.display = "none"
        }
    }
    domainUpdate(data:Server.FeedbackRecord[]) {
        for(let f of this.domainActiveFeedbacks) {
            f.destroy()
            f.el.remove()
        }
        this.domainActiveFeedbacks = []
        for(let d of data) {
            let fr = new CafeFeedback(d)
            this.domainActiveFeedbacks.push(fr)
            this.domainModRecords.append(fr.el)
        }
    }
    globalUpdate(data:Server.FeedbackRecord[]) {
        for(let f of this.globalActiveFeedbacks) {
            f.destroy()
            f.el.remove()
        }
        this.globalActiveFeedbacks = []
        for(let d of data) {
            let fr = new CafeFeedback(d)
            this.globalActiveFeedbacks.push(fr)
            this.globalModRecords.append(fr.el)
        }
    }
    // set to display only domain moderators that have reports
    getDomainReportClicked() {
        let edata : Partial<Client.ViewFeedback> = {}
        edata.From = this.domainFrom.valueAsDate?.valueOf()
        edata.To = this.domainTo.valueAsDate?.valueOf()
        edata.FeedbackType = this.domainFeedbackType.value as Server.FeedbackType
        let ev = new CustomEvent<Client.ViewFeedback>("viewFeedback", {
            detail: edata as Client.ViewFeedback
        })
        document.dispatchEvent(ev)
    }
    // set to display only global moderators that have reports
    getGlobalReportClicked() {
        let edata : Partial<Client.ViewFeedback> = {}
        edata.From = this.globalFrom.valueAsDate?.valueOf()
        edata.To = this.globalTo.valueAsDate?.valueOf()
        edata.FeedbackType = this.globalFeedbackType.value as Server.FeedbackType
        let ev = new CustomEvent<Client.ViewFeedback>("viewFeedback", {
            detail: edata as Client.ViewFeedback
        })
        document.dispatchEvent(ev)
    }
}