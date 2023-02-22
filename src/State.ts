import { Server } from "./SERVER";


export type StateView = "register" | "login" | "logout" | "forgotpassword" | "newPassword" | "comments" | "settings" | "moderation" | "reports" | "none" | "admin"

// State holds the current state of the front end, including who is logged in and what window is being viewed. Cafe passes State to NavBar to realize a state change.
export class State {
    viewing: StateView
    ownProfile?: {LoggedInAs: Server.UserProfile, Email: string}
    constructor() {
        this.viewing = "register"
    }

    // Changes the viewing member of State to the parameter value.
    setViewingTo(newView:StateView) {
        console.log("state change requested to ", newView)
        
        switch(newView) {
            case "register":
                if(this.ownProfile == undefined) {
                    this.viewing = newView
                    stateChangeEmit(newView)
                }
                break;
                
            case "login":
                if(this.ownProfile == undefined) {
                    this.viewing = newView
                    stateChangeEmit(newView)
                } else {
                    this.viewing = "settings"
                    stateChangeEmit(this.viewing)
                }
                break;
                
            case "none":
                this.ownProfile = undefined
                this.viewing = newView
                stateChangeEmit(newView)
                break;
                

                
            case "forgotpassword":
                this.viewing = newView
                stateChangeEmit(newView)
                break;
                
            case "settings":
                this.viewing = newView
                stateChangeEmit(newView)
                break;
                
            default:
                this.viewing = newView
                stateChangeEmit(newView)
                break;
        }
    }

    // Changes ownProfile member. If nothing is passed in, the loaded user profile is cleared.
    loadProfile(userProfile?:{LoggedInAs: Server.UserProfile, Email: string}, preventStateChange?:boolean) {
        this.ownProfile = userProfile
        if(this.ownProfile && preventStateChange != true) this.viewing = "none"
        else if(this.ownProfile == undefined && preventStateChange != true) this.viewing = "login"
        stateChangeEmit(this.viewing);
    }
}

// Realizes a view change and dispatches a StateChange event to the document. This should be private and inaccessible.
function stateChangeEmit(newView:StateView) {
    let event = new CustomEvent<StateView>("StateChanged", { detail: newView})
    document.dispatchEvent(event)
}

