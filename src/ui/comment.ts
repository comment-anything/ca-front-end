import { Server } from "../SERVER";
import { StateView } from "../State";
import { Dom } from "../util/dom";
import { UIInput } from "./base";
import { CommentReplySection } from "../section/commentReply";
import { CommentVoteSection } from "../section/commentVoteSection";

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

    voteSection : CommentVoteSection
    
    constructor(comment: Server.Comment) {
        super(comment)
        this.el.classList.add(CSS.baseComment)
        
        this.username = Dom.el("div", CSS.usernameHeader)
        this.content  = Dom.el("div", CSS.content)
        this.replySection = new CommentReplySection(comment.CommentId)
        this.childContainer = Dom.div(undefined, CSS.childComments )
        
        this.username.textContent = (comment == undefined) ? "" : comment.Username
        this.content.textContent = (comment == undefined) ? "" : comment.Content

        this.voteSection = new CommentVoteSection(comment)
        
        this.el.append(
            this.username,
            this.content,
            this.voteSection.el,
            this.replySection.el,
            this.childContainer
        )
        
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
    }
}

