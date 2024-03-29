
export type ServerMap = {
    "Message"               : Server.Message,
    "LoginResponse"         : Server.LoginResponse,
    "LogoutResponse"        : Server.LogoutResponse,
    "ProfileUpdateResponse" : Server.ProfileUpdateResponse,
    "Token"                 : Server.Token,
    "NewPassResponse"       : Server.NewPassResponse
    "FullPage"              : Server.FullPage
    "Comment"               : Server.Comment
    "AdminUsersReport"      : Server.AdminUsersReport
    "FeedbackReport"        : Server.FeedbackReport
    "CommentReport"         : Server.CommentReport
    "CommentReports"        : Server.CommentReports
    "AdminAccessLogs"       : Server.AdminAccessLogs
    "ModRecord"             : Server.ModRecord
    "ModRecords"            : Server.ModRecords
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
        DomainsModerating : string[],
        DomainsBannedFrom : string[]
        IsVerified        : boolean
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
        Domain   : string
        Path     : string
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
    
    /** GlobalModeratorRecord provides the  */
    type GlobalModeratorRecord = {
        GrantedAt         : number
        GrantedByUsername : string
        GrantedToUsername : string
    }
    
    type CommentReport = {
        ActionTaken       : boolean
        CommentData       : Server.Comment
        ReasonReported    : string
        ReportId          : number
        ReportingUserID   : number
        ReportingUsername : string
        TimeReported      : number
        Domain            : string
    }
    
    type CommentReports = {
        Reports : CommentReport[]
    }
    /** AdminAccessLogs are dispatched when an admin wants to see what IPs have been accessing the server, which users are associated with them, and what endpoints they are accessing. */
    type AdminAccessLog = {
        LogId    : number
        Ip       : string
        Url      : string
        AtTime   : number
        UserId   : number
        Username : string
    }
    /** AdminAccessLogs are dispatched when an admin wants to see what IPs have been accessing the server, which users are associated with them, and what endpoints they are accessing. */
    type AdminAccessLogs = {
        Logs : AdminAccessLog[]
    }
    
    type ModRecord = {
        Comment            : Server.Comment
        Domain             : string
        ModeratorID        : number
        ModeratorUsername  : string
        Reason             : string
        Time               : number
        SetHiddenTo?       : boolean
        SetRemovedTo?      : boolean
        AssociatedReport?  : number
        ReportingUserID?   : number
        ReportingUsername? : string
        ReportReason?      : string
        ReportedAt         : number
    }
    
    type ModRecords = {
        Records: ModRecord[]
    }
}
