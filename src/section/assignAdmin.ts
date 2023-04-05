import { Client } from "../communication/CLIENT";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";

import "./sectionGeneralCSS.css"

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    shortText: "input-text-narrow",
    inlinebut: "input-inline-button",
    containers: ["container-top-padded", "centered" ]
}

/**
 * Used to render the assign admin section which allows admins to assign and remove additional admins.
 * 
 */
export class AssignAdminSection extends CafeSection {
    container: HTMLDivElement;
    assignTo: HTMLInputElement;
    assignButton: HTMLButtonElement;
    constructor() {
        super(undefined)
        let sectionLabel = Dom.div("Assign Admin", CSS.sectionLabel)
        sectionLabel.title = "Assign and remove other administrators."
        this.container = Dom.div()

        let assignContainer = Dom.div(undefined, CSS.containers)
        let prespan1 = Dom.span("Grant admin priviledges to ")
        this.assignTo = Dom.createInputElement("text", CSS.shortText)
        this.assignTo.title = "The user to whom admin permissions will be granted."
        let postspan1 = Dom.span(".")
        this.assignButton = Dom.button("Grant", CSS.inlinebut)
        assignContainer.append(prespan1, this.assignTo, postspan1, this.assignButton)
        this.assignButton.title = "Grant admin priviledges to a user."

        this.container.append(assignContainer)

        this.el.append(sectionLabel, this.container)
        this.clickListen(sectionLabel, this.toggleFold, true)
        this.clickListen(this.assignButton, this.assignAdminClicked, true)
    }

    /** Toggles whether the section is folder, by clicking on the section header. */
    toggleFold() {
        if(this.container.style.display == "none") {
            this.container.style.display = "block"
        } else {
            this.container.style.display = "none"
        }
    }

    assignAdminClicked() {
        document.dispatchEvent(new CustomEvent<Client.AssignAdmin>("assignAdmin", {
            detail: {
                User: this.assignTo.value
            }
        }))
    }
}