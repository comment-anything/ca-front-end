import { Dom } from "../util/dom";
import { EventManager } from "../util/eventman";

export class CafeSection {
    el: HTMLDivElement;
    eventman : EventManager<CafeSection>
    
    constructor(classNames?:string|string[]) {
        this.el = Dom.div()
        if(classNames != undefined) {
            if(Array.isArray(classNames)) {
                classNames.forEach( (cn) => {
                    this.el.classList.add(cn)
                })
            } else {
                this.el.classList.add(classNames)
            }
        }
        this.eventman = new EventManager(this)
    }
    
    /** Destroy existing listeners. */
    destroy() {
        this.eventman.destroyEventListeners()
        this.el.remove()
    }
    
}