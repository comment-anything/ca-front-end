import { Client } from "../communication/CLIENT";
import { CafeDom } from "../util/cafeDom";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import "./commentReply.css"

const CSS = {
    container: 'comment-reply-container',
    textArea: "comment-reply-textarea",
    submit: "comment-reply-submit"
}


export class CommentReplySection extends CafeSection {
    openbutton : HTMLButtonElement
    replyArea  : HTMLDivElement
    content    : HTMLTextAreaElement
    contentContainer : HTMLDivElement
    submit     : HTMLButtonElement
    repliesTo  : number
    alwaysOpen : boolean
    
    /** 
     * @param alwaysOpen If true, hides the 'reply' button and keeps it always open for submission. Used when CommentReplySection is part of the top-level reply area. 
     */
    constructor(replyTo: number, alwaysOpen=false) {
        super()
        this.el.classList.add(CSS.container)
        
        this.repliesTo = replyTo
        this.alwaysOpen = alwaysOpen
        this.openbutton = CafeDom.textLink(Dom.button("Reply"), {})
        this.replyArea = Dom.div()
        this.content = Dom.el("textarea")
        
        
        
        if(alwaysOpen) {
            this.submit = CafeDom.textLink(Dom.button(), {label: "Submit new comment"}) //Dom.button("Submit New Comment", CSS.submit)
            this.contentContainer = CafeDom.genericTextAreaInput(this.content, this.submit, {label: "Post a comment"})
        } else {
            this.submit = CafeDom.textLink(Dom.button(), {label: "Reply to comment"})  //Dom.button("Reply To Comment", CSS.submit, {display: "none"})
            this.contentContainer = CafeDom.genericTextAreaInput(this.content, this.submit, {label: "Reply to comment"})
        }
        
        this.replyArea.append(
            this.contentContainer,
        )
        
        if(alwaysOpen) {
            this.el.append(this.replyArea)
            this.toggleReplyArea()
        } else {
            this.el.append(this.openbutton, this.replyArea)
        }
        
        this.toggleReplyArea()
        this.eventman.watchEventListener('click', this.openbutton, this.toggleReplyArea, true)
        this.eventman.watchEventListener('click', this.submit, this.submitClicked, true)
    }
    
    toggleReplyArea() {
        if (this.contentContainer.style.display == "none") {
            this.contentContainer.style.display = "block"
            
            if (!this.alwaysOpen) {
                this.submit.style.display = "block"
            }
        } else {
            this.contentContainer.style.display = "none"
            
            if (!this.alwaysOpen) {
                this.submit.style.display = "none"
            }
        }
    }
    
    submitClicked() {
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
    }
}