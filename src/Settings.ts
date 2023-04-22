import { State } from "./State"
import { Client } from "./communication/CLIENT"

/**
 * Settings holds the client-side settings, such as sort preferences. 
 */
export class Settings {
    sortedBy        : Client.SortOption
    sortAscending   : boolean
    onPseudoUrlPage : boolean
    url             : string
    viewHidden      : boolean
    
    constructor() {
        this.sortedBy = "new"
        this.sortAscending = true
        this.onPseudoUrlPage = false
        this.url = ""
        this.viewHidden = false
    }

    /** Updates the settings.
     * 
     * Also emits a getComments request if the url changed!
     */
    settingsUpdate(settingsChange: Partial<Settings>) {
        console.log("settingsChangeRequest received", settingsChange)
        if(settingsChange.viewHidden != undefined) {
            this.viewHidden = settingsChange.viewHidden
        }
        if(settingsChange.sortedBy != undefined) {
            this.sortedBy = settingsChange.sortedBy
        }
        if(settingsChange.sortAscending != undefined) {
            this.sortAscending = settingsChange.sortAscending
        }
        if(settingsChange.onPseudoUrlPage != undefined) {
            this.onPseudoUrlPage = settingsChange.onPseudoUrlPage
        }
        if(settingsChange.url != undefined && settingsChange.url != "") {
            if(settingsChange.url != this.url) {
                let gc : Client.GetComments = {
                    Url: settingsChange.url,
                    SortAscending: this.sortAscending,
                    SortedBy: this.sortedBy
                } as Client.GetComments
                this.url = settingsChange.url
                let ev = new CustomEvent<Client.GetComments>("getComments", {
                    detail: gc
                })
                document.dispatchEvent(ev)
            } 
        } else {
            this.url = ""
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

    }
}

