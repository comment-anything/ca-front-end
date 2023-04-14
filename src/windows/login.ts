import { Client } from "../communication/CLIENT"
import { CafeDom } from "../util/cafeDom"
import { Dom } from "../util/dom"
import { CafeWindow } from "./base"
import { State } from "../State"

import "./login.css"

const CSS = {
    windowName : "cafe-login-window",
    inputSection: "cafe-window-input-section",
    inputField: "cafe-window-input-field",
    inputLabel: "cafe-window-input-label",
    button: "cafe-window-button"
}


export class CafeLoginWindow extends CafeWindow {
    username                : HTMLInputElement
    password                : HTMLInputElement
    submitLoginButton       : HTMLButtonElement
    forgotPasswordButton    : HTMLButtonElement
    
    constructor() {
        super(CSS.windowName, 'Login')
        
        this.username = Dom.createInputElement("text")
        this.password = Dom.createInputElement('password')
        this.submitLoginButton = Dom.button('Login')
        this.forgotPasswordButton = Dom.button('Forgot Password', CSS.button)

        this.submitLoginButton.addEventListener("click", this.submitLoginClicked.bind(this))
        this.forgotPasswordButton.addEventListener("click", this.forgotPasswordClicked.bind(this))
        
        this.el.append(
            CafeDom.fullSizeGenericTextInput(this.username, {label: "Username"}),
            CafeDom.fullSizeGenericTextInput(this.password, {label: "Password"}),
            CafeDom.formSubmitButton(this.submitLoginButton, {label: "Login"}),
            CafeDom.formSubmitButton(this.forgotPasswordButton, {label: "Forgot Password"})
        )
        
        /*
        this.el.append(
            
            Dom.createContainerWithLabel('Username', CSS.inputLabel, "div", this.username, CSS.inputSection),
            Dom.createContainerWithLabel('Password', CSS.inputLabel, "div", this.password, CSS.inputSection),
            this.submitLoginButton,
            this.forgotPasswordButton
        )
        */
    }
    
    /**
     * Will result in sending a Login entity to the server containing username and password login information.
     */
    submitLoginClicked(): void {
        let login: Client.Login = {
            Username: this.username.value,
            Password: this.password.value,
        }
        let event = new CustomEvent<Client.Login>("login", {detail:login})
        document.dispatchEvent(event)
        
    }
    
    forgotPasswordClicked(): void {
        let event = new CustomEvent<Partial<State>>("StateChangeRequest", {
            detail: {viewing: "forgotpassword"}
        })
        document.dispatchEvent(event)
    }
}