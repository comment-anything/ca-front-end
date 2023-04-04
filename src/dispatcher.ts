
import { Cafe } from "./Cafe";
import { CafeNavBar } from "./navbar";
import { ServerResponse, Server, ServerMap } from "./communication/SERVER";

// Dispatcher is responsible for parsing an array of server responses and dispatching them to the appropriate objects around the front end for rendering to the user.
export class Dispatcher {
    
    /** Dispatch uses the “Name” field of the ServerResponse to determine what kind of information is contained in the “Data” field. The “Name” field determines which Dispatcher method is next called, and the object which will render the data is retrieved using the parameter reference to Cafe. */
    dispatch(packets:ServerResponse<any>[], cafe: Cafe) {
        for(let datum of packets) {
            console.log("Dispatching " + datum ? datum.Name ? datum.Name : "?" : "?");
            
            switch(datum.Name as keyof ServerMap) {
                case "Message":
                    this.dispatchMessage(datum.Data as Server.Message, cafe.navbar)
                    break;
                    
                case "LoginResponse":
                    let lr = datum.Data as Server.LoginResponse
                    this.dispatchUserUpdate(lr, cafe)
                    break;
                    
                case "ProfileUpdateResponse":
                    let pupd = datum.Data as Server.ProfileUpdateResponse
                    this.dispatchProfileUpdateResponse(pupd, cafe)
                    
                case "Token":
                    let tok = datum.Data as Server.Token
                    this.dispatchToken(tok, cafe)
                    break;

                case "NewPassResponse":
                    let npr = datum.Data as Server.NewPassResponse
                    this.dispatchNewPassResponse(npr, cafe)
                    break;
                    
                case "FullPage":
                    let fp = datum.Data as Server.FullPage
                    this.dispatchFullPageResponse(fp, cafe)
                    break;
                    
                case "Comment":
                    let c = datum.Data as Server.Comment
                    this.dispatchCommentUpdate(c, cafe)
                    break;
                    
                case "LogoutResponse":
                    this.dispatchUserUpdate(undefined, cafe);
                    break;
                    
                case "FeedbackReport":
                    let fr = datum.Data as Server.FeedbackReport
                    this.dispatchFeedbackReport(fr, cafe);
                    break;
                    
                case "AdminUsersReport":
                    let aup = datum.Data as Server.AdminUsersReport
                    this.dispatchUsersReport(aup, cafe);
                    break;
                
                case "CommentReport":
                    let cr = datum.Data as Server.CommentReport
                    this.dispatchCommentReport(cr, cafe)
                    break
                
                case "CommentReports":
                    let crs = datum.Data as Server.CommentReports
                    this.dispatchCommentReports(crs, cafe)
                    break
                case "AdminAccessLogs":
                    let aal = datum.Data as Server.AdminAccessLogs
                    this.dispatchAdminAccessLogs(aal, cafe)
                    break
            }
        }
    }
    
    /** dispatchToken calls setToken on the fetcher object */
    dispatchToken(token: Server.Token, cafe: Cafe) {
        cafe.fetcher.setToken(token.JWT)
    }
    
    /** dispatchMessage calls displayMessage on the CafeNavbar.message object */
    dispatchMessage(message:Server.Message, navbar:CafeNavBar) {
        navbar.message.updateMessage(message)
    }

    /** dispatchFullPageResponse calls populateNewComments on commentsWindow */
    dispatchFullPageResponse(message: Server.FullPage, cafe: Cafe) {
        cafe.navbar.window.comments.populateNewComments(message)
    }

    /** dispatchCommentUpdate calls updateComment on commentsWindow */
    dispatchCommentUpdate(message: Server.Comment, cafe:Cafe) {
        cafe.navbar.window.comments.updateComment(message)
    }
    
    /** dispatchUserUpdate calls userChange on the Cafe root object to change state reflecting any changes that may have happened to the User and to change what is visible on their profile */
    dispatchUserUpdate(userProfile:Server.LoginResponse | undefined, cafe:Cafe) {
        cafe.state.loadProfile(userProfile, false)
        
    }
    
    /**
     * dispatchProfileUpdateResponse calls update on own profile so changes to ones owwn profile are visible. 
     */
    dispatchProfileUpdateResponse(userProfileResponse: Server.ProfileUpdateResponse, cafe: Cafe) {
        cafe.state.loadProfile(userProfileResponse, true)
    }

    /** dispatchNewPassResponse sends the response to the newPassWindow so it can request a state change on success and also dispatches it to the message display so errors and success messages can be displayed. */
    dispatchNewPassResponse(newpassresponse:Server.NewPassResponse, cafe:Cafe) {
        cafe.navbar.window.setNewPassword.parseNewPassResponse(newpassresponse)
        this.dispatchMessage(newpassresponse as Server.Message, cafe.navbar)
    }

    dispatchFeedbackReport(feedbackReport: Server.FeedbackReport, cafe:Cafe) {
        cafe.navbar.window.admin.feedbackReport.update(feedbackReport.Records)
    }
    
    dispatchUsersReport(usersReport: Server.AdminUsersReport, cafe:Cafe) {
        cafe.navbar.window.admin.usersReport.update(usersReport)
    }
    
    dispatchCommentReport(commentReport: Server.CommentReport, cafe: Cafe) {
        cafe.navbar.window.moderator.reports.updateCommentReport(commentReport)
    }
    
    dispatchCommentReports(commentReports: Server.CommentReports, cafe: Cafe) {
        cafe.navbar.window.moderator.reports.populateCommentReports(commentReports.Reports)
    }

    dispatchAdminAccessLogs(accessLogs: Server.AdminAccessLogs, cafe: Cafe) {
        cafe.navbar.window.admin.accessLogs.update(accessLogs.Logs)
    }
}

