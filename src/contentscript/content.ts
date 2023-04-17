import { Debug } from "./debug/debug"

import { T_ExtensionMsg as M } from "../communication/EXTENSTION"


if(typeof browser != "undefined") {

    const debug_mode : string = import.meta.env.VITE_EXTENSION_DEBUG_MODE
    if(debug_mode == "true") {
        const debug = new Debug()
        document.body.append(debug.getStyle())
        document.body.append(debug.el)
        window.console.log = debug.log.bind(debug)
        if(typeof browser != undefined) {
            console.log("browser.extension.getURL:" , browser.extension.getURL(""))
            console.log("browser.runtime.getURL:", browser.runtime.getURL(""))
            console.log("window.location.href", window.location.href)
        }    
    }

    let port : M.Content.Port = browser.runtime.connect({name: "cscript-port"}) as any

    port.onMessage.addListener( (r)=> {
        if(r.command == "message") {
            console.log(r.data)
        } else if(r.command == "send-href") {
            port.postMessage({
                type: "href",
                data: window.location.href
            })
        }
    })

}