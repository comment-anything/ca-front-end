import { LogInstance } from "./log"


const CSS = {
    dbFrame : "db-frame"
}
const style = `
.db-frame {
    position:fixed;
    top: 40px;
    right: 0px;
    border: 1px dotted gray;
    color: white;
    background-color: black;
    z-index: 100000;
    font-size: 10px;
}

.log-item {
    position: relative;
    padding: 1px;
    border: 1px dotted lightblue;
    
}

.log-span {
    padding-left: 2px;
    padding-right: 2px;
}

.log-x-button {
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
    background-color: red;
    padding: 2px;
}
`

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
    getStyle() {
        let stylel = document.createElement("style")
        stylel.innerHTML = style
        return stylel
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
