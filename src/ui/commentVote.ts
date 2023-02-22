import { Server } from "../SERVER";
import { Client } from "../CLIENT";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

import "./commentVote.css"
import arrow from "./arrow.svg"

const CSS = {
    upvotebutton: "comment-vote-button",
    downvotebutton: "comment-vote-button",
    numberDisplay: "comment-vote-number-display",
    categoryDisplay: "comment-vote-category-display",
    voteContainer: "comment-vote-container"
}

export class CafeCommentVote extends UIInput<Server.CommentVoteDimension> {
    commentId : number
    voteType  : Client.VoteType
    up        : HTMLButtonElement
    down      : HTMLButtonElement
    total     : HTMLDivElement
    
    constructor(type: Client.VoteType, commentId: number, voteDim: Server.CommentVoteDimension) {
        super(voteDim)
        this.el.classList.add(CSS.voteContainer)
        this.commentId = commentId

        this.voteType = type
        let label_voteLabel = Dom.textEl("label",type, CSS.categoryDisplay);

        this.up = Dom.button('', CSS.upvotebutton, {
            backgroundImage: `url(${arrow})`,
            backgroundSize: "contain",
            transform: "rotate(180deg)"
        })
        this.up.style.backgroundImage = `url(${arrow})`
        this.down = Dom.button("", CSS.downvotebutton, 
        {
            backgroundImage: `url(${arrow})`,
            backgroundSize: "contain",
        })

        this.total = Dom.div( String(voteDim.Ups + voteDim.Downs), CSS.numberDisplay);

        this.el.append(
            this.up,
            label_voteLabel,
            this.total,
            this.down
        )
        this.clickListen(this.up, this.upVoteClicked, true)
        this.clickListen(this.down, this.downVoteClicked, true)

    }

    update(data: Server.CommentVoteDimension) {
        this.total.textContent = String(data.Ups + data.Downs)
    }
    
    upVoteClicked() {
        let upvote: Client.CommentVote  = {
            VotingOn: this.commentId,
            VoteType: this.voteType,
            Value: 1
        }
        
        let event = new CustomEvent<Client.CommentVote>("voteComment", {detail:upvote})
        document.dispatchEvent(event)  
    }
    
    downVoteClicked() {
        let upvote: Client.CommentVote  = {
            VotingOn: this.commentId,
            VoteType: this.voteType,
            Value: -1
        }
        
        let event = new CustomEvent<Client.CommentVote>("voteComment", {detail:upvote})
        document.dispatchEvent(event)  
    }
}
