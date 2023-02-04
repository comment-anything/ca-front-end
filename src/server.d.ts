
export type ServerMap = {
    "message": Server.Message
}

export type ServerResponse<T extends keyof ServerMap> = {
    Response : T
    Data     : ServerMap[T]
}

export namespace Server {
    
    // Message is a general communication entity used to provide feedback to the client.
    type Message = {
        Success : boolean
        Message : string
    }
    
}
