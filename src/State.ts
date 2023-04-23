import { Server } from "./communication/SERVER";
import { Settings } from "./Settings";

export type StateView = "register" | "login" | "logout" | "forgotpassword" | "newPassword" | "comments" | "settings" | "moderation" | "reports" | "none" | "admin"

// State holds the current state of the front end, including who is logged in and what window is being viewed. Cafe passes State to NavBar to realize a state change.
export class State {
    viewing     : StateView
    ownProfile? : { LoggedInAs: Server.UserProfile, Email: string }
    settings    : Settings
    
    constructor() {
        this.viewing = "register"
        this.settings = new Settings()
        settingsChangeEmit(this.settings)
    }
    
    stateChangeRequest(newstate: Partial<State>) {
        console.log("STATE.ts: Got state change request!", newstate as State)
        
        if(newstate.ownProfile) {
            if(this.ownProfile) {
                Object.assign(this.ownProfile, newstate.ownProfile)
            } else {
                this.ownProfile = newstate.ownProfile
            }
        }
        
        if (newstate.viewing) {
            this.viewing = newstate.viewing
        }
        
        if(newstate.settings) {
            this.settings.settingsUpdate(newstate.settings)
        }
        
        let ev = new CustomEvent<State>("StateChanged", { detail: this })
        document.dispatchEvent(ev)
    }
    

    // Changes ownProfile member. If nothing is passed in, the loaded user profile is cleared.
    loadProfile(userProfile?:{LoggedInAs: Server.UserProfile, Email: string}, preventStateChange?:boolean) {
        this.ownProfile = userProfile
        if(this.ownProfile == undefined && preventStateChange != true) {
            if(this.viewing != "comments" && this.viewing != "login" && this.viewing != "register") {
                console.log("State.ts: Forcing view to login.")
                this.viewing = "login"
            }
        } else {
            if(this.viewing == "admin" && this.ownProfile?.LoggedInAs.IsAdmin != true ){
                console.log("State.ts: Not admin; Forcing view to settings.")
                this.viewing = "settings"
            }
            if(this.viewing == "moderation" && this.ownProfile?.LoggedInAs.IsDomainModerator != true && this.ownProfile?.LoggedInAs.IsGlobalModerator != true) {
                console.log("State.ts: Not moderator; Forcing view to settings.")
                this.viewing = "settings"
            }
            if(this.viewing == "login" || this.viewing == "register") {
                console.log("State.ts: Not logged out, forcing view to settings.")
                this.viewing = "settings"
            }
        }
        stateChangeEmit(this);
    }
}

// Realizes a view change and dispatches a StateChange event to the document. This should be private and inaccessible.
function stateChangeEmit(newState:State) {
    let event = new CustomEvent<Partial<State>>("StateChanged", { detail: newState})
    document.dispatchEvent(event)
}

function settingsChangeEmit(settings:Settings) {
    let event = new CustomEvent<Settings>("SettingsChange", { detail: settings })
    document.dispatchEvent(event)
}

