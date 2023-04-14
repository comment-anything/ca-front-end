import { State, StateView } from "../State";
import { Dom } from "../util/dom";
import { CafeWindow } from "./base";
import { CafeOwnProfileDisplay } from "../ui/ownProfile";
import { NewFeedbackSection } from "../section/newFeedback";
import { CafeCommentSortDisplay } from "../ui/commentSort";

/** CafeSettingsWindow displays user settings and provides options for the user to reset their password or verify their email.  */
export class CafeSettingsWindow extends CafeWindow {
    passwordResetButton : HTMLButtonElement;
    ownProfile          : CafeOwnProfileDisplay;
    newfeedbackSection  : NewFeedbackSection;
    //commentSortSettings : CafeCommentSortDisplay
    
    
    
    constructor() {
        super("cafe-settings")
        let header = Dom.textEl("h2", "About You")
        this.ownProfile = new CafeOwnProfileDisplay(undefined)
        this.passwordResetButton = Dom.button("Request password reset")

        this.newfeedbackSection = new NewFeedbackSection()

        this.passwordResetButton.addEventListener("click", this.passwordResetClicked.bind(this))


        this.el.append(header, this.ownProfile.el, this.passwordResetButton, this.newfeedbackSection.el)
    }
    
    /** When the user clicks the password reset button, a password reset request chain will start */
    passwordResetClicked() {
        let state_event = new CustomEvent<Partial<State>>("StateChangeRequest", {detail:{
            viewing:"forgotpassword"}})
        document.dispatchEvent(state_event);
    }
}