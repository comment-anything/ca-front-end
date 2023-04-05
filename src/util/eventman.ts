
/** Used by a class to manage all active event listeners. */
export class EventManager<T> {
    
    source    : T
    listeners : Array<[HTMLElement, (e:any)=>any, string]>
    
    /** Construct with the source (typically using 'this') */
    constructor(source: T) {
        this.source = source
        this.listeners = []
    }
    
    /** Add a new event listener to watch */
    watchEventListener<T extends keyof HTMLElementEventMap>(type: T, el: HTMLElement, fun: (e: Event)=>any, bind=true) {
        if (bind)
            fun = fun.bind(this.source)
        
        el.addEventListener(type, fun)
        this.listeners.push([el, fun, type])
    }
    
    /** Add multiple listeners to each associated element. */
    watchEventListeners<T extends keyof HTMLElementEventMap>(type: T, elWithListeners: Array<[el: HTMLElement, fun: (e:Event)=>any]>, bind=true) {
        for (let ewl of elWithListeners) {
            this.watchEventListener(type, ewl[0], ewl[1], bind)
        }
    }
    
    /** Destroy all current listeners */
    destroyEventListeners() {
        for (let triplet of this.listeners) {
            let [el, listener, type] = triplet
            el.removeEventListener(type, listener)
        }
    }
}




