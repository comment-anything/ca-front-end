
import { Client, ClientMap } from './client'
import { Server, ServerMap, ServerResponse } from './server'

export class Fetcher {
    responses: ServerResponse<keyof ServerMap>[]
    
    constructor() {
        this.responses = []
    }
    
    async fetch<T extends keyof ClientMap>(event: T, data: ClientMap[T], callback: () => void) {
        alert('Fetcher called!')
        
        await fetch('SERVER IP GOES HERE', {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
            
        }).then((res) => {
            this.responses = res
        })
        
        callback()
    }
    
    getAndClearResponses(): ServerResponse<keyof ServerMap>[] {
        let backup = this.responses
        this.responses = []
        return backup
    }
}
