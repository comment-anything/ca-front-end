import { Dom } from "../util/dom"
import { EventManager } from "../util/eventman"

// Represents a server-client communication entity. Provides methods for gracefully deleting its instance, binding listeners, disabling, and re-enabling the UIInput.
// Type T represents the underlying data that UIInput displays.
export class UIInput<T>{
    data?      : T
    el        : HTMLElement
    blocker   : HTMLElement
    eventman : EventManager<UIInput<T>>
    //listeners : Array<[HTMLElement, (e:any)=>any, string]>
    
    // 
    constructor(data?: T, elType:keyof HTMLElementTagNameMap="div") {
        this.data = data
        this.el = Dom.el(elType, undefined, {
            "position":"relative", "zIndex": "0"
        })
        this.blocker = Dom.div(undefined, undefined, {"position":"absolute", "top":"0px", "left":"0px", "width":"100%", "height":"100%", "zIndex":"-1"})
        this.el.append(this.blocker)
        this.eventman = new EventManager(this)
    }
    
    /** Overlay the blocker element to block mouse clicks temporarily. */
    disable() {
        this.blocker.style.backgroundColor = "rgba(200,200,200,0.5)"
        this.blocker.style.zIndex = "1"
    }
    
    /** Hide the over */
    enable() {
        
    }
    
    /** Destroy existing listeners. */
    destroy() {
        this.eventman.destroyEventListeners()
        this.el.remove()
    }
    
}