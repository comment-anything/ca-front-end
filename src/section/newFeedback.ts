import { Client } from "../communication/CLIENT";
import { CafeDom } from "../util/cafeDom";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";

import "./sectionGeneralCSS.css"

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    itemRow: "row5050"
}

/** This class renders the "New Feedback" area of the Settings window. It's where user's may submit feedback on Comment Anywhere. */
export class NewFeedbackSection extends CafeSection {
    container: HTMLDivElement;
    categorySelect: HTMLSelectElement;
    content: HTMLTextAreaElement;
    submit: HTMLButtonElement;
    constructor() {
        super(undefined)
        let sectionLabel = Dom.div("New Feedback", CSS.sectionLabel)
        this.container = Dom.div()

        let catContainer = Dom.div(undefined, CSS.itemRow)
        let lab1 = Dom.textEl("label", "Category")
        this.categorySelect = Dom.select(["bug", "feature", "general"])
        catContainer.append(lab1, this.categorySelect)

        let contContainer = Dom.div(undefined, CSS.itemRow)
        let lab2 = Dom.textEl("label", "Feedback")
        this.content = Dom.el("textarea")
        contContainer.append(lab2, this.content)

        this.submit = CafeDom.formSubmitButtonCenteredBlock("Submit Feedback", {
            marginTop: "10px"
        })
        
        this.container.append(catContainer, contContainer, this.submit)


        this.el.append(sectionLabel, this.container)

        this.eventman.watchEventListener('click', sectionLabel, this.toggleFold, true)
        this.eventman.watchEventListener('click', this.submit, this.submitFeedbackClicked, true)
    }

    /** Toggles whether the section is folder, by clicking on the section header. */
    toggleFold() {
        if(this.container.style.display == "none") {
            this.container.style.display = "block"
        } else {
            this.container.style.display = "none"
        }
    }

    /** Called when the submit feedback button is clicked. Dispatches the event to the document that will result in the server call. */
    submitFeedbackClicked() {
        let category = this.categorySelect.value
        let content = this.content.value
        let ev = new CustomEvent<Client.Feedback>("newFeedback", {
            detail: {
                FeedbackType: category,
                Content: content 
            }
        })
        document.dispatchEvent(ev)
        this.content.value = ""
        this.toggleFold()
    }
}