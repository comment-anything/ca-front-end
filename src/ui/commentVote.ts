import { Server } from "../communication/SERVER";
import { Client } from "../communication/CLIENT";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

import "./commentVote.css"
import { CafeDom } from "../util/cafeDom";

const CSS = {
    container : 'ui-comment-vote-container',
    
    buttons: {
        hitbox     : 'ui-comment-vote-hitbox',
        container  : 'ui-comment-vote-buttons-container',
        upvote: ['ui-comment-upvote-downvote-button', 'ui-comment-up'],
        downvote: ['ui-comment-upvote-downvote-button', 'ui-comment-down']
    }
}

export class CafeCommentVote extends UIInput<Server.CommentVoteDimension> {
    
    voteData: {
        commentId : number
        voteType  : Client.VoteType
    }
    
    buttons : {
        hitbox    : HTMLButtonElement
        up        : HTMLButtonElement
        down      : HTMLButtonElement
        container : HTMLDivElement
    }
    
    total  : HTMLDivElement
    
    constructor(type: Client.VoteType, commentId: number, voteDim: Server.CommentVoteDimension) {
        super(voteDim)
        this.el.classList.add(CSS.container)
        
        this.voteData = {
            commentId : commentId,
            voteType  : type
        }
        
        this.buttons = {
            hitbox    : Dom.button('', CSS.buttons.hitbox),
            up        : CafeDom.genericIconButton(Dom.button('', CSS.buttons.upvote), {asset:'upvote'}),
            down      : CafeDom.genericIconButton(Dom.button('', CSS.buttons.downvote), {asset:'downvote'}),
            container : Dom.div('', CSS.buttons.container)
        }

        this.buttons.up.title = "Vote up if you think this comment is " + type + "!"
        this.buttons.down.title = "Vote down if you think this comment isn't " + type + "!"
        

        
        this.total = Dom.div(String(voteDim.Ups + voteDim.Downs));
        
        switch (type)
        {
            case "funny":
                this.buttons.hitbox = CafeDom.genericIconButton(this.buttons.hitbox, {asset:'funny'})
                break
                
            case "factual":
                this.buttons.hitbox = CafeDom.genericIconButton(this.buttons.hitbox, {asset:'factual'})
                break
            
            case "agree":
                this.buttons.hitbox = CafeDom.genericIconButton(this.buttons.hitbox, {asset:'agree'})
                break
        }
        
        this.buttons.container.append(
            this.buttons.up,
            this.buttons.down
        )

        this.buttons.hitbox.append(this.buttons.container)
        
        this.showUpvoteButtons(false)
        
        this.eventman.watchEventListener('mouseenter', this.buttons.hitbox, ()=>{
            this.showUpvoteButtons(true)
        })
        
        this.eventman.watchEventListener('mouseleave', this.buttons.container, ()=>{
            this.showUpvoteButtons(false)
        })
        
        this.eventman.watchEventListener('click', this.buttons.up, ()=>{
            this.upVoteClicked()
        })
        
        this.eventman.watchEventListener('click', this.buttons.down, ()=>{
            this.downVoteClicked()
        })
        
        this.el.append(
            this.buttons.hitbox,
            this.total
        )
        
    }
    
    showUpvoteButtons(show: boolean) {
        
        if (show) {
            this.buttons.up.style.transform = 'scaleY(100%)'
            this.buttons.down.style.transform = 'scaleY(100%)'
        } else {
            this.buttons.up.style.transform = 'scaleY(0%)'
            this.buttons.down.style.transform = 'scaleY(0%)'
        }

    }
    
    update(data: Server.CommentVoteDimension) {
        this.data = data
        console.log(`📉 cvote for ${this.voteData.commentId} ups: ${this.buttons.up}, down: ${this.buttons.down}, result: ${String(data.Ups + data.Downs)}`)
        this.total.textContent = String(data.Ups + data.Downs)
    }
    
    upVoteClicked() {
        let upvote: Client.CommentVote = {
            VotingOn: this.voteData.commentId,
            VoteType: this.voteData.voteType,
            Value: 1
        }
        
        let event = new CustomEvent<Client.CommentVote>("voteComment", {detail:upvote})
        document.dispatchEvent(event)  
    }
    
    downVoteClicked() {
        let upvote: Client.CommentVote = {
            VotingOn: this.voteData.commentId,
            VoteType: this.voteData.voteType,
            Value: -1
        }
        
        let event = new CustomEvent<Client.CommentVote>("voteComment", {detail:upvote})
        document.dispatchEvent(event)  
    }
}
