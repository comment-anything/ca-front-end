
import {ClientMap} from "./CLIENT"


// The handle that listeners will be attached to and emitted on for ClientEvents on the document. E.g. `document.addEventListener(ClientEventHandle, ()=>{} ....)`
export const ClientEventHandle = "ClientEvent"

// A ClientEvent is dispatched to the DOM to be picked up by the Cafe base listener. They should generally result in Cafe sending the event data to fetcher for dispatching.
export type ClientEvent = {
    [K in keyof ClientMap] : CustomEvent<ClientMap[K][0]>
}

// Add the typedefs for custom events to the document.
declare global {
    interface Document {
        addEventListener<K extends keyof ClientEvent>(type: K,
            listener: (this: Document, ev: ClientEvent[K]) => void): void;
         dispatchEvent<K extends keyof ClientEvent>(ev: ClientEvent[K]): void;
    }
}


