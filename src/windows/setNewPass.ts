import { Client } from "../communication/CLIENT"
import { Dom } from "../util/dom"
import { CafeWindow } from "./base"
import { Server } from "../communication/SERVER"
import { State } from "../State"



const CSS = {
    windowName : "cafe-new-password-window",
    inputSection: "cafe-window-input-section",
    inputField: "cafe-window-input-field",
    inputLabel: "cafe-window-input-label",
    button: "cafe-window-button"
}



export class CafeNewPasswordWindow extends CafeWindow {
    
    email         : HTMLInputElement
    code          : HTMLInputElement
    newPassword   : HTMLInputElement
    reNewPassword : HTMLInputElement
    submitButton  : HTMLButtonElement
    innerMessage: HTMLDivElement
    
    constructor() {
        super(CSS.windowName, 'NewPassword')
        this.innerMessage = Dom.div();
        this.email = Dom.createInputElement('email', CSS.inputField)
        this.code = Dom.createInputElement('text', CSS.inputField)
        this.newPassword = Dom.createInputElement('password', CSS.inputField)
        this.reNewPassword = Dom.createInputElement('password', CSS.inputField)
        this.submitButton = Dom.button('Submit new password', CSS.button)
        
        this.submitButton.addEventListener("click", this.submitButtonClicked.bind(this))
        
        this.el.append(
            this.innerMessage,
            Dom.createContainerWithLabel('Email', CSS.inputLabel, "div", this.email, CSS.inputSection),
            Dom.createContainerWithLabel('Code', CSS.inputLabel, "div", this.code, CSS.inputSection),
            Dom.createContainerWithLabel('New password', CSS.inputLabel, "div", this.newPassword, CSS.inputSection),
            Dom.createContainerWithLabel('Retype password', CSS.inputLabel, "div", this.reNewPassword, CSS.inputSection),
            this.submitButton
        )
    }
    
    /** Dom.createContainerWithLabel('Email', CSS.inputLabel, "div", this.email, CSS.inputSection), A SetNewPass entity will be dispatched to the document global, and Cafe will ultimately send the data in that event to the server to attempt a passwordReset. */
    submitButtonClicked(): void {
        console.log("👶 submit new pass clicked");
        let code = Number(this.code.value);
        if ( !isNaN(code) ) {
            let newpass: Client.SetNewPass = {
                Email: this.email.value,
                Code: code,
                Password: this.newPassword.value,
                RetypePassword: this.reNewPassword.value
            }
            let event = new CustomEvent<Client.SetNewPass>("newPassword", {detail:newpass})
            document.dispatchEvent(event) 
        }
    }
    /** 
     * Called by dispatcher when a Server.NewPassResponse is received. May cause a state change request to emit if the password was succesfully changed.
     */
    parseNewPassResponse(response: Server.NewPassResponse) {
        if(response.Success == true) {
            let event = new CustomEvent<Partial<State>>("StateChangeRequest", {detail:{
                viewing:"login"}
            })
            document.dispatchEvent(event)
            this.innerMessage.textContent = ""
        } else {
            this.innerMessage.textContent = response.Text
        }
    }
}