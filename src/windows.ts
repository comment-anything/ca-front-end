
import { Dom } from './dom'
import { Client } from './client'
import { Fetcher } from './fetcher'

export class CafeWindow {
    window: HTMLDivElement
    
    constructor(id: string, title: string) {
        this.window = document.createElement('div')
        this.window.classList.add('cafe-window', 'section')
        this.window.id = id
        this.window.innerHTML = '<div class="section-title">' + title + '</div>'
        Dom.appendToApp(this.window)
    }
    
    show() {
        this.window.style.display = 'block'
    }
    
    hide() {
        this.window.style.display = 'none'
    }
}

export class CafeRegisterWindow extends CafeWindow {
    username       : HTMLInputElement
    password       : HTMLInputElement
    rePassword     : HTMLInputElement
    email          : HTMLInputElement
    agreedToTerms  : HTMLInputElement
    submitRegister : HTMLInputElement
    fetcher        : Fetcher
    
    constructor(fet: Fetcher) {
        super('cafe-register-window', 'Register')
        this.username = Dom.createInputField('form')
        this.password = Dom.createInputField('password')
        this.rePassword = Dom.createInputField('password')
        this.email = Dom.createInputField('email')
        this.agreedToTerms = Dom.createInputField('checkbox')
        this.submitRegister = Dom.createInputField('button')
        
        this.submitRegister.onclick = () => this.submitRegisterClicked()
        this.fetcher = fet
        let section: (HTMLElement | null) = document.getElementById('cafe-register-window')
        
        section?.appendChild(Dom.createInputFieldRow('Username', this.username))
        section?.appendChild(Dom.createInputFieldRow('Password', this.password))
        section?.appendChild(Dom.createInputFieldRow('Retype Password', this.rePassword))
        section?.appendChild(Dom.createInputFieldRow('Email', this.email))
        section?.appendChild(Dom.createInputFieldRow('Agree to Terms', this.agreedToTerms))
        section?.appendChild(Dom.createInputFieldRow('Register', this.submitRegister))
    }
    
    submitRegisterClicked(): void {
        
        let register: Client.Register = {
            Username: this.username.value,
            Password: this.password.value,
            RePassword: this.rePassword.value,
            Email: this.email.value,
            AgreedToTerms: this.agreedToTerms.checked
        }
        
        this.fetcher.fetch<'register'>('register', register, () => {})
        
    }
}

