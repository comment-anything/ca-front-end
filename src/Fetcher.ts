import { Client } from "./Client"
import { Server } from "./Server"

export type ClientMap = {
    "register": Client.Register
}

export type ServerMap = {
    "Message": Server.Message
}

export type ServerResponse<T extends keyof ServerMap> = {
    t: T
    d: ServerMap[T]
}

export class Fetcher {
    responses: ServerResponse<keyof ServerMap>[]
    
    constructor() {
        this.responses = []
    }
    
    fetch<T extends keyof ClientMap>(eventAndApiEndpoint: T, data: ClientMap[T], callback: ()=>void) {
        
    }
    
    getAndClearResponses(): ServerResponse<keyof ServerMap>[] {
        let r = this.responses
        this.responses = []
        return r
    }
}