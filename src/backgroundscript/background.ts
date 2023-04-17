
import { T_ExtensionMsg as M } from "../communication/EXTENSTION"

console.log("YES THIS RAN!")

if(typeof browser != "undefined") {




    let contentPort : M.Background.Port.Content
    let popupPort : M.Background.Port.Popup


    /**
     * Transfers messages from the content script to the popup.
     * 
     * The popup, when it starts, will request the URL of the page the content script is on.
     * 
     * The background script passes that request on and, when it gets a response, sends it back to the Popup 
     */
    function connected(p:browser.runtime.Port) {
        let mport = p as M.Background.Port.Content | M.Background.Port.Popup
        if(mport.name == "cscript-port") {
            contentPort = mport as M.Background.Port.Content
            contentPort.postMessage({
                command: "message",
                data: "I see you content port! (from background) "
            })
            contentPort.onMessage.addListener( (r)=> {
                if(r.type == "href") {
                    if(popupPort != undefined) {
                        popupPort.postMessage({
                            type: "href",
                            data: r.data
                        })
                    }
                }
            })
        }
        else if(mport.name == "popup-port") {
            popupPort = mport as M.Background.Port.Popup
            popupPort.postMessage({
                type: "message",
                data: "I see you, popup! (from background)"
            })
            popupPort.onMessage.addListener( (r) => {
                if(r.type == "send-href") {
                    if(contentPort != undefined) {
                        contentPort.postMessage({
                            command: "send-href"
                        })
                    }
                }
            })
        }
    }

    browser.runtime.onConnect.addListener(connected)

}