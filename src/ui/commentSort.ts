import { UIInput } from "./base"
import { CafeSettings } from "../Cafe"
import { Dom } from "../util/dom"

import "./ownProfile.css"
import { Client } from "../CLIENT"

const CSS = {
    sortRow : "profile-info-row"
}

/** Shows the users comment viewing settings and allows the user to change them */
export class CafeCommentSortDisplay extends UIInput<CafeSettings> {
    sortBy        : HTMLSelectElement
    viewHidden    : HTMLInputElement
    sortAscending : HTMLInputElement
    
    // TODO. pseudoURL is just an element. Its value is not saved in settings.
    
    // NOTICE. Added these as members. Thought it was necessary to save the HTMLOptionElements -Luke
    sortBy_option1 : HTMLOptionElement 
    sortBy_option2 : HTMLOptionElement
    sortBy_option3 : HTMLOptionElement
    sortBy_option4: any
    
    constructor(settings?: CafeSettings) {
        super(settings);
        
        this.sortBy = Dom.el("select")
        this.viewHidden = Dom.createInputElement("checkbox")
        this.sortAscending = Dom.createInputElement("checkbox")
        
        this.sortBy_option1 = Dom.el('option')
        this.sortBy_option2 = Dom.el('option')
        this.sortBy_option3 = Dom.el('option')
        this.sortBy_option4 = Dom.el('option')
        
        this.sortBy_option1.text = 'new'
        this.sortBy_option2.text = 'funny'
        this.sortBy_option3.text = 'factual'
        this.sortBy_option4.text = 'agree'
        
        this.sortBy.add(this.sortBy_option1)
        this.sortBy.add(this.sortBy_option2)
        this.sortBy.add(this.sortBy_option3)
        this.sortBy.add(this.sortBy_option4)
        
        let label_sortBy = Dom.textEl("label", "Sort by")
        let label_viewHidden = Dom.textEl("label", "View hidden")
        let label_sortAscending = Dom.textEl("label", "Sort by ascending")
        
        let container_sortBy = Dom.div(undefined, CSS.sortRow)
        let container_viewHidden = Dom.div(undefined, CSS.sortRow)
        let container_sortAscending = Dom.div(undefined, CSS.sortRow)
        
        container_sortBy.append(label_sortBy, this.sortBy)
        container_viewHidden.append(label_viewHidden, this.viewHidden)
        container_sortAscending.append(label_sortAscending, this.sortAscending)
        
        // TODO. Call this.settingChange when a value is updated -Luke
        
        this.el.append(
            container_sortBy,
            container_viewHidden,
            container_sortAscending
        )
    }
    
    /** Construct and emit a new CafeSettings object to update the global settings object and percolate changes to all other CafeCommentSortDisplays */
    settingChange() {
        let sett : Partial<CafeSettings> = {
            viewHidden    : this.viewHidden.checked,
            sortAscending : this.sortAscending.checked,
        }
        sett.sortBy = this.sortBy.value in ["new", "funny", "factual", "agree"] ? this.sortBy.value as Client.SortOption: "new"
        sett = sett as CafeSettings
        // TODO. Emit the settings change to Cafe -Luke
    }
    
}

