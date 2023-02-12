
export type ServerMap = {
    "Message": Server.Message,
    "LoginResponse" : Server.LoginResponse,
    "LogoutResponse": Server.LogoutResponse,
    "Token": Server.Token,
    "NewPassResponse": Server.NewPassResponse
}

export type ServerResponse<T extends keyof ServerMap> = {
    Name : T
    Data : ServerMap[T]
}

export namespace Server {
    
    /** Message is a general communication entity used to provide feedback to the client. */
    type Message = {
        Success : boolean
        Text : string
    }

    /** LoginResponse is sent to the client when they successfully log in. */
    type LoginResponse = {
        LoggedInAs: UserProfile
    }

    /** LogoutResponse is sent to the client when they succesfully log out. */
    type LogoutResponse = {}

    /** UserProfile contains data needed by the Front End to display a profile for a user. */
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
    
    
    /** Dispatched to the client when the user submits a password reset code and new password, to indicate if it was successful. */
    type NewPassResponse = {
        Success : boolean
        Text    : string
    }

    /** Token provides the front end with an authentication key they can use to stay logged in. */
    type Token = {
        JWT: string
    }
}
