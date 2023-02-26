import { CafeWindow } from "./base"
import { CafeSettings } from "../Cafe"
import { CafeCommentSortDisplay } from "../ui/commentSort"
import { Server } from "../SERVER"
import { CafeComment } from "../ui/comment"
import { Dom } from "../util/dom"
import { Client } from "../CLIENT"
import { CommentReplySection } from "../section/commentReply"
import { PseudoUrlSection } from "../section/pseudoURL"
import { multiSort } from "../util/sort"

import "./comments.css"

const CSS = {
    commentContainer : "comments-container"
}

/**
 * CafeCommentsWindow displays all comments for the current page. It is responsible for repopulating with new comments when comments for a new page are retrieved and updating comments as new ones are added and voted on.
 * 
 * It also contains pseudo url input and submit elements to allow users to request comments for a page they are not on. 
 * 
 * 
 * // Todos: 
 * We may have to expand the data returned from the Server so we can determine whether we are in a pseudoURL or real state. 
 * 
 * We may have to send a message to the server to request comments whenever "show()" is called (we can override show.)
 */
export class CafeCommentsWindow extends CafeWindow {
    data                : Server.Comment[]
    lastSettings?       : CafeSettings
    displayedComments   : Map<number, CafeComment>
    commentSortSettings : CafeCommentSortDisplay
    commentContainer    : HTMLDivElement
    newCommentSection   : CommentReplySection
    purlSection         : PseudoUrlSection
    currentlyViewing    : HTMLDivElement
    
    constructor() {
        super() // TODO: add parameters for CSS and whatnot
        this.data = []
        this.displayedComments = new Map<number, CafeComment>()

        this.commentSortSettings = new CafeCommentSortDisplay()
        this.newCommentSection = new CommentReplySection(0, true)
        this.purlSection = new PseudoUrlSection()
        
        this.commentContainer = Dom.div(undefined, CSS.commentContainer)
        this.purlSection.submitButton.addEventListener("click", this.requestCommentsForPseudoURLPage.bind(this))
        this.currentlyViewing = Dom.textEl('div')
        this.setCurrentlyViewing()
        
        this.el.append(
            this.currentlyViewing,
            this.purlSection.el,
            this.commentSortSettings.el,
            this.commentContainer,
            this.newCommentSection.el
        )
    }
    
    /** All instances of CafeComment is cleared, and new instances are created for every Comment in the parameter array */
    populateNewComments(data: Server.FullPage) {
        // Update the base data. Clear the list of displayed comments
        this.data = data.Comments
        this.resortComments()
        this.setCurrentlyViewing(data.Domain)
        
        // Clear the map.
        this.displayedComments.clear()
        
        // delete all children from the DOM.
        while(this.commentContainer.firstChild) {
            this.commentContainer.removeChild(this.commentContainer.firstChild);
        }
        
        // populate with the new comments. 
        for (let d of this.data) {
            this.updateComment(d)
        }
    }
    
    setCurrentlyViewing(url?: string) {
        if (url == undefined || url.length == 0) {
            this.currentlyViewing.textContent = 'Visit a webpage to view comments.'
        }
        else {
            this.currentlyViewing.textContent = 'You are viewing ' + url + '.'
        }
    }
    
    /** Updates data for the target CafeComment. A new CafeComment is created if the target doesn't exist */
    updateComment(comment: Server.Comment) {
        let maybeComment = this.displayedComments.get(comment.CommentId);
        
        if(maybeComment == undefined) {
            
            let newToAdd = new CafeComment(comment)
            this.displayedComments.set(comment.CommentId, newToAdd)
            
            if(comment.Parent != 0) { // root reply (top-level comment)... or is it -1?
                /*let parent = */this.displayedComments.get(comment.Parent)
                /* parent.childrenContainer = parent.getContainer()?; 
                 or maybe...  parent.addChild(comment) ? */
                 console.log("Comment does have parent")
                 this.displayedComments.get(comment.Parent)?.addChild(newToAdd)
            } else {
                console.log("Comment does not have parent")
                /* this.childrenContainer.append(newToAdd.el) ?*/
                this.commentContainer.appendChild(newToAdd.el)
            }
        } else {
            maybeComment.update(comment)
        }
    }
    
    /**
     * Called when a user input another URL to retrieve comments for. Dispatches the request with form data to the dom, for fetching. 
     */
    requestCommentsForPseudoURLPage() {
        let req : Client.GetComments = {
            Url : this.purlSection.pseudoURL.value,
            SortedBy : this.commentSortSettings.data != undefined ? this.commentSortSettings.data.sortBy : "new", 
            SortAscending: this.commentSortSettings.data != undefined ? this.commentSortSettings.data.sortAscending : true
        }
        let event = new CustomEvent<Client.GetComments>("getComments", {detail:req});
        document.dispatchEvent(event);
    }
    
    /** Removes and resorts all CafeComments on the page according to the user's settings */
    resortComments() {
        let sortby = this.commentSortSettings.data?.sortBy
        
        let secondary_category = (): ((a: Server.Comment)=>number) => {
            switch (sortby) {
                case 'new'     : return (a) => a.TimePosted
                case 'funny'   : return (a) => a.Funny.Ups
                case 'factual' : return (a) => a.Factual.Ups
                case 'agree'   : return (a) => a.Agree.Ups
            }
            return () => 0
        }
        
        this.data = multiSort<Server.Comment>(this.data, (a)=>a.Parent, secondary_category())
    }
    
    /** Saves previous settings and calls resortComments */
    updateFromSettings(settings: CafeSettings) {
        this.lastSettings = this.commentSortSettings.data
        this.commentSortSettings.data = settings
        this.resortComments()
    }
}
