import { Server } from "../communication/SERVER"
import { UIInput } from "./base"
import { Dom } from "../util/dom"
import { CafeDom } from "../util/cafeDom"

import "./commentReport.css"
import { Client } from "../communication/CLIENT"

const CSS = {
    container: 'ui-report-container',
    reportHeader: {
        state: 'comment-report-header-state',
        timeReported: 'comment-report-header-time-reported',
        domain: 'comment-report-header-domain',
        container: 'comment-report-header-container'
    },
    buttons: {
        button: 'comment-report-button',
        container: 'comment-report-buttons-container'
    },
    parentContainer: 'comment-report-parent-container',
    subParentContainer: 'ui-report-sub-parent-container',
    content: {
        username: 'comment-report-username',
        infoBlock: 'comment-report-info-block'
    },
    moderate: {
        reasonLabel: 'comment-report-action-reason-label',
        reasonTextBox: 'comment-report-action-reason-textbox'
    }
}

/** Displays data for a single CommentReport */
export class CafeModActionDisplay extends UIInput<Server.ModRecord> {
    
    // DIV elements for the CommentReport's header
    actionLabel       : HTMLDivElement
    timeReported      : HTMLDivElement
    domainLabel       : HTMLDivElement
    
    // Buttons to toggle between the 3 section containers
    contentButton  : HTMLButtonElement
    reasonButton   : HTMLButtonElement
    moderateButton : HTMLButtonElement
    
    // The 3 main containers
    contentContainer  : HTMLDivElement
    reasonContainer   : HTMLDivElement
    moderateContainer : HTMLDivElement
    
    // DIV elements for the "content" container
    reportedUsername  : HTMLDivElement
    reportedContent   : HTMLDivElement
    
    // DIV elements for the "details" container
    reasonReported    : HTMLDivElement
    reportingUsername : HTMLDivElement
    
    // Input elements for the "moderate" container
    actionReason : HTMLDivElement
    modUsername  : HTMLDivElement
    
    
    
    constructor(data: Server.ModRecord) {
        super(data, "div");
        this.el.classList.add(CSS.container)
        
        // HEADER CONTAINER
        this.actionLabel = Dom.textEl("div", "", CSS.reportHeader.state)
        this.timeReported = Dom.textEl("div", "", CSS.reportHeader.timeReported)
        this.domainLabel = Dom.textEl("div", "", CSS.reportHeader.domain)
        
        let headerContainer = Dom.div('', CSS.reportHeader.container)
        
        headerContainer.append(
            this.actionLabel,
            this.timeReported,
            this.domainLabel
        )
        
        // BUTTON CONTAINER
        this.contentButton = Dom.button("Content", CSS.buttons.button)
        this.reasonButton = Dom.button("Reason", CSS.buttons.button)
        this.moderateButton = Dom.button("Moderate", CSS.buttons.button)
        
        let buttonsContainer = Dom.div('', CSS.buttons.container)
        
        buttonsContainer.append (
            this.contentButton,
            this.reasonButton,
            this.moderateButton
        )
        
        // PARENT CONTAINER
        
        this.contentContainer = Dom.div("")
        this.reasonContainer = Dom.div("")
        this.moderateContainer = Dom.div("")
        
        let parentContainer = Dom.div("", CSS.parentContainer)

        parentContainer.append(
            this.contentContainer,
            this.reasonContainer,
            this.moderateContainer
        )
        
        // CONTENT CONTAINER
        this.reportedUsername = Dom.div("", CSS.content.username)
        this.reportedContent = Dom.div("", CSS.content.infoBlock)
        
        this.contentContainer.append(
            this.reportedUsername,
            this.reportedContent
        )
        
        // REASON CONTAINER
        this.reportingUsername = Dom.div("", CSS.content.username)
        this.reasonReported = Dom.div("", CSS.content.infoBlock)
        
        this.reasonContainer.append(
            this.reportingUsername,
            this.reasonReported
        )
        
        // MODERATE CONTAINER
        this.modUsername = Dom.div("", CSS.content.username)
        this.actionReason = Dom.div("", CSS.content.infoBlock)
        
        this.moderateContainer.append(
            this.modUsername,
            this.actionReason
        )
        
        // Add click event listeners for the section buttons to show the appropriate section when clicked
        this.eventman.watchEventListener('click', this.contentButton, ()=>{ this.showContainer(this.contentContainer) })
        this.eventman.watchEventListener('click', this.reasonButton, ()=>{ this.showContainer(this.reasonContainer) })
        this.eventman.watchEventListener('click', this.moderateButton, ()=>{ this.showContainer(this.moderateContainer) })
       
        let lastContainer = Dom.div('', CSS.subParentContainer)
        lastContainer.append(headerContainer, parentContainer)
        
        // Overall append function
        this.el.append(
            buttonsContainer,
            lastContainer
        )
        
        // Update from CommentReport data
        if (this.data != undefined)
            this.update(this.data)
        
        // Show the content container by default.
        this.showContainer(this.contentContainer)

        // listen for event dispatch to submit moderation
        //this.clickListen(this.submitModerationButton, this.submitModerationButtonClicked, true)
    }
    
    /** Hides all containers, and then shows the specified one. */
    showContainer(container: HTMLDivElement) {
        this.contentContainer.style.display = "none"
        this.reasonContainer.style.display = "none"
        this.moderateContainer.style.display = "none"
        
        container.style.display = "block"
    }
    
    /** Updates the displayed data with a new CommentReport */
    update(data: Server.ModRecord) {
        
        let date = new Date(data.Time * 1000)
        let date_formatted = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        
        this.domainLabel.textContent = data.Domain
        this.timeReported.textContent = date_formatted
        
        // CONTENT SECTION
        this.reportedUsername.textContent = "Posted by \"" + data.Comment.Username + "\""
        this.reportedContent.textContent = data.Comment.Content
        
        // REASON SECTION
        this.reportingUsername.textContent = "Reported by \"" + data.ReportingUsername + "\""
        
        if (data.ReportReason != undefined)
            this.reasonReported.textContent = data.ReportReason
        else
            this.reasonReported.textContent = "No reason for report."
        
        // MODERATE SECTION
        this.modUsername.textContent = "Moderated by \"" + data.ModeratorUsername + "\""
        this.actionReason.textContent = data.Reason
        
        /*
        this.data = data
        
        // HEADER SECTION
        let actTakenStr: string
        
        if (data.ActionTaken) {
            actTakenStr = "Action Resolved"
            this.actionLabel.style.color = "green"
        }
        else {
            actTakenStr = "Pending Action"
            this.actionLabel.style.color = "red"
        }
        
        let date = new Date(data.TimeReported * 1000)
        let date_formatted = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        
        this.domainLabel.textContent = data.Domain
        this.actionLabel.textContent = actTakenStr
        this.timeReported.textContent = date_formatted
        
        // CONTENT SECTION
        this.reportedUsername.textContent = "Posted by \"" + data.CommentData.Username + "\""
        this.reportedContent.textContent = data.CommentData.Content
        
        // REASON SECTION
        this.reportingUsername.textContent = "Reported by \"" + data.ReportingUsername + "\""
        this.reasonReported.textContent = data.ReasonReported
        
        // MODERATE SECTION
        this.setHiddenTo.checked = data.CommentData.Hidden
        this.setRemovedTo.checked = data.CommentData.Removed
        */
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
    
}

