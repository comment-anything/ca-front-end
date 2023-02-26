import { CafeSection } from "./base";
import { Dom } from "../util/dom"

export class PseudoUrlSection extends CafeSection {
    purlLabel    : HTMLLabelElement
    toggleButton : HTMLButtonElement
    submitButton : HTMLButtonElement
    pseudoURL    : HTMLInputElement
    showingAll   : boolean
    
    constructor() {
        super()
        
        this.toggleButton = Dom.button("Pseudo URL")
        this.purlLabel = Dom.textEl('label', "Pseudo URL")
        this.pseudoURL = Dom.createInputElement("url")
        this.submitButton = Dom.button("🌎")
        
        this.toggleButton.style.display = 'inline'
        
        this.showingAll = false
        this.makeAllVisible(false)
        this.clickListen(this.toggleButton, this.toggleFold, true)
        
        this.el.append(
            this.toggleButton,
            this.pseudoURL,
            this.submitButton
        )
    }
    
    toggleFold() {
        if (this.showingAll) {
            this.showingAll = false
            this.makeAllVisible(false)
        }
        else {
            this.showingAll = true
            this.makeAllVisible(true)
        }
    }
    
    makeAllVisible(show: boolean) {
        if (show) {
            this.purlLabel.style.display = "inline"
            this.pseudoURL.style.display = "inline"
            this.submitButton.style.display = "inline"
        }
        else {
            this.purlLabel.style.display = "none"
            this.pseudoURL.style.display = "none"
            this.submitButton.style.display = "none"
        }
    }
}