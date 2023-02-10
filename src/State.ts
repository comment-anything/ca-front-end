import { Server } from "./SERVER";


export type StateView = "register" | "login" | "logout" | "forgotpassword" | "comments" | "settings" | "moderation" | "reports" | "none"

// State holds the current state of the front end, including who is logged in and what window is being viewed. Cafe passes State to NavBar to realize a state change.
export class State {
    viewing: StateView
    ownProfile?: Server.UserProfile
    constructor() {
        this.viewing = "register"
    }

    // Changes the viewing member of State to the parameter value.
    setViewingTo(newView:StateView) {
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
                }
                break;
            case "none":
                this.ownProfile = undefined
                this.viewing = newView
                stateChangeEmit(newView)
            default:
                break;
        }
    }



    // Changes ownProfile member. If nothing is passed in, the loaded user profile is cleared.
    loadProfile(userProfile?:Server.UserProfile) {
        this.ownProfile = userProfile
        if(this.ownProfile) this.viewing = "none"
        stateChangeEmit(this.viewing);
    }
}

// Realizes a view change and dispatches a StateChange event to the document. This should be private and inaccessible.
function stateChangeEmit(newView:StateView) {
    let event = new CustomEvent<StateView>("StateChanged", { detail: newView})
    document.dispatchEvent(event)
}