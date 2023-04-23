import { Client } from "../communication/CLIENT";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import { Server } from "../communication/SERVER";
import { CafeCommentReportDisplay } from "../ui/commentReport";
import { CafeDom } from "../util/cafeDom";

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    inputLabel : "section-input-label-medium"
}

/** CommentReportsSection is part of CafeModerationWindow. It is responsible for displaying comment reports to moderators. */
export class CommentReportsSection extends CafeSection {
    displayedReports  : Map<number, CafeCommentReportDisplay>
    viewReportsButton : HTMLButtonElement
    dropDownContainer : HTMLDivElement;
    
    // domain mod select box
    // global mod text input
    
    constructor() {
        super()
        
        let sectionLabel = Dom.div("Comment Reports", CSS.sectionLabel)
        this.displayedReports = new Map<number, CafeCommentReportDisplay>()
        this.viewReportsButton = CafeDom.formSubmitButtonCenteredBlock("View Reports")
        this.dropDownContainer = Dom.div()
        
        this.dropDownContainer.append(
            this.viewReportsButton
        )
        
        this.eventman.watchEventListener('click', sectionLabel, this.toggleFold, true)
        this.eventman.watchEventListener('click', this.viewReportsButton, this.viewReportsClicked, true)
        
        this.el.append(
            sectionLabel,
            this.dropDownContainer
        )
        
    }
    
    /** A list of CommentReports is received from the server.
     *  Creates an instance of CafeCommentReportDisplay for each CommentReport after destroying the ones currently visible.
     */
    populateCommentReports(data: Server.CommentReport[]) {
        
        this.clearCommentReports()
        
        for (let d of data) {
            this.updateCommentReport(d)
        }
        
    }
    
    /** User clicks the button to view reported comments.
     *  A ViewCommentReports object is dispatched to the server.
     */
    viewReportsClicked() {
        let data: Client.ViewCommentReports = {
            Domain: "all"
        }
        
        let ev = new CustomEvent<Client.ViewCommentReports>("viewCommentReports", {
            detail: data
        })
        
        document.dispatchEvent(ev)
    }
    
    /** CafeCommentReportDisplay is updated with the most recent comment report data */
    updateCommentReport(report: Server.CommentReport) {
        
        // Try to retrieve an existing report to update
        let existingReport = this.displayedReports.get(report.ReportId)
        console.log("💩", report)
        
        if (existingReport == undefined) {
            // Create a new report if it doesn't exist
            let newToAdd = new CafeCommentReportDisplay(report)
            this.displayedReports.set(report.ReportId, newToAdd)
            
            // Add the report to the Comment Reports dropdown container
            this.dropDownContainer.append(newToAdd.el)
        }
        else {
            // Update the report if it already exists
            existingReport.update(report)
        }
    }
    
    /** All instances of CafeCommentReportDisplay is destroyed */
    clearCommentReports() {
        for(let report of this.displayedReports.values()) {
            report.destroy()
        }
        this.displayedReports.clear()
    }
    
    toggleFold() {
        if(this.dropDownContainer.style.display == "none") {
            this.dropDownContainer.style.display = "block"
        } else {
            this.dropDownContainer.style.display = "none"
        }
    }
    
}