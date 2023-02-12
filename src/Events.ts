
import {ClientMap} from "./CLIENT"
import { Server } from "./SERVERK"
import { StateView } from "./State"


// The handle that listeners will be attached to and emitted on for ClientEvents on the document. E.g. `document.addEventListener(ClientEventHandle, ()=>{} ....)`
export const ClientEventHandle = "ClientEvent"

// A ClientEvent is dispatched to the DOM to be picked up by the Cafe base listener. They should generally result in Cafe sending the event data to fetcher for dispatching.
export type ClientEvent = {
    [K in keyof ClientMap] : CustomEvent<ClientMap[K][0]>
}

export type NavEvent = {
    "StateChangeRequest" : CustomEvent<StateView>
    "StateChanged"       : CustomEvent<StateView>
}

export type FrontEndErrorEvent = {
    "FrontEndError" : CustomEvent<Server.Message>
}


type AllCustomEvents = ClientEvent & NavEvent & FrontEndErrorEvent

// Add the typedefs for custom events to the document.
declare global {
    interface Document {
        addEventListener<K extends keyof AllCustomEvents>(type: K,
            listener: (this: Document, ev: AllCustomEvents[K]) => void): void;
         dispatchEvent<K extends keyof AllCustomEvents>(ev: AllCustomEvents[K]): void;
    }
}


