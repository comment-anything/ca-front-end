import { Client } from "../communication/CLIENT";
import { Server } from "../communication/SERVER";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

import "./table.css"

const CSS = {
    smallData : ["data-small-centered", "data-content-bordered"],
    dataContent: ["data-small-centered", "data-content-bordered"],
    smallerHeader: "header-small"
}

export class CafeFeedback extends UIInput<Server.FeedbackRecord> {
    id: HTMLTableCellElement;
    submittedAt: HTMLTableCellElement;
    feedbackType: HTMLTableCellElement;
    userId: HTMLTableCellElement;
    username: HTMLTableCellElement;
    content: HTMLTableCellElement;
    setToHidden: boolean
    controls: HTMLTableCellElement;
    hideButton: HTMLButtonElement;

    constructor(data: Server.FeedbackRecord) {
        super(data, "tr")
        
        let date = new Date(data.SubmittedAt)
        let date_formatted = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        
        this.id = Dom.textEl("td", data.ID.toString(), CSS.smallData)
        this.submittedAt = Dom.textEl("td", date_formatted, CSS.smallData)
        this.feedbackType = Dom.textEl("td", data.FeedbackType, CSS.smallData)
        this.userId = Dom.textEl("td", data.UserID.toString(), CSS.smallData)
        this.username = Dom.textEl("td", data.Username, CSS.smallData)
        this.content = Dom.textEl("td", data.Content, CSS.dataContent)
        
        if (data.Hide == true) {
            this.setToHidden = true
            this.strikeThrough()
        } else {
            this.setToHidden = false 
        }
        
        this.controls = Dom.el("td")
        this.hideButton = Dom.button("hide")
        this.hideButton.title = "Toggle whether this feedback is hidden and should be shown on future feedback requests."
        this.controls.append(this.hideButton)

        this.clickListen(this.hideButton, this.hideButtonClicked, true)
        
        this.el.append(this.id, this.submittedAt, this.feedbackType, this.userId, this.username, this.content, this.controls)
    }

    private strikeThrough() {
        this.id.style.textDecoration = "line-through"
        this.submittedAt.style.textDecoration = "line-through"
        this.feedbackType.style.textDecoration = "line-through"
        this.userId.style.textDecoration = "line-through"
        this.username.style.textDecoration = "line-through"
        this.content.style.textDecoration = "line-through"
    }
    
    private unstrike() {
        this.id.style.textDecoration = "none"
        this.submittedAt.style.textDecoration = "none"
        this.feedbackType.style.textDecoration = "none"
        this.userId.style.textDecoration = "none"
        this.username.style.textDecoration = "none"
        this.content.style.textDecoration = "none"

    }
    
    private hideButtonClicked() {
        if(this.setToHidden == true) {
            this.setToHidden = false 
            this.unstrike()
        } else {
            this.setToHidden = true 
            this.strikeThrough()
        }
        let hidereq : Client.ToggleFeedbackHidden = {
            ID: this.data!.ID,
            SetHiddenTo: this.setToHidden
        }
        let event = new CustomEvent<Client.ToggleFeedbackHidden>("toggleFeedbackHidden", {
            detail: hidereq
        })
        document.dispatchEvent(event)
    }
    
    static headerRow() {
        let tr = Dom.el("tr")
        let x = Dom.el("th")
        let fbid = Dom.textEl("th", "ID")
        let dt = Dom.textEl("th", "Time")
        let cat = Dom.textEl("th", "Type")
        let uid = Dom.textEl("th", "User ID")
        let unmae = Dom.textEl("th", "User")
        let content = Dom.textEl("th", "Feedback")
        let control = Dom.textEl("th", "Controls")
        tr.append(x, fbid, dt, cat, uid, unmae, content, control)
        return tr
    }
}