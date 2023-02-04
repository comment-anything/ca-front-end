
import { Client } from "./Client"
import { Fetcher, ClientMap } from "./Fetcher"


export class CafeWindow {
    element: HTMLDivElement
    
    show() {}
    hide() {}
}

export class CafeRegisterWindow extends CafeWindow {
    username       : HTMLInputElement
    password       : HTMLInputElement
    retypePassword : HTMLInputElement
    email          : HTMLInputElement
    agreedToTerms  : HTMLInputElement
    submitRegister : HTMLInputElement
    
    constructor() {
        super()
    }
    
    submitRegisterClicked(fetcher: Fetcher) {
        let register: Client.Register = {
            username: this.username.value,
            password: this.password.value,
            retypePassword: this.retypePassword.value,
            email: this.email.value,
            agreedToTerms: this.agreedToTerms.checked
        }
        
        fetcher.fetch("register")
    }
}


