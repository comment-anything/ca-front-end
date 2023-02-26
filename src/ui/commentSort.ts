import { UIInput } from "./base"
import { Dom } from "../util/dom"

import "./ownProfile.css"
import { Client } from "../CLIENT"
import { Settings } from "../Settings"
import { State } from "../State"

const CSS = {
    sortRow : "profile-info-row"
}

/** Shows the users comment viewing settings and allows the user to change them */
export class CafeCommentSortDisplay extends UIInput<Settings> {
    sortBy        : HTMLSelectElement
    viewHidden    : HTMLInputElement
    sortAscending : HTMLInputElement
    
    // TODO. pseudoURL is just an element. Its value is not saved in settings.
    
    // NOTICE. Added these as members. Thought it was necessary to save the HTMLOptionElements -Luke
    sortBy_option1 : HTMLOptionElement 
    sortBy_option2 : HTMLOptionElement
    sortBy_option3 : HTMLOptionElement
    sortBy_option4: any
    
    constructor(settings?: Settings) {
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
        
        this.clickListen(this.sortBy_option1, this.emitStateChangeRequest, true)
        this.clickListen(this.sortBy_option2, this.emitStateChangeRequest, true)
        this.clickListen(this.sortBy_option3, this.emitStateChangeRequest, true)
        this.clickListen(this.sortBy_option4, this.emitStateChangeRequest, true)
        this.clickListen(this.sortAscending, this.emitStateChangeRequest, true)
        this.clickListen(this.viewHidden, this.emitStateChangeRequest, true)
        
        this.el.append(
            container_sortBy,
            container_viewHidden,
            container_sortAscending
        )
    }

    /** Called by CommentWindow when settings changes */
    settingsChange(data:Settings) {
        this.data = data
        console.log("settingChangRecieved called in CommentSort with data", data)
        this.sortAscending.checked = data.sortAscending
        this.sortBy.value = data.sortedBy        
        this.viewHidden.checked = data.viewHidden
    }
    
    /** Construct and emit a new CafeSettings object to update the global settings object and percolate changes to all other CafeCommentSortDisplays */
    emitStateChangeRequest() {
        let sort = this.sortBy.value as Client.SortOption
        
        let sett : Partial<State> = {
            settings: {
                viewHidden    : this.viewHidden.checked,
                sortAscending : this.sortAscending.checked,
                sortedBy      : sort
            } as Settings
        }
        let e = new CustomEvent<Partial<State>>("StateChangeRequest", {
            detail: sett
        })
        document.dispatchEvent(e)
    }
    
}

