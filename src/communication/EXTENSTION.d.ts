

/** We will be narrowing the browser.runtime.Port type here for our typedefs  */
type PartPort = Omit<browser.runtime.Port, "postMessage" | "onMessage" | "name">


/** Messages the background might send to popup  */

type BG_To_Popup_SendHref = {
    type: "href",
    data: string 
}
type BG_To_Popup_SendMsg = {
    type: "message",
    data: string 
}

type BG_To_Popup_Msgs = BG_To_Popup_SendHref | BG_To_Popup_SendMsg /* Union more types here if desired */

/** Messages the popup might send to background */

type Popup_To_BG_RequestHref = {
    type: "send-href"
}

type Popup_To_BG_Msgs = Popup_To_BG_RequestHref /* Union more types here if desired */




interface Port_PopupToBG extends PartPort {
    postMessage: (message: Popup_To_BG_Msgs) => void;
    onMessage: WebExtEvent<(response: BG_To_Popup_Msgs) => void>;
    name: "popup-port"
}

interface Port_BGToPopup extends PartPort {
    postMessage: (message: BG_To_Popup_Msgs) => void;
    onMessage: WebExtEvent<(response: Popup_To_BG_Msgs) => void>;
    name: "popup-port"
}



/**
 * Types for communication between background, content, and popup scripts
 * 
 */
export namespace T_ExtensionMsg {
    namespace Popup {
        type Port = Port_PopupToBG
    }
    namespace Background {
        namespace Port {
            type Popup = Port_BGToPopup
        }
    }
}