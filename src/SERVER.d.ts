
export type ServerMap = {
    "Message"               : Server.Message,
    "LoginResponse"         : Server.LoginResponse,
    "LogoutResponse"        : Server.LogoutResponse,
    "ProfileUpdateResponse" : Server.ProfileUpdateResponse,
    "Token"                 : Server.Token,
    "NewPassResponse"       : Server.NewPassResponse
    "FullPage"       : Server.FullPage
    "Comment"       : Server.Comment
    "AdminUsersReport" : Server.AdminUsersReport
    "FeedbackReport" : Server.FeedbackReport
}

export type ServerResponse<T extends keyof ServerMap> = {
    Name : T
    Data : ServerMap[T]
}

export namespace Server {
    
    /** Message is a general communication entity used to provide feedback to the client. */
    type Message = {
        Success : boolean
        Text    : string
    }

    /** LoginResponse is sent to the client when they successfully log in. */
    type LoginResponse = {
        LoggedInAs : UserProfile
        Email      : string
    }
    
    /** ProfileUpdateResponse is dispatched to the client when a change to their profile has been realized on the server. */
    type ProfileUpdateResponse = {
        LoggedInAs : UserProfile
        Email      : string
    }
    
    /** LogoutResponse is sent to the client when they succesfully log out. */
    type LogoutResponse = {}

    /** UserProfile contains data needed by the Front End to display a profile for a user. */
    type UserProfile = {
        UserId            : number,
        Username          : string,
        CreatedOn         : number,
        DomainsModerating : string,
        IsAdmin           : boolean,
        IsDomainModerator : boolean,
        IsGlobalModerator : boolean,
        ProfileBlurb      : string
    }
    
    
    /** Dispatched to the client when the user submits a password reset code and new password, to indicate if it was successful. */
    type NewPassResponse = {
        Success : boolean
        Text    : string
    }

    /** Token provides the front end with an authentication key they can use to stay logged in. */
    type Token = {
        JWT : string
    }

        
    /** CommentVoteRecord contains data for the number of votes on a comment. */
    type CommentVoteDimension = {
        AlreadyVoted : number
        Downs        : number
        Ups          : number
    }

    /** Comment provides the data the Front End needs to render a comment. */
    type Comment = {
        UserId     : number
        Username   : string
        CommentId  : number
        Content    : string
        Factual    : CommentVoteDimension
        Funny      : CommentVoteDimension
        Agree      : CommentVoteDimension
        Hidden     : boolean
        Parent     : number
        Removed    : boolean
        TimePosted : number
    }

    /** FullPage is returned when a user first requests comments for a new page. It contains an array of all comment data for that page. */
    type FullPage = {
        Comments : Comment[]
    }

    /** AdminUsersReport is dispatched when an Admin requests the Users report */
    type AdminUsersReport = {
        LoggedInUserCount :number
        NewestUserId : number
        NewestUsername : string
        UserCount : number
    }

    type FeedbackType = "bug" | "feature" | "general"

    /** FeedbackRecord contains data the Front End needs to render a FeedbackRecord, which is a record of a user-submitted feedback, viewed by an Admin, such as a feature request, or bug report. */
    type FeedbackRecord = {
        Content : string
        Hide : boolean
        ID : number
        SubmittedAt: number
        FeedbackType : string
        UserID : number
        Username : string 
    }

    /** FeedbackReport contains an array of feedbackRecords based on the admin's requesting parameters. */
    type FeedbackReport = {
        Records : FeedbackRecord[]
    }
}
