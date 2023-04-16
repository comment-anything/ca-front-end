import { Client } from "../communication/CLIENT";
import { CafeDom } from "../util/cafeDom";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";

/** 
 * ReportCommentSection is used for a user reporting a rule-violating comment. One is instanced for every CafeComment. 
 */
export class ReportCommentSection extends CafeSection {
    targetCommentID : number
    reportText: HTMLTextAreaElement;
    toggleButton: HTMLButtonElement;
    container: HTMLDivElement;
    submitReportButton: HTMLButtonElement;
    constructor(commentID: number) {
        super()
        this.targetCommentID = commentID

        this.toggleButton = CafeDom.textLink(Dom.button("Report"), {})

        this.container = Dom.div(undefined, undefined, {display:"none"})

        this.el.append(this.toggleButton, this.container)
        
        let label = Dom.textEl("label", "Report reason:", undefined, {display:"block"})
        this.reportText = Dom.el("textarea")
        this.submitReportButton = Dom.button("Submit Report")
        this.container.append(label, this.reportText, this.submitReportButton)

        this.eventman.watchEventListener('click', this.toggleButton, this.toggleFold)
        this.eventman.watchEventListener('click', this.submitReportButton, this.submitReport)
    }

    toggleFold() {
        if(this.container.style.display == "none") {
            this.container.style.display = "block"
        } else {
            this.container.style.display = "none"
        }
    }

    /** Dispatches a Client.PostCommentReport when user clicks 'submit' */
    submitReport() {
        if(this.reportText.value.length > 0) {
            let d : Client.PostCommentReport = {
                CommentID: this.targetCommentID,
                Reason : this.reportText.value
            }
    
            let ev = new CustomEvent<Client.PostCommentReport>(
                "newReport", {
                    detail: d
                }
            )
            document.dispatchEvent(ev)
            this.submitReportButton.disabled = true

        }

    }
}