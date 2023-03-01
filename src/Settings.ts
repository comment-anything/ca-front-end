import { Client } from "./CLIENT"

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
}

