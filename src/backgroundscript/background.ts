
import { T_ExtensionMsg as M } from "../communication/EXTENSTION"


if(typeof browser != "undefined") {


    let popupPort : M.Background.Port.Popup


    /**
     * Transfers messages from the content script to the popup.
     * 
     * The popup, when it starts, will request the URL of the page the content script is on.
     * 
     * The background script passes that request on and, when it gets a response, sends it back to the Popup 
     */
    function connected(p:browser.runtime.Port) {
        if(p.name == "popup-port") {
            popupPort = p as M.Background.Port.Popup
        }
        popupPort.postMessage({
            type: "message",
            data: "I see you, popup! (from background)"
        })
        popupPort.onMessage.addListener( (r) => {
            if(r.type == "send-href") {
                browser.tabs.query({active:true, currentWindow: true}).then( (v)=> {
                    if(v.length > 0) {
                        popupPort.postMessage({
                            type: "href",
                            data: v[0].url ? v[0].url : ""
                        })
                    }
                })
            }
        })
    }

    browser.runtime.onConnect.addListener(connected)

}