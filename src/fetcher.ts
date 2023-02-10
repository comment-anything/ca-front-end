
import { ClientMap } from './CLIENT'
import { Server, ServerMap, ServerResponse } from './SERVER'


const server_url = import.meta.env.VITE_API_ADDRESS
const cookie_name = import.meta.env.VITE_JWT_COOKIE_NAME

// Fetcher is responsible for dispatching requests to the server at the appropriate API endpoints and populating its responses object with the server responses.
export class Fetcher {
    responses: ServerResponse<keyof ServerMap>[]

    /* The last JWT token that the server provided. */
    token: string
    
    constructor() {
        this.responses = []
        this.token = ""
    }
    
    // Fetch dispatches the HTTP Request to the endpoint, stores responses in the responses member of fetcher, and calls the callback function when complete
    async fetch<T extends keyof ClientMap>(APIendpoint: T, httpmethod: ClientMap[T][1], data: ClientMap[T][0], callback: () => void) {
        let targetURL = server_url + "/" + APIendpoint
        
        let myheaders = new Headers()
        myheaders.set("Content-Type", "application/json")
        myheaders.set(cookie_name, this.token)

        await fetch(targetURL, {
            method: httpmethod,
            mode: "cors",
            headers: myheaders,
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

    /** Sets the token that will be sent with the next request as supplied by a previous server response. */
    setToken(newToken: string) {
        this.token = newToken
    }
}
