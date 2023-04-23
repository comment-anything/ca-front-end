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
export class CafeCommentReportDisplay extends UIInput<Server.CommentReport> {
    data              : Server.CommentReport
    
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
    setHiddenTo            : HTMLInputElement
    setRemovedTo           : HTMLInputElement
    reason                 : HTMLTextAreaElement
    submitModerationButton : HTMLButtonElement
    
    
    
    constructor(data: Server.CommentReport) {
        super(data, "div");
        this.data = data
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
        this.setHiddenTo = Dom.createInputElement('checkbox')
        this.setRemovedTo = Dom.createInputElement('checkbox')
        this.reason = Dom.el("textarea", CSS.moderate.reasonTextBox)
        this.submitModerationButton = CafeDom.textLink(Dom.button("Confirm"), {})
        
        let hiddenCheckBox = CafeDom.genericCheckBoxInput(this.setHiddenTo, {label: "Flag Hidden?"})
        let removeCheckBox = CafeDom.genericCheckBoxInput(this.setRemovedTo, {label: "Flag Removal?"})
        let actionReasonLabel = Dom.textEl('label', 'Reason for your action', CSS.moderate.reasonLabel)
        
        this.moderateContainer.append(
            hiddenCheckBox,
            removeCheckBox,
            CafeDom.genericTextAreaInput(this.reason, this.submitModerationButton, {label: "Reason for your action"})
            /*
            actionReasonLabel,
            this.reason,
            this.submitModerationButton
            */
        )
        
        // Add click event listeners for the section buttons to show the appropriate section when clicked
        this.eventman.watchEventListener('click', this.contentButton, ()=>{ this.showContainer(this.contentContainer) })
        this.eventman.watchEventListener('click', this.reasonButton, ()=>{ this.showContainer(this.reasonContainer) })
        this.eventman.watchEventListener('click', this.moderateButton, ()=>{ this.showContainer(this.moderateContainer) })
        
        /*
        this.clickListen(this.contentButton, ()=>{ this.showContainer(this.contentContainer) })
        this.clickListen(this.reasonButton, ()=>{ this.showContainer(this.reasonContainer) })
        this.clickListen(this.moderateButton, ()=>{ this.showContainer(this.moderateContainer) })
        */
       
        let lastContainer = Dom.div('', CSS.subParentContainer)
        lastContainer.append(headerContainer, parentContainer)
        
        // Overall append function
        this.el.append(
            buttonsContainer,
            lastContainer
        )
        
        // Update from CommentReport data
        this.update(data)
        
        // Show the content container by default.
        this.showContainer(this.contentContainer)

        // listen for event dispatch to submit moderation
        this.eventman.watchEventListener('click', this.submitModerationButton, this.submitModerationButtonClicked)
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
    update(data: Server.CommentReport) {
        
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
        let moderate : Client.Moderate = {
            ReportID : this.data.ReportId,
            CommentID : this.data.CommentData.CommentId,
            SetHiddenTo : this.setHiddenTo.checked,
            SetRemovedTo : this.setRemovedTo.checked,
            Reason : this.reason.value
        }
        let event = new CustomEvent<Client.Moderate>("moderate", {
            detail: moderate
        })
        document.dispatchEvent(event)
        this.disable();
    }
}

