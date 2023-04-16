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
export class AssignGlobalModSection extends CafeSection {
    container: HTMLDivElement;
    assignTo: HTMLInputElement;
    assignButton: HTMLButtonElement;
    removeFrom: HTMLInputElement;
    removeButton: HTMLButtonElement;
    constructor() {
        super(undefined)
        let sectionLabel = Dom.div("Assign Global Mod", CSS.sectionLabel)
        sectionLabel.title = "Assign and remove global moderators."
        this.container = Dom.div()

        let assignContainer = Dom.div(undefined, CSS.containers)
        let prespan1 = Dom.span("Grant global mod to ")
        this.assignTo = Dom.createInputElement("text", CSS.shortText)
        this.assignTo.title = "The user who will be granted global mod permissions."
        let postspan1 = Dom.span(".")
        this.assignButton = Dom.button("Grant", CSS.inlinebut)
        assignContainer.append(prespan1, this.assignTo, postspan1, this.assignButton)
        this.assignButton.title = "Grant global moderator priviledges to a user."

        let removeContainer = Dom.div(undefined, CSS.containers)
        let prespan2 = Dom.span("Remove global mod from ")
        this.removeFrom = Dom.createInputElement("text", CSS.shortText)
        this.removeFrom.title = "The user from whom global mod permissions will be removed."
        let postspan2 = Dom.span(".")
        this.removeButton = Dom.button("Remove", CSS.inlinebut)
        removeContainer.append(prespan2, this.removeFrom, postspan2, this.removeButton)
        this.removeButton.title = "Remove global moderator priviledges from a user."

        this.container.append(assignContainer, removeContainer)

        this.el.append(sectionLabel, this.container)
        this.eventman.watchEventListener('click', sectionLabel, this.toggleFold, true)
        this.eventman.watchEventListener('click', this.assignButton, this.assignGlobalClicked, true)
        this.eventman.watchEventListener('click', this.removeButton, this.removeGlobalClicked, true)
    }

    /** Toggles whether the section is folder, by clicking on the section header. */
    toggleFold() {
        if(this.container.style.display == "none") {
            this.container.style.display = "block"
        } else {
            this.container.style.display = "none"
        }
    }

    assignGlobalClicked() {
        document.dispatchEvent(new CustomEvent<Client.AssignGlobalModerator>("assignGlobalModerator", {
            detail: {
                User: this.assignTo.value,
                IsDeactivation: false
            }
        }))

    }
    removeGlobalClicked() {
        document.dispatchEvent(new CustomEvent<Client.AssignGlobalModerator>("assignGlobalModerator", {
            detail: {
                User: this.removeFrom.value,
                IsDeactivation: true
            }
        }))

    }
}