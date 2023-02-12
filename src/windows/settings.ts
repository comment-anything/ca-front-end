import { StateView } from "../State";
import { Dom } from "../util/dom";
import { CafeWindow } from "./base";
import { CafeOwnProfileDisplay } from "../ui/ownProfile";

/** CafeSettingsWindow displays user settings and provides options for the user to reset their password or verify their email.  */
export class CafeSettingsWindow extends CafeWindow {
    passwordResetButton: HTMLButtonElement;
    ownProfile: CafeOwnProfileDisplay;
    //CafeCommentSortDisplay commentSortSettings
    
    
    constructor() {
        super("cafe-settings")
        let header = Dom.textEl("h2", "About You")
        this.ownProfile = new CafeOwnProfileDisplay(undefined)
        this.passwordResetButton = Dom.button("Request password reset")

        this.passwordResetButton.addEventListener("click", this.passwordResetClicked.bind(this))


        this.el.append(header, this.ownProfile.el, this.passwordResetButton)
    }
    
    /** When the user clicks the password reset button, a password reset request will be dispatched to the server, the user will be logged out, and the password change state transition process will begin */
    passwordResetClicked() {
        let state_event = new CustomEvent<StateView>("StateChangeRequest", {detail:"forgotpassword"})
        document.dispatchEvent(state_event);
        
    }
}