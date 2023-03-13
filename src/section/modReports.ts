import { Client } from "../CLIENT";
import { CafeFeedback } from "../ui/feedback";
import { Dom } from "../util/dom";
import { CafeSection } from "./base";
import { Server } from "../SERVER";
import { CafeGlobalModDisplay } from "../ui/globalModDisplay";
import "./sendFeedback.css"

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    inputLabel : "section-input-label-medium",
    tnr : "times-new-roman",
    centeretnr : "centered-times-new-roman"
}

export class ModeratorsReportSection extends CafeSection {
    
    forDomainInput                : HTMLInputElement; 
    requestDomainModeratorsButton : HTMLButtonElement;
    requestGlobalModeratorsButton : HTMLButtonElement;
    domainModRecords              : Map<number, CafeDomainModDisplay>
    globalModRecords              : Map<number, CafeGlobalModDisplay>
    dropDownContainer             : HTMLDivElement;
    
    constructor(){
        super()
        let sectionLabel = Dom.div("Moderator Reports", CSS.sectionLabel)
        this.dropDownContainer = Dom.div()

        let requestContainer = Dom.div()
        
        this.forDomainInput = Dom.createInputElement("text", CSS.centeretnr)
        this.requestGlobalModeratorsButton = Dom.button("Global Assignments")
        this.requestDomainModeratorsButton = Dom.button("Domain Assignments")

        requestContainer.append(
            Dom.createContainerWithLabel("URL:", CSS.inputLabel, "div", this.forDomainInput),
            
            Dom.createContainer("div", CSS.tnr, this.forDomainInput),
                this.requestGlobalModeratorsButton,
                this.requestDomainModeratorsButton
            )
            
            this.dropDownContainer.append(requestContainer)
            this.el.append(sectionLabel, this.dropDownContainer)
            this.clickListen(sectionLabel, this.toggleFold, true)
    }
    
    hide(element:HTMLElement) {
        element.style.display = "none"
    }
    
    show(element:HTMLElement) {
        element.style.display = "block"
    }
    
    hideAll() {
        this.hide(this.forDomainInput)  
    }
    
    showAll() {
        this.show(this.forDomainInput)  
    }
    
    toggleFold() {
        if(this.dropDownContainer.style.display == "none") {
            this.dropDownContainer.style.display = "block"
        } else {
            this.dropDownContainer.style.display = "none"
        }
    }
}