import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import { Client } from "../communication/CLIENT";
import { CafeDom } from "../util/cafeDom";

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    inputLabel : "section-input-label-medium",
}

export class BanUserSection extends CafeSection {
    dropDownContainer: HTMLDivElement;
    
    input: {
        target : HTMLInputElement
        reason : HTMLInputElement
        domain : HTMLInputElement
        banned : HTMLInputElement
    }
    
    sendBanButton: HTMLButtonElement;
    
    constructor() {
        super()
        let sectionLabel = Dom.div("Ban Users", CSS.sectionLabel)
        sectionLabel.title = "Ban users from domains or globally."

        this.dropDownContainer = Dom.div()
        
        this.input = {
            target : Dom.createInputElement("text"),
            reason : Dom.createInputElement("text"),
            domain : Dom.createInputElement("text"),
            banned : Dom.createInputElement("checkbox")
        }
        
        this.sendBanButton = Dom.button('Ban User')
        
        this.dropDownContainer.append(
            CafeDom.fullSizeGenericTextInput(this.input.target, {label: "User", hint: "Input the username who will be banned/unbanned."}),
            CafeDom.fullSizeGenericTextInput(this.input.domain, {label: "Domain", hint: "Input the domain the user will be banned/unbanned from. If blank, it will be an attempt to ban/unban globally."}),
            CafeDom.fullSizeGenericTextInput(this.input.reason, {label: "Reason", hint: "Please provide a reason for the ban/unban."}),
            CafeDom.genericCheckBoxInput(this.input.banned, {label: "Banned?", hint: "Send the request to ban/unban a user."}),
            this.sendBanButton
        )
        
        this.el.append(sectionLabel, this.dropDownContainer)
        this.eventman.watchEventListener('click', sectionLabel, this.toggleFold, true)
        this.eventman.watchEventListener('click', this.sendBanButton, this.banButtonClicked, true)
        
        /*
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
        this.eventman.watchEventListener('click', sectionLabel, this.toggleFold, true)
        this.eventman.watchEventListener('click', this.sendBanButton, this.banButtonClicked, true)
        */
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
                Username: this.input.target.value,
                Reason: this.input.reason.value,
                Domain: this.input.domain.value,
                Ban: this.input.banned.checked
            }
        })
        document.dispatchEvent(ev);
    }
}