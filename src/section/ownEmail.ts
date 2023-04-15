import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import { Client } from "../communication/CLIENT";
import { CafeDom } from "../util/cafeDom";


/**
 * OwnEmailSection is used as part of the OwnProfile display. It shows a users email and a 'change' button next to it. When change is clicked, a form appears where the user can enter their password and a new email, and attempt to change their email.
 * 
 */
export class OwnEmailSection extends CafeSection {
    email: HTMLDivElement;
    password: HTMLInputElement;
    newEmail: HTMLInputElement;
    changeButton: HTMLButtonElement;
    submitButton: HTMLButtonElement;
    passwordDiv: HTMLDivElement;
    emailDiv: HTMLDivElement;
    
    constructor(email?: string) {
        super()
        this.email = Dom.div()
        this.changeButton = CafeDom.formSubmitButtonSmall("Change email")

        // A div for displaying where they will enter their password.
        this.passwordDiv = Dom.div(undefined, undefined, {display:"none"})
        let passwordLabel = Dom.textEl("label", "Password")
        this.password = Dom.createInputElement("password")
        this.passwordDiv .append(passwordLabel, this.password)

        // A div for displaying where they will enter the new email.
        this.emailDiv = Dom.div(undefined, undefined, {display:"none"})
        let emailLabel = Dom.textEl("label", "New Email")
        this.newEmail = Dom.createInputElement("text")
        this.emailDiv.append(emailLabel, this.newEmail)

        // A button to submit.
        this.submitButton = CafeDom.formSubmitButtonSmall("Submit")
        this.submitButton.style.display = "none"

        this.el.append(this.email, this.changeButton, this.passwordDiv, this.emailDiv, this.submitButton)

        this.update(email)

        this.clickListen(this.changeButton, this.changeButtonClicked, true)
        this.clickListen(this.submitButton, this.submitButtonClicked, true)
        
    }
    
    update(email?:string) {
        if(email != undefined) {
            this.email.textContent = email;
        }
    }
    
    changeButtonClicked() {
        if(this.submitButton.style.display == "none") {
            this.emailDiv.style.display = "block"
            this.newEmail.value = ""
            this.passwordDiv.style.display = "block"
            this.password.value = ""
            this.submitButton.style.display = "block"
        } else {
            this.emailDiv.style.display = "none"
            this.passwordDiv.style.display = "none"
            this.submitButton.style.display = "none"
        }
    }

    submitButtonClicked() {
        let cemail : Client.ChangeEmail = {
            NewEmail: this.newEmail.value,
            Password: this.password.value
        }
        let event = new CustomEvent<Client.ChangeEmail>("changeEmail", {
            detail: cemail
        })
        document.dispatchEvent(event)
        this.changeButtonClicked()
    }
}