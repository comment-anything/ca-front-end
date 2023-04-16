import { CafeWindow } from "./base"
import { CafeCommentSortDisplay } from "../ui/commentSort"
import { Server } from "../communication/SERVER"
import { CafeComment } from "../ui/comment"
import { Dom } from "../util/dom"
import { CommentReplySection } from "../section/commentReply"
import { PseudoUrlSection } from "../section/pseudoURL"
import { Settings } from "../Settings"
import { Client } from "../communication/CLIENT"

import "./comments.css"

const CSS = {
    viewing: 'comments-url-viewing',
    container: 'comments-container'
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
    data                : Server.FullPage
    displayedComments   : Map<number, CafeComment>
    
    viewingLabel        : HTMLDivElement
    purlSection         : PseudoUrlSection
    commentSortSettings : CafeCommentSortDisplay
    
    commentContainer    : HTMLDivElement
    newCommentSection   : CommentReplySection
    
    
    constructor() {
        super()
        
        this.data = { Domain: "", Path: "", Comments: [] }
        this.displayedComments = new Map<number, CafeComment>()
        
        this.viewingLabel = Dom.div('', CSS.viewing)
        this.purlSection = new PseudoUrlSection()
        
        this.commentContainer = Dom.div('', CSS.container)
        this.commentSortSettings = new CafeCommentSortDisplay()
        this.newCommentSection = new CommentReplySection(0, true)
        
        this.el.append (
            this.viewingLabel,
            this.purlSection.el,
            this.commentSortSettings.el,
            this.commentContainer,
            this.newCommentSection.el
        )
        
        this.setCurrentlyViewing()
        
        /*
        super() // TODO: add parameters for CSS and whatnot
        
        this.data = {
            Domain: "",
            Path: "",
            Comments: []
        }
        this.displayedComments = new Map<number, CafeComment>()

        this.commentSortSettings = new CafeCommentSortDisplay()
        this.newCommentSection = new CommentReplySection(0, true)
        this.purlSection = new PseudoUrlSection()
        
        this.commentContainer = Dom.div(undefined, CSS.container)
        this.currentlyViewing = Dom.textEl('div', CSS.url.viewing)
        this.setCurrentlyViewing()
        
        this.el.append(
            this.currentlyViewing,
            this.purlSection.el,
            this.commentSortSettings.el,
            this.commentContainer,
            this.newCommentSection.el
        )
        */
    }
    
    
    /** All instances of CafeComment is cleared, and new instances are created for every Comment in the parameter array */
    populateNewComments(data: Server.FullPage, sortnew: Client.SortOption = "new", sortascending = false) {
        // Update the base data. Clear the list of displayed comments
        this.data = data
        this.setCurrentlyViewing(data.Domain, data.Path)
        
        // Clear the map.
        for (let cafecom of this.displayedComments.values()) {
            cafecom.destroy()
        }
        
        this.displayedComments.clear()
        this.resortComments(sortnew, sortascending)
        
        // populate with the new comments. 
        for (let d of this.data.Comments) {
            this.updateComment(d)
        }
    }
    
    setCurrentlyViewing(url?: string, Path?: string) {
        if (url == undefined || url.length == 0) {
            this.viewingLabel.textContent = 'You are not viewing any comments.'
        }
        else {
            this.viewingLabel.textContent = 'You are viewing comments for ' + url + '/' + Path
        }
    }
    
    /** Called by Cafe when settings changes */
    settingChangeReceived(data: Settings) {
        console.log("settingChangRecieved called in CommentWindow with data", data)
        this.commentSortSettings.settingsChange(data)
        this.purlSection.settingsChange(data)
        this.populateNewComments(this.data, data.sortedBy, data.sortAscending)
    }
    
    /** Updates data for the target CafeComment. A new CafeComment is created if the target doesn't exist */
    updateComment(comment: Server.Comment) {
        let maybeComment = this.displayedComments.get(comment.CommentId);
        
        if(maybeComment == undefined) {
            
            let newToAdd = new CafeComment(comment)
            this.displayedComments.set(comment.CommentId, newToAdd)
            
            if(comment.Parent != 0) { 
                 console.log("Comment", comment.CommentId, "has parent ", comment.Parent)
                 this.displayedComments.get(comment.Parent)?.addChild(newToAdd)
            } else {
                console.log("Comment", comment.CommentId, "does not have parent", comment.Parent)
                /* this.childrenContainer.append(newToAdd.el) ?*/
                this.commentContainer.appendChild(newToAdd.el)
            }
        } else {
            maybeComment.update(comment)
        }
    }
    
    /** Resorts data.Commnets on the parameter */
    resortComments(on:Client.SortOption, ascending:boolean) {
        console.log("Getting sorter", on, "ascending", ascending)
        let sorter = GetSorter(on, ascending)
        this.data.Comments.sort(sorter)
        console.log("Sorted to: ", this.data.Comments)
    }
}

function GetSorter(on:Client.SortOption, ascending: boolean) {
    let subsorter : (a:Server.Comment, b:Server.Comment)=>number
    if(on == "funny") {
        subsorter = SortFunny
    } else if(on == "agree") {
        subsorter = SortAgree
    } else if(on == "factual") {
        subsorter = SortFactual
    } else {
        subsorter = SortNew
    }
    if(!ascending) {
        subsorter = Negate(subsorter)
    }
    return (a:Server.Comment, b:Server.Comment) => {
        let parentSort = SortParent(a,b)
        if(parentSort != 0) {
            return parentSort
        } else {
            return subsorter(a,b)
        }
    }
}


function Negate(towrap: (a:Server.Comment, b:Server.Comment)=>number) {
    return (a:Server.Comment, b:Server.Comment) => {
        return towrap(a,b)*-1
    }
}


function SortParent(a: Server.Comment, b: Server.Comment): number {
    return a.Parent - b.Parent 
}


function SortFunny(a:Server.Comment, b:Server.Comment):number {
    let atot = a.Funny.Ups + a.Funny.Downs
    let btot = b.Funny.Ups + b.Funny.Downs
    if(atot == btot) {
        return SortNew(a, b)
    } else {
        return atot - btot
    }
}
function SortAgree(a:Server.Comment, b:Server.Comment):number {
    let atot = a.Funny.Ups + a.Funny.Downs
    let btot = b.Funny.Ups + b.Funny.Downs
    if(atot == btot) {
        return SortNew(a, b)
    } else {
        return atot - btot
    }
}
function SortFactual(a:Server.Comment, b:Server.Comment):number {
    let atot = a.Factual.Ups + a.Factual.Downs
    let btot = b.Factual.Ups + b.Factual.Downs
    if(atot == btot) {
        return SortNew(a,b)
    }
    return atot - btot

}
function SortNew(a:Server.Comment, b:Server.Comment):number {
    return a.CommentId - b.CommentId
}
