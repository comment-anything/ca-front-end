
import { ClientMap } from './CLIENT'
import { Server, ServerMap, ServerResponse } from './SERVER'


const server_url = import.meta.env.VITE_API_ADDRESS

// Fetcher is responsible for dispatching requests to the server at the appropriate API endpoints and populating its responses object with the server responses.
export class Fetcher {
    responses: ServerResponse<keyof ServerMap>[]
    
    constructor() {
        this.responses = []
    }
    
    // Fetch dispatches the HTTP Request to the endpoint, stores responses in the responses member of fetcher, and calls the callback function when complete
    async fetch<T extends keyof ClientMap>(APIendpoint: T, httpmethod: ClientMap[T][1], data: ClientMap[T][0], callback: () => void) {
        let targetURL = server_url + "/" + APIendpoint
        
        await fetch(targetURL, {
            method: httpmethod,
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
            
        }).then((res) => {
            return res.json()
        }).then((jsonArray)=> {
            this.responses = jsonArray
        }).catch((error)=> {
            console.error(`Error fetching from server!`, error)
            let message : Server.Message = {
                Success: false,
                Text: "Error fetching from server!"
            }
            let event = new CustomEvent<Server.Message>("FrontEndError", {
                detail: message
            })
            document.dispatchEvent(event)
        })
        
        callback()
    }
    
    getAndClearResponses(): ServerResponse<keyof ServerMap>[] {
        let backup = this.responses
        this.responses = []
        return backup
    }
}
