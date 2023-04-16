

/** We will be narrowing the browser.runtime.Port type here for our typedefs  */
type PartPort = Omit<browser.runtime.Port, "postMessage" | "onMessage" | "name">


/** Messages that background script might send to content script  */
type BG_To_Content_SendHref = {
    command: "send-href"
}
type BG_To_Content_Message = {
    command: "message",
    data: string
}

type BG_To_Content_Msgs = BG_To_Content_SendHref | BG_To_Content_Message

/** Messages that content might send to background script  */
type Content_To_BG_SendHref = {
    type: "href"
    data: string 
}

type Content_To_BG_Msgs = Content_To_BG_SendHref /* Union more types here if desired */

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




interface Port_BGToContent extends PartPort {
    postMessage: (message: BG_To_Content_Msgs) => void;
    onMessage: WebExtEvent<(response: Content_To_BG_Msgs) => void>;
    name: "cscript-port"
}
interface Port_ContentToBG extends PartPort {
    postMessage: (message: Content_To_BG_Msgs) => void;
    onMessage: WebExtEvent<(response: BG_To_Content_Msgs) => void>;
    name: "cscript-port"
}

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
    namespace Content {
        type Port = Port_ContentToBG
    }
    namespace Background {
        namespace Port {
            type Content = Port_BGToContent
            type Popup = Port_BGToPopup
        }
    }
}