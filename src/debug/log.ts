
import "./log.css"

const CSS = {
    logBlock : "log-item",
    logX : "log-x-button",
    logSpan: "log-span",
    logContent: "log-content",
    logString : "log-string",
    logNumber : "log-number",
    logFunction : "log-number",
    logTrue: "log-true",
    logFalse: "log-false"
}

export class LogInstance {
    el: HTMLDivElement
    x: HTMLDivElement
    content: HTMLDivElement
    constructor(...msgs: any[]) {
        this.el = document.createElement("div")
        this.el.classList.add(CSS.logBlock)
        this.x = document.createElement("div")
        this.x.textContent = "X"
        this.x.classList.add(CSS.logX)
        this.content = document.createElement("div")
        this.content.classList.add(CSS.logContent)
        this.el.append(this.content, this.x)
        for(let m of msgs) {
            let span = this.getSpan(m)
            this.content.append(span)
        }
    }

    getSpan(m: any) : HTMLSpanElement {
        let span = document.createElement("span")
        span.classList.add(CSS.logSpan)
        if(typeof m == "string") {
            span.textContent = m
            span.classList.add(CSS.logString)
        } else if(typeof m == "number") {
            span.textContent = m.toString()
            span.classList.add(CSS.logNumber)
        } else if(typeof m == "function") {
            span.textContent = m.toString()
            span.classList.add(CSS.logFunction)
        } else if(typeof m == "boolean") {
            if(m == true) {
                span.textContent = "true"
                span.classList.add(CSS.logTrue)
            } else {
                span.textContent = "false"
                span.classList.add(CSS.logFalse)
            }
        } else if(typeof m == "object") {
            if(Array.isArray(m)) {
                let front = document.createElement("span")
                front.textContent = "["
                span.append(front)
                for(let item of m) {
                    let innerspan = this.getSpan(item)
                    span.append(innerspan)

                }
                let end = document.createElement("span")
                end.textContent = "] (" + m.length + " items )"
                span.append(end)
            } else {
                let pre = document.createElement("pre")
                pre.textContent = JSON.stringify(m, undefined, 4)
                span.append(pre)
            }
        } else {
            span.textContent = JSON.stringify(m)
        }
        return span

    }
}