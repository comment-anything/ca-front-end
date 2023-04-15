import { Debug } from "./debug/debug"

let div = document.createElement("div")
div.innerHTML = "CA CONTENT SCRIPT RUNNING"
div.style.position = "fixed"
div.style.top = "0px"
div.style.right = "100px"
div.style.padding = "2px"
div.style.border = "1px dashed green"
div.style.zIndex = "100000";
document.body.append(div)

const debug_mode : string = import.meta.env.VITE_EXTENSION_DEBUG_MODE
if(debug_mode == "true") {
    const debug = new Debug()
    document.body.append(debug.getStyle())
    document.body.append(debug.el)
    window.console.log = debug.log.bind(debug)
    div.innerHTML = "Loaded CA Content debug!"
    if(typeof browser != undefined) {
        console.log("browser.extension.getURL:" , browser.extension.getURL(""))
        console.log("browser.runtime.getURL:", browser.runtime.getURL(""))
        console.log("window.location.href", window.location.href)
    }    
} else {
    div.innerHTML = "Failed to load content script!"
}

let myPort = browser.runtime.connect({name: "cscript-port"})
myPort.postMessage({
    url: window.location.href
})
myPort.onMessage.addListener( (m)=> {
    console.log("Received msg ", m)
})

function connected(p: browser.runtime.Port) {
    console.log("Connected to port: ", p)
    p.onMessage.addListener( (o)=> {
        console.log("got message:", o)
    })
}

browser.runtime.onConnect.addListener(connected)

console.log("created port: ", myPort)
