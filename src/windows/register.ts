import { Client } from "../CLIENT"
import { Dom } from "../util/dom"
import { CafeWindow } from "./base"

export class CafeRegisterWindow extends CafeWindow {
    username       : HTMLInputElement
    password       : HTMLInputElement
    rePassword     : HTMLInputElement
    email          : HTMLInputElement
    agreedToTerms  : HTMLInputElement
    submitRegister : HTMLInputElement
    
    constructor() {
        super('cafe-register-window', 'Register')
        this.username = Dom.createInputField('form')
        this.password = Dom.createInputField('password')
        this.rePassword = Dom.createInputField('password')
        this.email = Dom.createInputField('email')
        this.agreedToTerms = Dom.createInputField('checkbox')
        this.submitRegister = Dom.createInputField('button')

        this.submitRegister.addEventListener("click", this.submitRegisterClicked.bind(this))

        let section: (HTMLElement | null) = document.getElementById('cafe-register-window')
        
        section?.appendChild(Dom.createInputFieldRow('Username', this.username))
        section?.appendChild(Dom.createInputFieldRow('Password', this.password))
        section?.appendChild(Dom.createInputFieldRow('Retype Password', this.rePassword))
        section?.appendChild(Dom.createInputFieldRow('Email', this.email))
        section?.appendChild(Dom.createInputFieldRow('Agree to Terms', this.agreedToTerms))
        section?.appendChild(Dom.createInputFieldRow('Register', this.submitRegister))
    }
    
    // A Register entity will be dispatched to the server containing the registration data.
    submitRegisterClicked(): void {
        let register: Client.Register = {
            Username: this.username.value,
            Password: this.password.value,
            RePassword: this.rePassword.value,
            Email: this.email.value,
            AgreedToTerms: this.agreedToTerms.checked
        }
        let event = new CustomEvent<Client.Register>("register", {detail:register})

        document.dispatchEvent(event)
        
    }
}