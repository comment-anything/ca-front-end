import { Client } from "../communication/CLIENT";
import { CafeFeedback } from "../ui/feedback";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import { Server } from "../communication/SERVER";
import { CafeDom } from "../util/cafeDom";

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    inputLabel : "section-input-label-medium",
    container: "bottom-pad"
}

export class FeedbackReportSection extends CafeSection {
    
    dropDownContainer: HTMLDivElement;
    
    //feedbacksTable: HTMLTableElement;
    feedbacks       : HTMLDivElement
    activeFeedbacks : CafeFeedback[];
    
    input: {
        from                  : HTMLInputElement
        to                    : HTMLInputElement
        feedbackType          : HTMLSelectElement
        requestFeedbackButton : HTMLButtonElement;
    }
    
    constructor() {
        super()
        let sectionLabel = Dom.div("Feedback Report", CSS.sectionLabel)
        
        //this.feedbacksTable = Dom.el("table");
        //this.feedbacksTable.append(CafeFeedback.headerRow())
        
        this.dropDownContainer = Dom.div(undefined, CSS.container)
        this.feedbacks = Dom.div()
        this.activeFeedbacks = []
        let requestContainer = Dom.div()
        
        // Parameters
        
        this.input = {
            from                  : Dom.createInputElement("datetime-local"),
            to                    : Dom.createInputElement("datetime-local"),
            feedbackType          : Dom.select(["bug", "feature", "general", "all"]),
            requestFeedbackButton : CafeDom.formSubmitButtonSmallCenteredBlock("Request Feedback")
        }
        
        this.input.from.value = "2020-01-01T00:00"
        this.input.to.value = "2025-01-01T00:00"
        
        // Appends
        requestContainer.append(
            Dom.createContainerWithLabel("From:", CSS.inputLabel, "div", this.input.from),
            Dom.createContainerWithLabel("To:", CSS.inputLabel, "div", this.input.to),
            Dom.createContainerWithLabel("Type:", CSS.inputLabel, "div", this.input.feedbackType),
            this.input.requestFeedbackButton
        )
        
        this.dropDownContainer.append(this.feedbacks, requestContainer)
        this.el.append(sectionLabel, this.dropDownContainer)
        
        // Events
        this.eventman.watchEventListener('click', sectionLabel, this.toggleFold, true)
        this.eventman.watchEventListener('click', this.input.requestFeedbackButton, this.getFeedbackReportClicked, true)
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
            this.feedbacks.append(fr.el)
            //this.feedbacksTable.append(fr.el)
        }
    }
    
    getFeedbackReportClicked() {
        let edata : Partial<Client.ViewFeedback> = {}
        
        edata.From = this.input.from.valueAsDate?.valueOf()
        edata.To = this.input.to.valueAsDate?.valueOf()
        edata.FeedbackType = this.input.feedbackType.value as Server.FeedbackType
        
        let ev = new CustomEvent<Client.ViewFeedback>("viewFeedback", {
            detail: edata as Client.ViewFeedback
        })
        document.dispatchEvent(ev)
    }

}
