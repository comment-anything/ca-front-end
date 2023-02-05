import { Server } from "../SERVER";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

import "./message.css"


const CSS = {
    message_class : "server-message",
    message_success_false : "server-message-success-false",
    message_success_true : "server-message-success-true"
}

export class CafeMessageDisplay extends UIInput<Server.Message> {

    displayedText: HTMLDivElement

    constructor() {
        super({Success:true, Text:"Welcome"})
        this.displayedText = Dom.div(undefined, CSS.message_class)
        this.el.appendChild(this.displayedText)
        this.displayedText.classList.add(CSS.message_success_true)
        this.updateMessage(this.data)
    }

    // updateMessage changes the message which is shown.
    updateMessage(d:Server.Message) {
        console.log("update message called in ", this, "with", d)
        this.el.removeChild(this.displayedText)
        this.el.append(this.displayedText)
        if(d.Success) {
            this.displayedText.classList.remove(CSS.message_success_false)
            this.displayedText.classList.add(CSS.message_success_true)
        } else {
            this.displayedText.classList.remove(CSS.message_success_true)
            this.displayedText.classList.add(CSS.message_success_false)
        }
        this.displayedText.textContent = d.Text
        this.data = d
    }

    // clearMessage clears the currently displayed message.
    clearMessage() {
        this.updateMessage({Success:true, Text:""})
    }

}