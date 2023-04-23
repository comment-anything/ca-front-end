import { CafeSection } from "./base";
import { Dom } from "../util/dom"
import { Settings } from "../Settings";
import { State } from "../State";
import { Client } from "../communication/CLIENT";
import { CafeDom } from "../util/cafeDom";


const CSS = {
    // defined in navbar.css
    indicator: "psuedo-indicator"
}


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
        indicator: HTMLDivElement
    }
    
    showingAll : boolean

    /** Updated whenever a settings change occurs */
    on_purl: boolean
    
    
    
    constructor() {
        super()
        this.on_purl = false
        this.el.style.display = 'flex'
        this.el.style.alignItems = 'center'
        this.el.style.paddingTop = '8px'
        this.el.style.paddingBottom = '8px'
        this.el.style.position = "relative"
        
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
            cancel : CafeDom.genericIconButton(this.input.cancel, {asset: 'close'}),
            indicator: Dom.div("You are on a psuedo-url.", CSS.indicator)
        }
        
        this.showingAll = false
        
        this.el.append(
            this.ui.edit,
            this.ui.indicator,
            this.ui.purl,
            this.ui.search,
            this.ui.cancel
        )
        
        this.setVisibility(false)
        this.eventman.watchEventListener('click', this.input.edit, this.toggleFold)
        this.eventman.watchEventListener('click', this.input.cancel, this.cancelButtonClicked)
        this.eventman.watchEventListener('click', this.input.search, this.submitButtonClicked)
    }
    
    cancelButtonClicked() {
        if(this.on_purl) {
            let event = new CustomEvent<Partial<State>>("ClearURL", {
                detail: {
                    settings: {
                        url: "",
                        onPseudoUrlPage: false
                    } as Settings
                }
            })
            document.dispatchEvent(event)
        }
        this.setVisibility(false)
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
        this.input.purl.value = data.url
        this.on_purl = data.onPseudoUrlPage
        this.setVisibility()
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
            this.setVisibility(false)
        }
        else {
            this.setVisibility(true)
        }
    }

    setVisibility(setTo?:boolean) {
        if(setTo != undefined) {
            this.showingAll = setTo
        }
        if(this.showingAll) {
            this.ui.purl.style.display = "inline"
            this.ui.search.style.display = "inline"
            this.ui.cancel.style.display = "inline"
            this.ui.indicator.style.display = "none"
        } else {
            this.ui.purl.style.display = "none"
            this.ui.search.style.display = "none"
            if(this.on_purl) {
                this.ui.indicator.style.display = "inline"
                this.ui.cancel.style.display = "inline"
            } else {
                this.ui.cancel.style.display = "none"
                this.ui.indicator.style.display = "none"
            }
        }
    }
}