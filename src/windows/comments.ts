import { CafeWindow } from "./base"
import { CafeSettings } from "../Cafe"
import { CafeCommentSortDisplay } from "../ui/commentSort"
import { Server } from "../SERVER"
import { CafeComment } from "../ui/comment"

/**
 * CafeCommentsWindow displays all comments for the current page. It is responsible for repopulating with new comments when comments for a new page are retrieved and updating comments as new ones are added and voted on.
 */
export class CafeCommentsWindow extends CafeWindow {
    data                : Server.Comment[]
    lastSettings?       : CafeSettings
    displayedComments   : Map<number, CafeComment>
    commentSortSettings : CafeCommentSortDisplay
    
    constructor() {
        super() // TODO: add parameters for CSS and whatnot
        this.data = []
        this.displayedComments = new Map<number, CafeComment>()
        this.commentSortSettings = new CafeCommentSortDisplay()
        
        this.el.append(this.commentSortSettings.el)
    }
    
    /** All instances of CafeComment is cleared, and new instances are created for every Comment in the parameter array */
    populateNewComments(data: Server.Comment[]) {
        // Update the base data. Clear the list of displayed comments
        this.data = data
        this.displayedComments.clear()
        
        for (let d of data) {
            this.updateComment(d)
        }
    }
    
    /** Updates data for the target CafeComment. A new CafeComment is created if the target doesn't exist */
    updateComment(comment: Server.Comment) {
        let caCom = new CafeComment()
        caCom.data = comment;
        this.displayedComments.set(comment.CommentId, caCom)
    }
    
    /** Removes and resorts all CafeComments on the page according to the user's settings */
    resortComments() {
        this.data = []
        // TODO: Resort comments
    }
    
    /** Saves previous settings and calls resortComments */
    updateFromSettings(settings: CafeSettings) {
        this.lastSettings = this.commentSortSettings.data
        this.commentSortSettings.data = settings
        this.resortComments()
    }
}