import { LogInstance } from "./log"

import "./log.css"

const CSS = {
    dbFrame : "db-frame"
}

export class Debug {
    el: HTMLDivElement
    logs: Set<[LogInstance, VoidFunction]>
    deleteAll: HTMLButtonElement
    constructor() {
        this.logs = new Set()
        this.el = document.createElement("div")
        this.deleteAll = document.createElement("button")
        this.deleteAll.innerHTML = "deleteAll"

        let deleteAll = ()=>{
            for(let [li, bf] of this.logs.values()) {
                li.el.remove();
                li.x.removeEventListener("click", bf)
            }
            this.logs = new Set()
        }
        deleteAll = deleteAll.bind(this)
        this.deleteAll.addEventListener("click", deleteAll)

        this.el.append(this.deleteAll)
        
        this.el.classList.add(CSS.dbFrame)
        this.log.bind(this)
    }

    log(...logitems: any[]) {
        let logset = this.logs
        let instance = new LogInstance(...logitems)
        let destroy : ()=>void
        destroy = ()=> {
            instance.el.remove()
            instance.x.removeEventListener("click", destroy)
            logset.delete([instance, destroy])
        }
        
        this.el.append(instance.el)
        instance.x.addEventListener("click", destroy)
        
        this.logs.add([instance, destroy])
    }
    error(...logItems: any[]) {
        this.log(...logItems)
    }
    warn(...logItems: any[]) {
        this.log(...logItems)
    }
}
