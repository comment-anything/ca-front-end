import { Client } from "../communication/CLIENT";
import { CafeFeedback } from "../ui/feedback";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import { Server } from "../communication/SERVER";

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    inputLabel : "section-input-label-medium",
    container: "bottom-pad"
}

export class FeedbackReportSection extends CafeSection {
    from: HTMLInputElement;
    to: HTMLInputElement;
    feedbackType: HTMLSelectElement;
    requestFeedbackButton: HTMLButtonElement;
    dropDownContainer: HTMLDivElement;
    feedbacksTable: HTMLTableElement;
    activeFeedbacks: CafeFeedback[];
    
    constructor() {
        super()
        let sectionLabel = Dom.div("Feedback Report", CSS.sectionLabel)

        this.dropDownContainer = Dom.div(undefined, CSS.container)

        this.feedbacksTable = Dom.el("table");
        this.feedbacksTable.append(CafeFeedback.headerRow())

        this.activeFeedbacks = []

        let requestContainer = Dom.div()

        this.from = Dom.createInputElement("datetime-local")
        this.from.value = "2020-01-01T00:00"
        this.to = Dom.createInputElement("datetime-local")
        this.to.value = "2025-01-01T00:00"
        this.feedbackType = Dom.select(["bug", "feature", "general", "all"])

        this.requestFeedbackButton = Dom.button("Request Feedback")
        
        requestContainer.append(
            Dom.createContainerWithLabel("From:", CSS.inputLabel, "div", this.from),
            Dom.createContainerWithLabel("To:", CSS.inputLabel, "div", this.to),
            Dom.createContainerWithLabel("Type:", CSS.inputLabel, "div", this.feedbackType),
            this.requestFeedbackButton
        )

        this.dropDownContainer.append(this.feedbacksTable, requestContainer)


        this.el.append(sectionLabel, this.dropDownContainer)

        this.clickListen(sectionLabel, this.toggleFold, true)

        this.clickListen(this.requestFeedbackButton, this.getFeedbackReportClicked, true)
    }

    toggleFold() {
        if(this.dropDownContainer.style.display == "none") {
            this.dropDownContainer.style.display = "block"
        } else {
            this.dropDownContainer.style.display = "none"
        }
    }

    update(data:Server.FeedbackRecord[]) {
        for(let f of this.activeFeedbacks) {
            f.destroy()
            f.el.remove()
        }
        this.activeFeedbacks = []
        for(let d of data) {
            let fr = new CafeFeedback(d)
            this.activeFeedbacks.push(fr)
            this.feedbacksTable.append(fr.el)
        }
    }

    getFeedbackReportClicked() {
        let edata : Partial<Client.ViewFeedback> = {}
        edata.From = this.from.valueAsDate?.valueOf()
        edata.To = this.to.valueAsDate?.valueOf()
        edata.FeedbackType = this.feedbackType.value as Server.FeedbackType
        let ev = new CustomEvent<Client.ViewFeedback>("viewFeedback", {
            detail: edata as Client.ViewFeedback
        })
        document.dispatchEvent(ev)
    }

}