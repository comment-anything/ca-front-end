import { CafeSection } from "./base";
import { Dom } from "../util/dom"
import { Settings } from "../Settings";
import { State } from "../State";
import { Client } from "../communication/CLIENT";
import { CafeDom } from "../util/cafeDom";



export class PseudoUrlSection extends CafeSection {
    
    input: {
        purl   : HTMLInputElement
        edit   : HTMLButtonElement
        search : HTMLButtonElement
        cancel : HTMLButtonElement
    }
    
    ui: {
        purl   : HTMLDivElement
        edit   : HTMLButtonElement
        search : HTMLButtonElement
        cancel : HTMLButtonElement
    }
    
    showingAll : boolean
    
    
    
    constructor() {
        super()
        this.el.style.display = 'flex'
        this.el.style.alignItems = 'center'
        this.el.style.paddingTop = '8px'
        this.el.style.paddingBottom = '8px'
        
        this.input = {
            purl   : Dom.createInputElement('text'),
            edit   : Dom.button(''),
            search : Dom.button(''),
            cancel : Dom.button('')
        }
        
        this.ui = {
            purl   : CafeDom.fullSizeGenericTextInput(this.input.purl, {label: "Pseudo URL"}),
            edit   : CafeDom.genericIconButton(this.input.edit, {asset: 'edit-pen-icon'}),
            search : CafeDom.genericIconButton(this.input.search, {asset: 'search-icon'}),
            cancel : CafeDom.genericIconButton(this.input.cancel, {asset: 'close'})
        }
        
        this.showingAll = false
        
        this.el.append(
            this.ui.edit,
            this.ui.purl,
            this.ui.search,
            this.ui.cancel
        )
        
        this.makeAllVisible(false)
        this.eventman.watchEventListener('click', this.input.edit, this.toggleFold)
        this.eventman.watchEventListener('click', this.input.cancel, this.cancelButtonClicked)
        this.eventman.watchEventListener('click', this.input.search, this.submitButtonClicked)
    }
    
    cancelButtonClicked() {
        let event = new CustomEvent<Partial<State>>("StateChangeRequest", {
            detail: {
                settings: {
                    onPseudoUrlPage: false
                } as Settings
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
                    url: this.input.purl.value
                } as Settings
            }
        })
        document.dispatchEvent(event)
        this.requestCommentsForPseudoURLPage()
    }
    
    settingsChange(data: Settings) {
        console.log("Settings change received in pseudo URL section with value", data)
        this.input.purl.value = data.url
    }

    /**
     * Called when a user input another URL to retrieve comments for. Dispatches the request with form data to the dom, for fetching. 
     */
    requestCommentsForPseudoURLPage() {
        let req : Client.GetComments = {
            Url : this.input.purl.value
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
            this.ui.purl.style.display = "inline"
            this.ui.search.style.display = "inline"
            this.ui.cancel.style.display = "inline"
        }
        else {
            this.ui.purl.style.display = "none"
            this.ui.search.style.display = "none"
            this.ui.cancel.style.display = "none"
        }
    }
}