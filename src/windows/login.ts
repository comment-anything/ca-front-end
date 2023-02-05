
import { Dom } from "../util/dom"
import { CafeWindow } from "./base"

import "./login.css"

const CSS = {
    windowName : "cafe-login-window",
    inputSection: "cafe-window-input-section",
    inputField: "cafe-window-input-field",
    inputLabel: "cafe-window-input-label",
    button: "cafe-window-button"
}

export class CafeLoginWindow extends CafeWindow {
    username             : HTMLInputElement
    password             : HTMLInputElement
    submitLoginButton    : HTMLButtonElement
    forgotPasswordButton : HTMLButtonElement
    
    constructor() {
        super(CSS.windowName, 'Login')
        
        this.username = Dom.createInputElement('text', CSS.inputField)
        this.password = Dom.createInputElement('password', CSS.inputField)
        this.submitLoginButton = Dom.button("Login", CSS.button)
        this.forgotPasswordButton = Dom.button("Forgot Password", CSS.button)
        
        this.el.append(
            Dom.createContainerWithLabel("Username", CSS.inputLabel, "div", this.username, CSS.inputSection),
            Dom.createContainerWithLabel("Password", CSS.inputLabel, "div", this.password, CSS.inputSection),
            this.submitLoginButton,
            this.forgotPasswordButton
        )
        
    }
    
}