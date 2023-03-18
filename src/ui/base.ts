import { Dom } from "../util/dom"

// Represents a server-client communication entity. Provides methods for gracefully deleting its instance, binding listeners, disabling, and re-enabling the UIInput.
// Type T represents the underlying data that UIInput displays.
export class UIInput<T>{
    data?      : T
    el        : HTMLElement
    blocker   : HTMLElement
    listeners : Array<[HTMLElement, (e:any)=>any, string]>
    
    // 
    constructor(data?: T, elType:keyof HTMLElementTagNameMap="div") {
        this.data = data
        this.el = Dom.el(elType, undefined, {
            "position":"relative", "zIndex": "0"
        })
        this.blocker = Dom.div(undefined, undefined, {"position":"absolute", "top":"0px", "left":"0px", "width":"100%", "height":"100%", "zIndex":"-1"})
        this.el.append(this.blocker)
        this.listeners = []
    }
    
    /** 
        @param el {HTMLElement | Array<HTMLElement>} Event targets
        @param fun {(e:MouseEvent)=>any | Array<(e:MouseEvent)=>any} callbacks
        @param bind Whether to bind to 'this' or not
    */
    clickListen(el:HTMLElement | HTMLElement[], fun: ((e:MouseEvent)=>any) | Array<(e:MouseEvent)=>any>, bind=true) {
        if (bind) {
            if (Array.isArray(fun)) {
                let boundArr : Array<(e:MouseEvent)=>any> = []
                for(let f of fun) {
                    boundArr.push(f.bind(this))
                }
                fun = boundArr
            }
            else {
                fun = fun.bind(this)
            }
        }
        if (Array.isArray(el)) {
            if (Array.isArray(fun)) {
                for (let elinst of el) {
                    for (let cb of fun) {
                        elinst.addEventListener("click", cb)
                        this.listeners.push([elinst, cb, "click"])
                    }
                }
            }
            else {
                for (let elinst of el) {
                    elinst.addEventListener("click", fun)
                    this.listeners.push([elinst, fun, "click"])
                }
            }
        }
        else {
            if (Array.isArray(fun)) {
                for(let cb of fun) {
                    el.addEventListener("click", cb)
                    this.listeners.push([el, cb, "click"])
                }
            }
            else {
                el.addEventListener("click", fun)
                this.listeners.push([el, fun, "click"])
            }
        }
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
        for(let triplet of this.listeners) {
            let [el, listnr, evname] = triplet
            el.removeEventListener(evname, listnr)
        }
        this.el.remove()
    }
}