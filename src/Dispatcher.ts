
import { ServerMap, ServerResponse } from "./Fetcher"
import { Server } from "./Server"
import { Cafe } from "./Cafe"

export class Dispatcher {
    
    dispatch(serverData: ServerResponse<keyof ServerMap>[], cafe: Cafe) {
        for (let datum of serverData) {
            switch (datum.t) {
                case "Message":
                    this.dispatchMessage(datum.d as Server.Message, )
            }
        }
    }
    
    dispatchMessage(d: Server.Message, target: Cafe)
    
}