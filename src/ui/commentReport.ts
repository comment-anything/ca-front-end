import { Server } from "../SERVER"
import { UIInput } from "./base"
import { Dom } from "../util/dom"

/** Displays data for a single CommentReport */
export class CafeCommentReportDisplay extends UIInput<Server.CommentReport> {
    comment : Server.Comment
    
    actionTaken       : HTMLDivElement
    reasonReported    : HTMLDivElement
    reportingUsername : HTMLDivElement
    timeReported      : HTMLDivElement
    
    contentButton  : HTMLButtonElement
    detailsButton  : HTMLButtonElement
    moderateButton : HTMLButtonElement
    
    setHiddenTo            : HTMLInputElement
    setRemovedTo           : HTMLInputElement
    reason                 : HTMLTextAreaElement
    submitModerationButton : HTMLButtonElement
    
    constructor(data: Server.CommentReport) {
        super(data, "div");
        
        this.comment = data.Comment
        this.actionTaken = Dom.textEl("td")
        this.reasonReported = Dom.textEl("td")
        this.reportingUsername = Dom.textEl("td")
        this.timeReported = Dom.textEl("td")
        
        this.update(data)
        
        this.contentButton = Dom.button("Content")
        this.detailsButton = Dom.button("Details")
        this.moderateButton = Dom.button("Moderate")
        
        this.setHiddenTo = Dom.createInputElement('checkbox')
        this.setRemovedTo = Dom.createInputElement('checkbox')
        this.reason = Dom.el("textarea")
        this.submitModerationButton = Dom.button("Confirm")
        
        this.el.append(
            this.actionTaken,
            this.reasonReported,
            this.reportingUsername,
            this.timeReported,
        )
    }
    
    /** Updates the displayed data with a new CommentReport */
    update(data: Server.CommentReport) {
        
        let actTakenStr = data.ActionTaken ? "Action Resolved" : "Pending Update"
        let date = new Date(data.TimeReported)
        let date_formatted = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        
        this.actionTaken.textContent = actTakenStr
        this.reasonReported.textContent = data.ReasonReported
        this.reportingUsername.textContent = data.ReportingUsername
        this.timeReported.textContent = date_formatted
    }
    
    /** The server will retrieve UserProfile data for the "reporting user"
     *  The CafeUserProfileDisplay will be populated with this information.
     *  The UserProfileDisplay will be moved to the mouse pointer location.
     */
    reportingUserClicked() {
        
    }
    
    /** The moderation controls become visible */
    moderateButtonClicked() {
        
    }
    
    /** The user clicks the submit button to apply all changes made regarding moderation.
     *  A Moderate object is dispatched to the server.
     */
    submitModerationButtonClicked() {
        
    }
}

