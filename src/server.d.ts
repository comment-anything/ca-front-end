
export type ServerMap = {
    "Message": Server.Message,
    "LoginResponse" : Server.LoginResponse
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

    type LoginResponse = {
        LoggedInAs: UserProfile
    }

    type UserProfile = {
        UserId : number,
        Username : string,
        CreatedOn : number,
        DomainsModerating : string,
        IsAdmin : boolean,
        IsDomainModerator : boolean,
        IsGlobalModerator : boolean,
        ProfileBlurb : string
    }
    
}
