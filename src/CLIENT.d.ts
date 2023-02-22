

/** Typing for standard HTTPMethods. */
type HTTPMethod = {
    POST : "POST",
    GET  : "GET",
    PUT  : "PUT"
}

/** ClientMap maps API end points with the expected JSON data type for that endpoint. For example, "commentAnywhere.com/register" expects to receive an HTTP request with a body of type Client.Register. See page 148 of the Design doc for endpoint names. */
export type ClientMap = {
    'register': [Client.Register, HTTPMethod.POST],
    'login': [Client.Login, HTTPMethod.POST],
    'logout': [Client.Logout, HTTPMethod.PUT],
    'pwResetReq': [Client.PasswordReset, HTTPMethod.POST],
    'pwResetCode': [Client.PasswordResetCode, HTTPMethod.POST],
    'newPassword': [Client.SetNewPass, HTTPMethod.POST],
    "changeEmail": [Client.ChangeEmail, HTTPMethod.POST],
    "changeProfile": [Client.ChangeProfileBlurb, HTTPMethod.POST],
    "getComments": [Client.GetComments, HTTPMethod.POST],
    "newComment": [Client.CommentReply, HTTPMethod.POST],
    "voteComment": [Client.CommentVote, HTTPMethod.POST]

}

/** The Client namespace contains data structures that are sent to the server. Descriptions start on page 48 of the Design Document. */
export namespace Client {
    
    /** Register is dispatched to the server when the client clicks “Submit” on the register form. */
    type Register = {
        Username       : string  // Account username
        Password       : string  // Account password
        RetypePassword : string  // Retyped password for authentication
        Email          : string  // Associated email for account
        AgreedToTerms  : boolean // Indicate if the user agreed to the terms of service
    }
    
    /** Login is dispatched to the server when the client clicks “Submit” on the login form */
    type Login = {
        Username : string  // Account username
        Password : string  // Account password
    }
    
    /** Logout is dispatched to the server when the client clicks “Logout”. It does not carry any additional data. */
    type Logout = {}
    
    /** PasswordReset is dispatched to the server when a password reset is requested. The client supplies the email associated with their account. */
    type PasswordReset = {
        Email: string
    }

    /** SetNewPass is dispatched to the Server when the user changes their password. After submitting a valid password reset code, users are prompted to set a new password. When they subsequently click “submit”, this request is dispatched to the server. */
    type SetNewPass = {
        Email          : string
        Code           : number
        Password       : string
        RetypePassword : string 
    }
    
    /** ChangeProfileBlurb is dispatched to the server when a client updates their profile blurb */
    type ChangeProfileBlurb = {
        NewBlurb : string
    }

    /** ChangeEmail is dispatched to the server when a client wants to change their email. They must supply the correct password as well. */
    type ChangeEmail = {
        NewEmail : string
        Password : string

    }

    /** CommentReply is dispatched to the server when a logged-in user submits a reply to an existing comment or posts a new root-level comment on a page. */
    type CommentReply = {
        ReplyingTo : number
        Reply      : string
    }

    type VoteType = "funny" | "factual" | "agree"

    /** CommentVote is dispatched to the server when a logged-in user votes on a comment. */
    type CommentVote = {
        VotingOn : number
        VoteType : VoteType
        Value    : number
    }

    type SortOption = "new" | VoteType

    /** GetComments is dispatched to the server when a user opens the Browser Extension or when they navigate to a new page with the browser extension over. It is a request for all comments associated with the given url. */
    type GetComments = {
        Url           : string
        SortedBy      : SortOption
        SortAscending : boolean
    }
}

