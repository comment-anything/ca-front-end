import { CafeDom } from "../util/cafeDom";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";

import { Client } from "../communication/CLIENT";


export class OwnProfileVerifySection extends CafeSection {
    
    isVerified : HTMLDivElement
    
    button : {
        request: HTMLButtonElement
        toggle : HTMLButtonElement
        submit : HTMLButtonElement
    }
    
    codeInput     : HTMLInputElement
    codeContainer : HTMLDivElement
    
    constructor(verified?: boolean) {
        super()
        this.isVerified = Dom.div()
        
        this.button = {
            request: CafeDom.formSubmitButtonSmall("Request code"),
            toggle : CafeDom.formSubmitButtonSmall("Enter code"),
            submit : CafeDom.formSubmitButtonSmall("Verify")
        }
        
        this.codeInput = Dom.createInputElement("text")
        this.codeContainer = CafeDom.fullSizeGenericTextInput(this.codeInput, {label: "Verification Code"})
        
        this.toggleView()
        this.eventman.watchEventListener('click', this.button.toggle, this.toggleView)
        
        this.el.append(
            this.isVerified,
            this.button.request,
            this.button.toggle,
            this.codeContainer,
            this.button.submit
        )
        this.update(verified)

        this.eventman.watchEventListener("click", this.button.request, this.requestClicked)
        this.eventman.watchEventListener("click", this.button.submit, this.submitClicked)
    }
    
    requestClicked() {
        let rqVerfiy : Client.RequestVerificationCode = {}
        let event = new CustomEvent<Client.RequestVerificationCode>("requestVerificationCode", {detail: rqVerfiy})
        document.dispatchEvent(event)
        /** fade button for a little while? */
    }
    
    submitClicked() {
        let code = Number(this.codeInput.value)
        if(!isNaN(code)) {
            let event = new CustomEvent<Client.InputVerificationCode>("inputVerificationCode", {
                detail: {
                    Code: code
                }
            })
            document.dispatchEvent(event)
        } else {
            this.codeInput.value = "0"
        }
    }
    
    toggleView() {
        if (this.button.submit.style.display == 'none') {
            this.button.submit.style.display = 'block'
            this.codeContainer.style.display = 'block'
        }
        else {
            this.button.submit.style.display = 'none'
            this.codeContainer.style.display = 'none'
        }
    }
    
    update(verified?: boolean) {
        if(verified) {
            this.isVerified.textContent = "yes"
            this.button.request.style.display = 'none'
            this.button.submit.style.display = 'none'
            this.button.toggle.style.display = 'none'
            this.codeContainer.style.display = 'none'
            
        } else {
            this.isVerified.textContent = "no"
            this.button.request.style.display = 'block'
            this.button.submit.style.display = 'block'
            this.button.toggle.style.display = 'block'
            this.codeContainer.style.display = 'block'
        }
    }
}

