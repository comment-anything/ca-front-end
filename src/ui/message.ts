import { Server } from "../communication/SERVER";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

import "./message.css"

const CSS = {
    main: 'main-message-layout',
    message: {
        generic : "server-message",
        success : "server-message-success-true",
        failure : "server-message-success-false"
    },
    fun: {
        dude         : "comment-dude",
        speechBubble : "dude-speech-bubble-area",
        speechArrow  : "dude-speech-bubble-arrow",
        speechBubbleFull : "dude-speech-bubble-full"
    }

}

export class CafeMessageDisplay extends UIInput<Server.Message> {

    displayedText    : HTMLDivElement
    speechBubbleArea : HTMLDivElement
    
    constructor() {
        super({ Success:true, Text:"Welcome" })
        this.el.classList.add(CSS.main)
        
        let dude = Dom.div('', CSS.fun.dude)
        let bubarrow = Dom.div('', CSS.fun.speechArrow)
        let fullSpeechBubble = Dom.div('', CSS.fun.speechBubbleFull)
        
        this.speechBubbleArea = Dom.div('', CSS.fun.speechBubble)
        this.speechBubbleArea.title = "Messages from the server will appear in this speech bubble."
        this.displayedText = Dom.div(undefined, CSS.message.generic)
        
        this.speechBubbleArea.append(this.displayedText)
        fullSpeechBubble.append(bubarrow, this.speechBubbleArea)
        
        this.el.append(
            dude,
            fullSpeechBubble
        )
        
        this.displayedText.classList.add(CSS.message.success)
        this.updateMessage(this.data)
    }
    
    // updateMessage changes the message which is shown.
    updateMessage(d?: Server.Message) {
        if(d != undefined) {
            
            this.speechBubbleArea.removeChild(this.displayedText)
            this.speechBubbleArea.append(this.displayedText)
            
            if(d.Success) {
                this.displayedText.classList.remove(CSS.message.failure)
                this.displayedText.classList.add(CSS.message.success)
            } else {
                this.displayedText.classList.remove(CSS.message.success)
                this.displayedText.classList.add(CSS.message.failure)
            }
            
            this.displayedText.textContent = d.Text
            this.data = d
        }
    }
    
    // clearMessage clears the currently displayed message.
    clearMessage() {
        this.updateMessage({ Success:true, Text: "" })
    }
}