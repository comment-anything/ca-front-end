import { Client } from "../CLIENT"
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
    username                : HTMLInputElement
    password                : HTMLInputElement
    submitLoginButton       : HTMLButtonElement
    forgotPasswordButton    : HTMLButtonElement
    constructor() {
        super(CSS.windowName, 'Login')
        this.username = Dom.createInputElement("text", CSS.inputField)
        this.password = Dom.createInputElement('password', CSS.inputField)
        this.submitLoginButton = Dom.button('Login', CSS.button)
        this.forgotPasswordButton = Dom.button('Forgot_Password', CSS.button)

        this.submitLoginButton.addEventListener("click", this.submitLoginClicked.bind(this))
        this.forgotPasswordButton.addEventListener("click", this.submitLoginClicked.bind(this))

        this.el.append(
            Dom.createContainerWithLabel('Username', CSS.inputLabel, "div", this.username, CSS.inputSection),
            Dom.createContainerWithLabel('Password', CSS.inputLabel, "div", this.password, CSS.inputSection),
            this.submitLoginButton,
            this.forgotPasswordButton
        )
    }
    
    // A Register entity will be dispatched to the document global, and Cafe will ultimately send the data in that event to the server to attempt a registration.
    submitLoginClicked(): void {
        let login: Client.Login = {
            Username: this.username.value,
            Password: this.password.value,
        }
        let event = new CustomEvent<Client.Login>("login", {detail:login})
        document.dispatchEvent(event)
        
    }
    forgotPasswordClicked(): void {
        let Forgot_Password: Client.Forgot_Password = {
            Username: this.username.value,
            Password: this.password.value,
        }
        let event = new CustomEvent<Client.Forgot_Password>("forgot password", {detail:Forgot_Password})
        document.dispatchEvent(event)
        
    }
}