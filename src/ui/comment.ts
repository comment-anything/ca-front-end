import { Server } from "../SERVER";
import { StateView } from "../State";
import { Dom } from "../util/dom";
import { UIInput } from "./base";
import { CommentReplySection } from "../section/commentReply";
import { CommentVoteSection } from "../section/commentVoteSection";
import { CafeCommentVote } from "../ui/commentVote"

import "./comment.css"

const CSS = {
    usernameHeader: "username-header",
    baseComment: "cafe-comment",
    childComments: "comment-child-container",
    content: "cafe-comment-content"
} 



export class CafeComment extends UIInput<Server.Comment> {
    
    username       : HTMLDivElement
    content        : HTMLDivElement
    replySection   : CommentReplySection
    childContainer : HTMLDivElement
    collapseButton : HTMLButtonElement
    voteSection    : CommentVoteSection
    
    constructor(comment: Server.Comment) {
        super(comment)
        this.el.classList.add(CSS.baseComment)
        
        // Initialize HTML elements
        this.username = Dom.el("div", CSS.usernameHeader)
        this.content  = Dom.el("div", CSS.content)
        this.replySection = new CommentReplySection(comment.CommentId)
        this.childContainer = Dom.div(undefined, CSS.childComments)
        this.collapseButton = Dom.button("Expand")
        
        // Set the comment's username and content text (based on the comment parameter)
        this.username.textContent = (comment == undefined) ? "" : comment.Username
        this.content.textContent = (comment == undefined) ? "" : comment.Content
        
        // Initialize the CommentVoteSection
        this.voteSection = new CommentVoteSection(comment)
        
        // Setup state for expanding and collapsing replies
        this.clickListen(this.collapseButton, this.toggleCollapsedChildren, true)
        this.childContainer.style.display = "none"
        
        // Initially hide the "collapse button". It will be shown the moment a child is appended
        this.collapseButton.style.display = "none"
        
        this.el.append(
            this.username,
            this.content,
            this.voteSection.el,
            this.replySection.el,
            this.collapseButton,
            this.childContainer
        )
    }
    
    toggleCollapsedChildren() {
        if (this.childContainer.style.display == "none") {
            this.childContainer.style.display = "block"
            this.collapseButton.textContent = "Collapse"
        }
        else {
            this.childContainer.style.display = "none"
            this.collapseButton.textContent = "Expand"
        }
    }
    
    reportButtonClicked(): void {
        let state_event = new CustomEvent<StateView>("StateChangeRequest", {detail:"forgotpassword"})
        document.dispatchEvent(state_event)
    }
    
    update(data: Server.Comment) {
        this.voteSection.update(data)
    }
    
    addChild(child: CafeComment) {
        this.childContainer.appendChild(child.el)
        
        // The moment this is called, we have at least one child comment. Show the "Expand/Collapse button"
        this.collapseButton.style.display = "block"
    }
    
    sortChildren(sortby: CafeCommentVote) {
        
    }
}

