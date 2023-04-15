import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import "./sendFeedback.css"

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    tnr : "times-new-roman",
    centeretnr : "centered-times-new-roman"
}

export class Feedback  extends CafeSection {
    dropDownContainer: HTMLDivElement;
    openbutton: HTMLButtonElement;
    sendbutton: HTMLButtonElement;
    feedbacktext : HTMLInputElement;
    feedbackType: HTMLSelectElement;
    constructor() {
        super()
        this.feedbacktext = Dom.createInputElement("text", CSS.centeretnr)
        this.openbutton = Dom.button("Click me to request a feedback report")
        this.sendbutton = Dom.button("Submit report")
        this.feedbackType = Dom.select(["bug", "feature", "general", "all"])
        this.dropDownContainer = Dom.div()

        let requestContainer = Dom.div()

        
        requestContainer.append(
        this.openbutton,
        Dom.createContainerWithLabel("Type:", CSS.tnr, "div", this.feedbackType),
        Dom.createContainer("div", CSS.tnr, this.feedbacktext),
        this.sendbutton
        )

        this.dropDownContainer.append(requestContainer)


        this.el.append(this.openbutton, this.dropDownContainer,
            )

        this.clickListen(this.openbutton, this.toggleFold, true)
        this.clickListen(this.sendbutton, this.submitClicked, true)
    }
    hide(element:HTMLElement) {
        element.style.display = "none"
    }
    hideAll() {
        this.hide(this.dropDownContainer)
        this.hide(this.openbutton)
        this.hide(this.sendbutton)
        this.hide(this.feedbacktext)
        this.hide(this.feedbackType)
    }

    toggleFold() {
        if(this.dropDownContainer.style.display == "none") {
            this.dropDownContainer.style.display = "block"
        } else {
            this.dropDownContainer.style.display = "none"
        }
    }

    show(element:HTMLElement) {
        element.style.display = "block"
    }
    showAll() {
        this.show(this.dropDownContainer)
        this.show(this.openbutton)
        this.show(this.sendbutton)
        this.show(this.feedbacktext)
        this.show(this.feedbackType)
    }
    submitClicked(){
        
    }
        /*submitClicked() {
        let creply : Client.CommentReply = {
            ReplyingTo: this.repliesTo, // 0 = top level comment
            Reply: this.content.value
        }
        
        this.content.value = ""
        
        let event = new CustomEvent<Client.CommentReply>("newComment", {
            detail: creply
        })
        
        document.dispatchEvent(event)
        
        // Hide the reply area after clicking the submitReplyButton
        if (!this.alwaysOpen) {
            this.toggleReplyArea()
        }
    }*/
}