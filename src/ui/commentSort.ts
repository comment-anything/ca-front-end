import { UIInput } from "./base"
import { Dom } from "../util/dom"

import "./ownProfile.css"
import { Client } from "../communication/CLIENT"
import { Settings } from "../Settings"
import { State } from "../State"
import { CafeDom } from "../util/cafeDom"


/** Shows the users comment viewing settings and allows the user to change them */
export class CafeCommentSortDisplay extends UIInput<Settings> {
    
    input: {
        sortBy        : HTMLSelectElement
        viewHidden    : HTMLButtonElement
        sortAscending : HTMLButtonElement
    }
    
    ui: {
        sortBy        : HTMLSelectElement
        viewHidden    : HTMLButtonElement
        sortAscending : HTMLButtonElement
    }
    
    viewHidden: boolean
    sortAscending: boolean
    
    /* 
    sortBy        : HTMLSelectElement
    viewHidden    : HTMLInputElement
    sortAscending : HTMLInputElement
    
    // TODO. pseudoURL is just an element. Its value is not saved in settings.
    
    // NOTICE. Added these as members. Thought it was necessary to save the HTMLOptionElements -Luke
    sortBy_option1 : HTMLOptionElement 
    sortBy_option2 : HTMLOptionElement
    sortBy_option3 : HTMLOptionElement
    sortBy_option4: any
    */
    
    constructor(settings?: Settings) {
        super(settings);
        this.el.style.display = 'flex'
        this.el.style.flexBasis = '0'
        
        this.viewHidden = false
        this.sortAscending = false;
        
        this.input = {
            sortBy        : Dom.el("select"),
            viewHidden    : Dom.button('Show Hidden'),
            sortAscending : Dom.button("Sort Ascending")
        }
        
        this.ui = {
            sortBy        : CafeDom.genericDropdown(this.input.sortBy, {label: "Sort by"}),
            viewHidden    : CafeDom.toggleButton(this.input.viewHidden, {}),
            sortAscending : CafeDom.toggleButton(this.input.sortAscending, {})
        }
        
        let op1 = Dom.el('option')
        let op2 = Dom.el('option')
        let op3 = Dom.el('option')
        let op4 = Dom.el('option')
        
        op1.text = 'new'
        op2.text = 'funny'
        op3.text = 'factual'
        op4.text = 'agree'
        
        this.input.sortBy.add(op1)
        this.input.sortBy.add(op2)
        this.input.sortBy.add(op3)
        this.input.sortBy.add(op4)
        
        this.el.append(
            this.ui.sortBy,
            this.ui.sortAscending,
            this.ui.viewHidden
        )
        
        this.eventman.watchEventListener('click', this.input.sortAscending, ()=>{
            this.sortAscending = !this.sortAscending
            this.setActiveToggle(this.input.sortAscending, this.sortAscending)
            this.emitStateChangeRequest()
        })
        
        this.eventman.watchEventListener('click', this.input.viewHidden, ()=>{
            this.viewHidden = !this.viewHidden
            this.setActiveToggle(this.input.viewHidden, this.viewHidden)
            this.emitStateChangeRequest()
        })
    }
    
    /** Called by CommentWindow when settings changes */
    settingsChange(data:Settings) {
        this.data = data
        this.sortAscending = data.sortAscending
        this.input.sortBy.value = data.sortedBy        
        this.viewHidden = data.viewHidden
        
        this.setActiveToggle(this.input.sortAscending, this.sortAscending)
        this.setActiveToggle(this.input.viewHidden, this.viewHidden)
    }
    
    /** Construct and emit a new CafeSettings object to update the global settings object and percolate changes to all other CafeCommentSortDisplays */
    emitStateChangeRequest() {
        let sort = this.input.sortBy.value as Client.SortOption
        
        let sett : Partial<State> = {
            settings: {
                viewHidden    : this.viewHidden,
                sortAscending : this.sortAscending,
                sortedBy      : sort
            } as Settings
        }
        let e = new CustomEvent<Partial<State>>("StateChangeRequest", {
            detail: sett
        })
        document.dispatchEvent(e)
    }
    
    setActiveToggle(el: HTMLElement, setActive: boolean) {
        if (setActive)
            el.style.backgroundColor = 'darkgray'
        else
            el.style.backgroundColor = '#FCFCFC'
    }
}

