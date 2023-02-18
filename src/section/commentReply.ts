import { Client } from "../CLIENT";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import "./commentReply.css"

const CSS = {
    textArea: "comment-reply-textarea",
    submit: "comment-reply-submit"
}


export class CommentReplySection extends CafeSection {
    openbutton : HTMLButtonElement
    replyArea: HTMLDivElement
    content: HTMLTextAreaElement
    submit : HTMLButtonElement

    /** 
     * @param alwaysOpen If true, hides the 'reply' button and keeps it always open for submission. Used when CommentReplySection is part of the top-level reply area. 
     */
    constructor(alwaysOpen=false) {
        super()
        this.openbutton = Dom.button("Reply")
        this.replyArea = Dom.div()
        this.content = Dom.el("textarea", CSS.textArea)
        if(alwaysOpen) {
            this.submit = Dom.button("Submit New Comment", CSS.submit)
        } else {
            this.submit = Dom.button("Reply To Comment", CSS.submit)
        }
        this.replyArea.append(this.content, this.submit)
        if(alwaysOpen) {
            this.el.append(this.replyArea)
            this.toggleReplyArea()
        } else {
            this.el.append(this.openbutton, this.replyArea)
        }
        this.clickListen(this.openbutton, this.toggleReplyArea, true)
        this.clickListen(this.submit, this.submitClicked, true)
    }
    toggleReplyArea() {
        if(this.content.style.display = "none") {
            this.content.style.display = "block"
        } else {
            this.content.style.display = "none"
        }
    }
    submitClicked() {
        let creply : Client.CommentReply = {
            ReplyingTo: 0, // 0 = top level comment
            Reply: this.content.value
        }
        this.content.value = ""
        let event = new CustomEvent<Client.CommentReply>("newComment", {
            detail: creply
        })
        document.dispatchEvent(event)
    }
}