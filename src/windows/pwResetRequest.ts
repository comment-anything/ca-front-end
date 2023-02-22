import { Client } from "../CLIENT"
import { Dom } from "../util/dom"
import { CafeWindow } from "./base"
import { StateView } from "../State"

import "./login.css"

const CSS = {
    windowName   : "cafe-pw-reset-window",
    inputField   : "cafe-window-input-field",
    inputLabel   : "cafe-window-input-label",
    inputSection : "cafe-window-input-section"
}


/** Displayed when the user transitions to the request password reset form state */
export class CafePwResetRequestWindow extends CafeWindow {
    email                      : HTMLInputElement
    submitPWResetRequestButton : HTMLButtonElement
    
    constructor() {
        super(CSS.windowName)
        this.email = Dom.createInputElement('email', CSS.inputField)
        this.submitPWResetRequestButton = Dom.button('Reset Password')
        
        this.submitPWResetRequestButton.addEventListener("click", this.submitButtonClicked.bind(this))
        
        this.el.append(
            Dom.createContainerWithLabel('Email', CSS.inputLabel, 'div', this.email, CSS.inputSection),
            this.submitPWResetRequestButton
        )
    }
    
    /**  */
    submitButtonClicked() {
        let pwReset: Client.PasswordReset = {
            Email: this.email.value
        }
        
        let event = new CustomEvent<Client.PasswordReset>('pwResetReq', {detail: pwReset})
        document.dispatchEvent(event);
        
        // TODO. Make sure there was a successful server response before traversing to the next page
        let event2 = new CustomEvent<StateView>("StateChangeRequest", {
            detail: "newPassword"
        })
        document.dispatchEvent(event2);
    }
}

