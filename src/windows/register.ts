import { Client } from "../CLIENT"
import { Dom } from "../util/dom"
import { CafeDom } from "../util/cafeDom"
import { CafeWindow } from "./base"

import "./login.css"

const CSS = {
    windowName : "cafe-register-window",
    inputSection: "cafe-window-input-section",
    inputField: "cafe-window-input-field",
    inputLabel: "cafe-window-input-label",
    button: "cafe-window-button",
    textInputContainer: "login-register-text-input-container"
}


export class CafeRegisterWindow extends CafeWindow {
    username       : HTMLInputElement
    password       : HTMLInputElement
    rePassword     : HTMLInputElement
    email          : HTMLInputElement
    agreedToTerms  : HTMLInputElement
    submitRegister : HTMLButtonElement
    
    constructor() {
        super(CSS.windowName, 'Register')
        this.username = Dom.createInputElement("text")
        this.password = Dom.createInputElement('password')
        this.rePassword = Dom.createInputElement('password')
        this.email = Dom.createInputElement('email')
        this.agreedToTerms = Dom.createInputElement('checkbox', CSS.inputField)
        this.submitRegister = Dom.button('Register', CSS.button)
        
        this.submitRegister.addEventListener("click", this.submitRegisterClicked.bind(this))
        
        let textInputContainer = Dom.div(undefined, CSS.textInputContainer)
        
        textInputContainer.append(
            CafeDom.fullSizeGenericTextInput(this.email, {label: "Email"}),
            CafeDom.fullSizeGenericTextInput(this.username, {label: "Username"}),
            CafeDom.halfSizeGenericTextInput(this.password, {label: "Password"}),
            CafeDom.halfSizeGenericTextInput(this.rePassword, {label: "Confirm"})
        )
        
        this.el.append(
            /*
            Dom.createContainerWithLabel('Username', CSS.inputLabel, "div", this.username, CSS.inputSection),
            Dom.createContainerWithLabel('Password', CSS.inputLabel, "div", this.password, CSS.inputSection),
            Dom.createContainerWithLabel('Retype Password', CSS.inputLabel, "div", this.rePassword, CSS.inputSection),
            Dom.createContainerWithLabel('Email', CSS.inputLabel, "div", this.email, CSS.inputSection),
            Dom.createContainerWithLabel('Agree to Terms', CSS.inputLabel, "div", this.agreedToTerms, CSS.inputSection),
            this.submitRegister
            */
            textInputContainer
        )
    }
    
    // A Register entity will be dispatched to the document global, and Cafe will ultimately send the data in that event to the server to attempt a registration.
    submitRegisterClicked(): void {
        let register: Client.Register = {
            Username: this.username.value,
            Password: this.password.value,
            RetypePassword: this.rePassword.value,
            Email: this.email.value,
            AgreedToTerms: this.agreedToTerms.checked
        }
        
        let event = new CustomEvent<Client.Register>("register", {detail:register})
        document.dispatchEvent(event) 
    }
}