import { Server } from "../communication/SERVER";
import { StateView } from "../State";
import { Dom } from "../util/dom";
import { UIInput } from "./base";
import { CommentReplySection } from "../section/commentReply";
import { CommentVoteSection } from "../section/commentVoteSection";

import "./comment.css"
import { ReportCommentSection } from "../section/reportAComment";
import { CafeDom } from "../util/cafeDom";



const CSS = {
    shading : 'ui-comment-parent-shade',
    block   : 'ui-comment-block',
    content : 'ui-comment-content',
    
    header: {
        container : 'ui-comment-header-container',
        time      : 'ui-comment-header-time'
    },
    
    footer: {
        container : 'ui-comment-footer-container'
    },
    
    replies: {
        nested : 'ui-comment-replies-nested',
        collapseButton : 'ui-comment-replies-collapse-button'
    }
} 



export class CafeComment extends UIInput<Server.Comment> {
    
    commentBlock: HTMLDivElement
    content: HTMLDivElement
    
    header: {
        username  : HTMLButtonElement
        postedAt  : HTMLDivElement
        container : HTMLDivElement
    }
    
    footer: {
        voteSection    : CommentVoteSection
        replySection   : CommentReplySection
        reportSection  : ReportCommentSection
        container      : HTMLDivElement
    }
    
    replies: {
        container      : HTMLDivElement,
        collapseButton : HTMLButtonElement,
    }
    
    constructor(comment: Server.Comment) {
        super(comment)
        this.el.classList.add(CSS.shading)
        
        this.commentBlock = Dom.div('', CSS.block)
        this.content = Dom.div('', CSS.content)
        this.content.textContent = (comment == undefined) ? "" : comment.Content
        
        this.header = {
            username  : CafeDom.textLink(Dom.button(), {}),
            postedAt  : Dom.div('', CSS.header.time),
            container : Dom.div('', CSS.header.container)
        }
        
        let date = new Date(comment.TimePosted * 1000)
        this.header.username.textContent = (comment == undefined) ? "" : comment.Username
        this.header.postedAt.textContent = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        
        this.footer = {
            voteSection    : new CommentVoteSection(comment),
            replySection   : new CommentReplySection(comment.CommentId),
            reportSection  : new ReportCommentSection(comment.CommentId),
            container      : Dom.div('', CSS.footer.container)
        }
        
        this.replies = {
            container      : Dom.div('', CSS.replies.nested),
            collapseButton : CafeDom.genericIconButton(Dom.button('', CSS.replies.collapseButton), {asset:'arrow'})
        }
        
        this.eventman.watchEventListener('click', this.replies.collapseButton, this.toggleCollapsedChildren)
        this.appendsBasedOnRemoved()
        
        /*
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
        
        this.appendsBasedOnRemoved();
        */
    }
    
    /** Toggle collapsed children */
    toggleCollapsedChildren() {
        if (this.replies.container.style.display == "none") {
            this.replies.container.style.display = "block"
            this.replies.collapseButton.style.transform = "rotate(0deg)"
        }
        else {
            this.replies.container.style.display = "none"
            this.replies.collapseButton.style.transform = "rotate(270deg)"
        }
    }
    
    reportButtonClicked(): void {
        let state_event = new CustomEvent<StateView>("StateChangeRequest", {detail:"forgotpassword"})
        document.dispatchEvent(state_event)
    }
    
    /** Used to control el appending so that votes and reply button are not visible when a comment is removed. */
    appendsBasedOnRemoved() {
        
        this.header.container.append(
            this.header.username,
            this.header.postedAt
        )
        
        this.footer.container.append(
            this.footer.voteSection.el,
            this.footer.replySection.el,
            this.footer.reportSection.el
        )
        
        this.commentBlock.append(
            this.header.container,
            this.content,
            this.footer.container
        )
        
        this.el.append(
            this.commentBlock,
            this.replies.collapseButton,
            this.replies.container
        )
        
        if(this.data && this.data.Removed) {
            this.footer.voteSection.el.remove()
            this.footer.replySection.el.remove()
            this.footer.reportSection.el.remove()
        }
        
        this.replies.collapseButton.style.display = 'none';
    }
    
    update(data: Server.Comment) {
        this.data = data
        this.header.username.textContent = data.Username
        this.content.textContent = data.Content
        let date = new Date(data.TimePosted * 1000)
        this.header.postedAt.textContent = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        this.footer.voteSection.update(data)
        this.appendsBasedOnRemoved()
    }
    
    /** Add a child CafeComment to the parent  */
    addChild(child: CafeComment) {
        this.replies.container.appendChild(child.el)
        // The moment this is called, we have at least one child comment. Show the "Expand/Collapse button"
        this.replies.collapseButton.style.display = "block"
    }
    
    /** Overwrite the default so we also call destroy on the sections. That way, all listeners are removed. */
    destroy(): void {
        super.destroy()
        this.footer.voteSection.destroy()
        this.footer.replySection.destroy()
        this.footer.reportSection.destroy()
    }
}


