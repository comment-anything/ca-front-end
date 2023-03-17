import { Server } from "../SERVER";
import { StateView } from "../State";
import { Dom } from "../util/dom";
import { UIInput } from "./base";
import { CommentReplySection } from "../section/commentReply";
import { CommentVoteSection } from "../section/commentVoteSection";

import "./comment.css"
import arrow from "./arrow.svg"
import { ReportCommentSection } from "../section/reportAComment";

const CSS = {
    usernameHeader: "username-header",
    baseComment: "cafe-comment",
    childComments: "comment-child-container",
    content: "cafe-comment-content",
    postTime : "cafe-comment-posted-time",
    collapseButton: "cafe-comment-collapse-button"
} 


export class CafeComment extends UIInput<Server.Comment> {
    
    username       : HTMLDivElement
    content        : HTMLDivElement
    replySection   : CommentReplySection
    reportSection  : ReportCommentSection
    childContainer : HTMLDivElement
    collapseButton : HTMLDivElement
    submittedAt    : HTMLTableCellElement;
    voteSection    : CommentVoteSection
    
    constructor(comment: Server.Comment) {
        super(comment)
        this.el.classList.add(CSS.baseComment)
        
        // Initialize HTML elements
        this.username = Dom.el("div", CSS.usernameHeader)
        this.content  = Dom.el("div", CSS.content)
        this.replySection = new CommentReplySection(comment.CommentId)
        this.reportSection = new ReportCommentSection(comment.CommentId)
        this.childContainer = Dom.div(undefined, CSS.childComments)
        
        this.collapseButton = Dom.div("", CSS.collapseButton, {
            backgroundImage: `url(${arrow})`,
            backgroundSize: "contain",
            transform: "rotate(90deg)"
        })
        
        // Set the comment's username and content text (based on the comment parameter)
        this.username.textContent = (comment == undefined) ? "" : comment.Username
        this.content.textContent = (comment == undefined) ? "" : comment.Content
        
        // Initialize the CommentVoteSection
        this.voteSection = new CommentVoteSection(comment)
        
        // Setup state for expanding and collapsing replies
        this.clickListen(this.collapseButton, this.toggleCollapsedChildren, true)
        this.childContainer.style.display = "none"
        this.toggleCollapsedChildren()
        
        // Initially hide the "collapse button". It will be shown the moment a child is appended
        this.collapseButton.style.display = "none"
        
        let date = new Date(comment.TimePosted * 1000)
        this.submittedAt = Dom.textEl("td", date.toLocaleDateString() + " " + date.toLocaleTimeString(), CSS.postTime)
        
        this.el.append(
            this.username,
            this.submittedAt,
            this.content,
            this.voteSection.el,
            this.replySection.el,
            this.reportSection.el,
            this.collapseButton,
            this.childContainer
        )
    }
    
    /** Toggle collapsed children */
    toggleCollapsedChildren() {
        if (this.childContainer.style.display == "none") {
            this.childContainer.style.display = "block"
            this.collapseButton.style.transform = "rotate(0deg)"
        }
        else {
            this.childContainer.style.display = "none"
            this.collapseButton.style.transform = "rotate(270deg)"
        }
    }
    
    reportButtonClicked(): void {
        let state_event = new CustomEvent<StateView>("StateChangeRequest", {detail:"forgotpassword"})
        document.dispatchEvent(state_event)
    }
    
    update(data: Server.Comment) {
        this.data = data
        this.username.textContent = data.Username
        this.content.textContent = data.Content
        let date = new Date(data.TimePosted * 1000)
        this.submittedAt.textContent = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        this.voteSection.update(data)
    }
    
    /** Add a child CafeComment to the parent  */
    addChild(child: CafeComment) {
        this.childContainer.appendChild(child.el)
        // The moment this is called, we have at least one child comment. Show the "Expand/Collapse button"
        this.collapseButton.style.display = "block"
    }

    /** Overwrite the default so we also call destroy on the sections. That way, all listeners are removed. */
    destroy(): void {
        super.destroy()
        this.replySection.destroy()
        this.reportSection.destroy()
    }

    
}


