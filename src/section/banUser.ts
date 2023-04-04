import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import { Client } from "../communication/CLIENT";

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    inputLabel : "section-input-label-medium",
}

export class BanUserSection extends CafeSection {
    dropDownContainer: HTMLDivElement;
    targetUser: HTMLInputElement;
    reason: HTMLInputElement;
    domain: HTMLInputElement;
    ban: HTMLInputElement;
    sendBanButton: HTMLButtonElement;
    constructor() {
        super()
        let sectionLabel = Dom.div("Ban Users", CSS.sectionLabel)
        sectionLabel.title = "Ban users from domains or globally."

        this.dropDownContainer = Dom.div()

        this.targetUser = Dom.createInputElement("text");
        this.targetUser.title = "Input the username who will be banned/unbanned."
        this.reason = Dom.createInputElement("text")
        this.reason.title = "Please provide a reason for the ban/unban."
        this.domain = Dom.createInputElement("text")
        this.domain.title = "Input the domain the user will be banned/unbanned from. If blank, it will be an attempt to ban/unban globally."
        this.ban = Dom.createInputElement("checkbox")
        this.ban.title = "Whether to ban or unban a user. If checked, it is a ban. If unchecked, it is an unban."
        this.ban.checked = true;
        
        this.sendBanButton = Dom.button("Ban User");
        this.sendBanButton.title = "Send the request to ban/unban a user."

        this.dropDownContainer.append(
            Dom.createContainerWithLabel("User:", CSS.inputLabel, "div", this.targetUser),
            Dom.createContainerWithLabel("Domain:", CSS.inputLabel, "div", this.domain),
            Dom.createContainerWithLabel("Reason:", CSS.inputLabel, "div", this.reason),
            Dom.createContainerWithLabel("Ban:", CSS.inputLabel, "div", this.ban),
            this.sendBanButton
        )
        this.el.append(sectionLabel, this.dropDownContainer)
        this.clickListen(sectionLabel, this.toggleFold, true)
        this.clickListen(this.sendBanButton, this.banButtonClicked, true)
    }

    toggleFold() {
        if(this.dropDownContainer.style.display != "none") {
            this.dropDownContainer.style.display = "none"
        } else {
            this.dropDownContainer.style.display = "block"
        }
    }

    banButtonClicked() {
        let ev = new CustomEvent<Client.Ban>("ban", {
            detail: {
                Username: this.targetUser.value,
                Reason: this.reason.value,
                Domain: this.domain.value,
                Ban: this.ban.checked
            }
        })
        document.dispatchEvent(ev);
    }
}