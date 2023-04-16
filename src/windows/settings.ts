import { State } from "../State";
import { Dom } from "../util/dom";
import { CafeWindow } from "./base";
import { CafeOwnProfileDisplay } from "../ui/ownProfile";
import { NewFeedbackSection } from "../section/newFeedback";

/** CafeSettingsWindow displays user settings and provides options for the user to reset their password or verify their email.  */
export class CafeSettingsWindow extends CafeWindow {
    ownProfile          : CafeOwnProfileDisplay;
    newfeedbackSection  : NewFeedbackSection;

    constructor() {
        super("cafe-settings")
        this.ownProfile = new CafeOwnProfileDisplay(undefined)

        this.newfeedbackSection = new NewFeedbackSection()

        this.el.append(this.ownProfile.el, this.newfeedbackSection.el)
    }
}