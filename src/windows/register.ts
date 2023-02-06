import { Client } from "../CLIENT"
import { Dom } from "../util/dom"
import { CafeWindow } from "./base"

const CSS = {
    inputSection: "cafe-window-input-section",
    inputField: "cafe-window-input-field",
    inputLabel: "cafe-window-input-label",
    button: "cafe-window-button"
}


export class CafeRegisterWindow extends CafeWindow {
    username       : HTMLInputElement
    password       : HTMLInputElement
    rePassword     : HTMLInputElement
    email          : HTMLInputElement
    agreedToTerms  : HTMLInputElement
    submitRegister : HTMLButtonElement
    
    constructor() {
        super('cafe-register-window', 'Register')
        this.username = Dom.createInputElement("text", CSS.inputField)
        this.password = Dom.createInputElement('password', CSS.inputField)
        this.rePassword = Dom.createInputElement('password', CSS.inputField)
        this.email = Dom.createInputElement('email', CSS.inputField)
        this.agreedToTerms = Dom.createInputElement('checkbox', CSS.inputField)
        this.submitRegister = Dom.button('Register', CSS.button)

        this.submitRegister.addEventListener("click", this.submitRegisterClicked.bind(this))

        this.el.append(
            Dom.createContainerWithLabel('Username', CSS.inputLabel, "div", this.username, CSS.inputSection),
            Dom.createContainerWithLabel('Password', CSS.inputLabel, "div", this.password, CSS.inputSection),
            Dom.createContainerWithLabel('Retype Password', CSS.inputLabel, "div", this.rePassword, CSS.inputSection),
            Dom.createContainerWithLabel('Email', CSS.inputLabel, "div", this.email, CSS.inputSection),
            Dom.createContainerWithLabel('Agree to Terms', CSS.inputLabel, "div", this.agreedToTerms, CSS.inputSection),
            this.submitRegister
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