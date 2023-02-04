
import { ClientMap, Fetcher, ServerMap } from "./Fetcher"
import { Dispatcher } from "./Dispatcher"
import { Server } from "./Server"

export class Cafe {
    fetcher: Fetcher
    dispatcher: Dispatcher
    globalMessage: string
    
    constructor() {
        this.fetcher = new Fetcher()
        this.dispatcher = new Dispatcher()
        this.globalMessage = ""
    }
    
    displayMessage(data: Server.Message) {
        this.globalMessage = data.message
        console.log(data.message)
    }
}