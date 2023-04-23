import { Client } from "../communication/CLIENT";
import { Server } from "../communication/SERVER";
import { CafeDom } from "../util/cafeDom";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

import "./feedback.css"

const CSS = {
    container: 'ui-feedback-container',
    header: {
        container: 'ui-feedback-header-container'
    },
    content: 'ui-feedback-content-container'
}

export class CafeFeedback extends UIInput<Server.FeedbackRecord> {
    
    header: {
        feedbackType : HTMLDivElement
        username     : HTMLDivElement
        time         : HTMLDivElement
        container    : HTMLDivElement
    }
    
    content    : HTMLDivElement
    hideButton : HTMLButtonElement
    isHidden   : boolean
    
    constructor(data: Server.FeedbackRecord) {
        super(data, "div")
        this.el.classList.add(CSS.container)
        
        let date = new Date(data.SubmittedAt)
        let date_formatted = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        
        this.isHidden = data.Hide
        if (this.isHidden)
            this.strikeThrough()
        
        this.header = {
            feedbackType : Dom.div(data.FeedbackType.toUpperCase()),
            username     : Dom.div(data.Username),
            time         : Dom.div(date_formatted),
            container    : Dom.div('', CSS.header.container)
        }
        
        this.header.container.append(
            this.header.feedbackType,
            this.header.username,
            this.header.time
        )
        
        this.content = Dom.div(data.Content, CSS.content)
        this.hideButton = CafeDom.textLink(Dom.button("Hide this feedback"), {})
        
        this.el.append(
            this.header.container,
            this.content,
            this.hideButton
        )
        
        this.eventman.watchEventListener('click', this.hideButton, this.hideButtonClicked)
        
        /*

        
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

        //this.clickListen(this.hideButton, this.hideButtonClicked, true)
        this.eventman.watchEventListener('click', this.hideButton, this.hideButtonClicked)
        
        this.el.append(this.id, this.submittedAt, this.feedbackType, this.userId, this.username, this.content, this.controls)
        */
    }

    private strikeThrough() {
        this.content.style.textDecoration = "line-through"
        this.content.style.color = "red"
    }
    
    private unstrike() {
        this.content.style.textDecoration = "none"
        this.content.style.color = "black"
    }
    
    private hideButtonClicked() {
        if(this.isHidden == true) {
            this.isHidden = false 
            this.unstrike()
        } else {
            this.isHidden = true 
            this.strikeThrough()
        }
        let hidereq : Client.ToggleFeedbackHidden = {
            ID: this.data!.ID,
            SetHiddenTo: this.isHidden
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