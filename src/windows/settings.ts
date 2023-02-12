import { StateView } from "../State";
import { Dom } from "../util/dom";
import { CafeWindow } from "./base";
import { CafeOwnProfileDisplay } from "../ui/ownProfile";

/** CafeSettingsWindow displays user settings and provides options for the user to reset their password or verify their email.  */
export class CafeSettingsWindow extends CafeWindow {
    passwordResetButton: HTMLButtonElement;
    requestEmailValidation: HTMLButtonElement;
    verifyCodeSubmit: HTMLButtonElement;
    verifyCodeInput: HTMLInputElement;
    verifyEmailButton: HTMLButtonElement;
    ownProfile: CafeOwnProfileDisplay;
    //CafeCommentSortDisplay commentSortSettings


    constructor() {
        super("cafe-settings")
        this.ownProfile = new CafeOwnProfileDisplay(undefined)
        this.passwordResetButton = Dom.button("Request password reset")
        this.verifyEmailButton = Dom.button("Verify email")
        let verify_input_container = Dom.div()
        this.requestEmailValidation = Dom.button("Verify email")
        this.verifyCodeInput = Dom.createInputElement("text")
        this.verifyCodeSubmit = Dom.button("Submit code")
        verify_input_container.append(this.requestEmailValidation, this.verifyCodeInput, this.verifyCodeSubmit)

        this.verifyEmailButton.addEventListener("click", this.verifyEmailClicked.bind(this))
        this.passwordResetButton.addEventListener("click", this.passwordResetClicked.bind(this))

        this.el.append(this.ownProfile.el, this.passwordResetButton,
            this.requestEmailValidation,
            this.verifyCodeSubmit,
            this.verifyCodeInput,
            this.verifyEmailButton)
    }
    
    /** verifyEmailClicked Calls show() to show the validation code input window. */
    verifyEmailClicked() {
        if(this.verifyCodeSubmit.style.display == "none") {
            this.verifyCodeSubmit.style.display = "inline"
            this.verifyCodeInput.style.display = "inline"
            this.requestEmailValidation.style.display = "inline"
        } else {
            this.requestEmailValidation.style.display = "none"
            this.verifyCodeSubmit.style.display = "none"
            this.verifyCodeInput.style.display = "none"
        }
    }
    
    /** verifyCodeSubmitClicked Dispatch a Verify object to the server to verify the input code. */
    verifyCodeSubmitClicked() {

    }
    
    /** When the user clicks the password reset button, a password reset request will be dispatched to the server, the user will be logged out, and the password change state transition process will begin */
    passwordResetClicked() {
        let state_event = new CustomEvent<StateView>("StateChangeRequest", {detail:"forgotpassword"})
        document.dispatchEvent(state_event);
        
    }
}