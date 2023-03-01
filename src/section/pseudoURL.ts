import { CafeSection } from "./base";
import { Dom } from "../util/dom"
import { Settings } from "../settings"
import { State } from "../State";
import { Client } from "../CLIENT";


export class PseudoUrlSection extends CafeSection {
    purlLabel    : HTMLLabelElement
    toggleButton : HTMLButtonElement
    submitButton : HTMLButtonElement
    cancelButton : HTMLButtonElement
    pseudoURL    : HTMLInputElement
    showingAll   : boolean
    
    constructor() {
        super()
        
        this.toggleButton = Dom.button("Pseudo URL")
        this.purlLabel = Dom.textEl('label', "Pseudo URL")
        this.pseudoURL = Dom.createInputElement("url")
        this.submitButton = Dom.button("🌎")
        this.cancelButton = Dom.button("❌")
        
        this.toggleButton.style.display = 'inline'
        
        this.showingAll = false
        this.makeAllVisible(false)
        this.clickListen(this.toggleButton, this.toggleFold, true)
        this.clickListen(this.cancelButton, this.cancelButtonClicked, true)
        this.clickListen(this.submitButton, this.submitButtonClicked, true)
        
        this.el.append(
            this.toggleButton,
            this.pseudoURL,
            this.submitButton
        )
    }
    
    cancelButtonClicked() {
        let event = new CustomEvent<Partial<Settings>>("SettingsChangeRequest", {
            detail: {
                onPseudoUrlPage: false
            }
        })
        document.dispatchEvent(event)
        this.toggleFold()
    }
    
    submitButtonClicked() {
        let event = new CustomEvent<Partial<State>>("StateChangeRequest", {
            detail: {
                settings: {
                    onPseudoUrlPage: true,
                    url: this.pseudoURL.value
                } as Settings
            }
        })
        document.dispatchEvent(event)
        this.requestCommentsForPseudoURLPage()
    }
    
    settingsChange(data: Settings) {
        console.log("Settings change received in pseudo URL section with value", data)
        if (data.onPseudoUrlPage) {
            this.pseudoURL.value = data.url
        }
    }

    /**
     * Called when a user input another URL to retrieve comments for. Dispatches the request with form data to the dom, for fetching. 
     */
    requestCommentsForPseudoURLPage() {
        let req : Client.GetComments = {
            Url : this.pseudoURL.value
        } as Client.GetComments
        let event = new CustomEvent<Client.GetComments>("getComments", {detail:req});
        document.dispatchEvent(event);
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
            this.cancelButton.style.display = "inline"
        }
        else {
            this.purlLabel.style.display = "none"
            this.pseudoURL.style.display = "none"
            this.submitButton.style.display = "none"
            this.submitButton.style.display = "none"
        }
    }
}