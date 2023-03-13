import { Server } from "../SERVER";
import { Client } from "../CLIENT";
import { Dom } from "../util/dom";
import { UIInput } from "./base";
import "./cafeComment.css"
import "./cafeCommentVote.ts"


const CSS = {
    windowName : "cafe-comments-window",
    inputSection: "cafe-window-input-section",
    inputField: "cafe-window-input-field",
    inputLabel: "cafe-window-lable",
    button: "cafe-window-button",
    cafe: "cafe-container",
    userCommentDisplay:"user-of-comment-section",
    commentDisplay:"user-of-comment-section"  
} 


export class CafeComment extends UIInput<Server.Comment> {
    username              : HTMLDivElement
    content               : HTMLDivElement
    replyText             : HTMLTextAreaElement
    reportText            : HTMLTextAreaElement
    submitReplyButton     : HTMLButtonElement
    submitReportButton    : HTMLButtonElement

    
    constructor(comment?:Server.Comment) {
        super(comment)

        this.username = Dom.el("div", CSS.cafe)
        this.content = Dom.el("div", CSS.cafe)
        this.replyText = Dom.createInputElement("text", CSS.inputField)
        this.reportText = Dom.createInputElement("text", CSS.inputField)
        this.submitReplyButton = Dom.button('Submit Report', CSS.button)
        this.submitReportButton = Dom.button('Submit Reply', CSS.button)

        this.submitReplyButton.addEventListener("click", this.ReplyButtonClicked.bind(this))
        this.submitReportButton.addEventListener("click", this.ReportButtonClicked.bind(this))

        this.el.append(
            Dom.createContainerWithLabel('ReplyText', CSS.inputLabel, "div", this.replyText, CSS.inputSection),
            Dom.createContainerWithLabel('ReportText', CSS.inputLabel, "div", this.reportText, CSS.inputSection),
            Dom.createContainerWithLabel('Username', CSS.userCommentDisplay, "div", this.username, CSS.userCommentDisplay),
            Dom.createContainerWithLabel('Content', CSS.commentDisplay, "div", this.content, CSS.commentDisplay),
            this.submitReplyButton,
            this.submitReportButton
        )
    }
    ReplyButtonClicked(): void {
        let reply: Client.CommentReply = {
            ReplyingTo: this.username.textContent,
            Reply: this.replyText.value,
        }
        let event = new CustomEvent<Client.CommentReply>("reply", {detail:reply})
        document.dispatchEvent(event)
        
    }
    
    ReportButtonClicked(): void {
        let state_event = new CustomEvent<StateView>("StateChangeRequest", {detail:"forgotpassword"})
        document.dispatchEvent(state_event)
    }
}