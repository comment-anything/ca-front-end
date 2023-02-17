import { UIInput } from "./base"
import { CafeSettings } from "../Cafe"
import { Dom } from "../util/dom"

import "./ownProfile.css"

const CSS = {
    sortRow : "profile-info-row"
}

/** Shows the users comment viewing settings and allows the user to change them */
export class CafeCommentSortDisplay extends UIInput<CafeSettings> {
    sortBy        : HTMLSelectElement
    viewHidden    : HTMLInputElement
    sortAscending : HTMLInputElement
    
    // TODO. pseudoURL is just an element. Its value is not saved in settings.
    // NOTICE. Added pseudoURL as a sort display option. Deviates from the design document
    pseudoURL     : HTMLInputElement
    
    // NOTICE. Added these as members. Thought it was necessary to save the HTMLOptionElements -Luke
    sortBy_option1 : HTMLOptionElement
    sortBy_option2 : HTMLOptionElement
    sortBy_option3 : HTMLOptionElement
    
    constructor(settings?: CafeSettings) {
        super(settings);
        
        this.sortBy = Dom.el("select")
        this.viewHidden = Dom.createInputElement("checkbox")
        this.sortAscending = Dom.createInputElement("checkbox")
        this.pseudoURL = Dom.createInputElement("url")
        
        this.sortBy_option1 = Dom.el('option')
        this.sortBy_option2 = Dom.el('option')
        this.sortBy_option3 = Dom.el('option')
        
        this.sortBy_option1.text = 'Sort 1'
        this.sortBy_option2.text = 'Sort 2'
        this.sortBy_option3.text = 'Sort 3'
        
        this.sortBy.add(this.sortBy_option1)
        this.sortBy.add(this.sortBy_option2)
        this.sortBy.add(this.sortBy_option3)
        
        let label_sortBy = Dom.textEl("label", "Sort by")
        let label_viewHidden = Dom.textEl("label", "View hidden")
        let label_sortAscending = Dom.textEl("label", "Sort by ascending")
        let label_pseudoURL = Dom.textEl("label", "Pseudo URL")
        
        let container_sortBy = Dom.div(undefined, CSS.sortRow)
        let container_viewHidden = Dom.div(undefined, CSS.sortRow)
        let container_sortAscending = Dom.div(undefined, CSS.sortRow)
        let container_pseudoURL = Dom.div(undefined, CSS.sortRow)
        
        container_sortBy.append(label_sortBy, this.sortBy)
        container_viewHidden.append(label_viewHidden, this.viewHidden)
        container_sortAscending.append(label_sortAscending, this.sortAscending)
        container_pseudoURL.append(label_pseudoURL, this.pseudoURL)
        
        // TODO. Call this.settingChange when a value is updated -Luke
        
        this.el.append(
            container_sortBy,
            container_viewHidden,
            container_sortAscending,
            container_pseudoURL
        )
    }
    
    /** Construct and emit a new CafeSettings object to update the global settings object and percolate changes to all other CafeCommentSortDisplays */
    settingChange() {
        let sett: CafeSettings = {
            sortBy        : this.sortBy.value,
            viewHidden    : this.viewHidden.checked,
            sortAscending : this.sortAscending.checked
        }
        
        // TODO. Emit the settings change to Cafe -Luke
    }
    
}

