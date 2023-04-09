import { Server } from "../communication/SERVER";
import { Client } from "../communication/CLIENT";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

import "./commentVote.css"
import arrow from "./arrow.svg"
import { CafeDom } from "../util/cafeDom";
import { EventManager } from "../util/eventman";

const CSS = {
    container : 'ui-comment-vote-container',
    
    buttons: {
        hitbox     : 'ui-comment-vote-hitbox',
        updownvote : 'ui-comment-upvote-downvote-button',
        container  : 'ui-comment-vote-buttons-container'
    }
}

export class CafeCommentVote extends UIInput<Server.CommentVoteDimension> {
    
    eventman : EventManager<CafeCommentVote>
    
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
        
        this.eventman = new EventManager(this)
        
        this.voteData = {
            commentId : commentId,
            voteType  : type
        }
        
        this.buttons = {
            hitbox    : Dom.button('', CSS.buttons.hitbox),
            up        : CafeDom.genericIconButton(Dom.button('', CSS.buttons.updownvote), {asset:'upvote.svg'}),
            down      : CafeDom.genericIconButton(Dom.button('', CSS.buttons.updownvote), {asset:'downvote.svg'}),
            container : Dom.div('', CSS.buttons.container)
        }
        
        this.total = Dom.div(String(voteDim.Ups + voteDim.Downs));
        
        switch (type)
        {
            case "funny":
                this.buttons.hitbox = CafeDom.genericIconButton(this.buttons.hitbox, {asset:'funny.svg'})
                break
                
            case "factual":
                this.buttons.hitbox = CafeDom.genericIconButton(this.buttons.hitbox, {asset:'factual.svg'})
                break
            
            case "agree":
                this.buttons.hitbox = CafeDom.genericIconButton(this.buttons.hitbox, {asset:'agree.svg'})
                break
        }
        
        this.buttons.container.append(
            this.buttons.up,
            this.buttons.down,
            this.buttons.hitbox
        )
        
        this.showUpvoteButtons(false)
        
        this.eventman.watchEventListener('mouseenter', this.buttons.container, ()=>{
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
            this.buttons.container,
            this.total
        )
        
        /*
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
        */
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
