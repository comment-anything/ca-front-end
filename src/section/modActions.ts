import { Client } from "../CLIENT";
import { CafeFeedback } from "../ui/feedback";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import { Server } from "../SERVER";

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
}

export class ModActionsReportSection  extends CafeSection {
    dropDownContainer: HTMLDivElement;
    //modRecords : Map<number, CafeModRecordDisplay>;
    requestModRecordsButton : HTMLButtonElement;
    clearModActionsButton : HTMLButtonElement;
    constructor() {
        super()
        let sectionLabel = Dom.div("Moderator Actions", CSS.sectionLabel)
        this.requestModRecordsButton = Dom.button("Request Actions")
        this.clearModActionsButton = Dom.button("Clear Actions")
        this.dropDownContainer = Dom.div()

        let requestContainer = Dom.div()

        
        requestContainer.append(
            this.requestModRecordsButton,
            this.clearModActionsButton
        )

        this.dropDownContainer.append(requestContainer)


        this.el.append(sectionLabel, this.dropDownContainer)

        this.clickListen(sectionLabel, this.toggleFold, true)
    }

    toggleFold() {
        if(this.dropDownContainer.style.display == "none") {
            this.dropDownContainer.style.display = "block"
        } else {
            this.dropDownContainer.style.display = "none"
        }
    }
}