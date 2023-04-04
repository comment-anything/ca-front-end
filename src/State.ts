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
        console.log("Got state change request!", newstate as State)
        
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
            Object.assign(this.settings, newstate.settings)
        }
        
        let ev = new CustomEvent<State>("StateChanged", { detail: this })
        document.dispatchEvent(ev)
    }
    
    /** Called in response to an event emitted when some component wants to change the client-side settings. */
    settingsUpdate(settingsChange: Partial<Settings>) {
        console.log("settingsChangeRequest received", settingsChange)
        if(settingsChange.viewHidden != undefined) {
            this.settings.viewHidden = settingsChange.viewHidden
        }
        if(settingsChange.sortedBy != undefined) {
            this.settings.sortedBy = settingsChange.sortedBy
        }
        if(settingsChange.sortAscending != undefined) {
            this.settings.sortAscending = settingsChange.sortAscending
        }
        if(settingsChange.onPseudoUrlPage != undefined) {
            this.settings.onPseudoUrlPage = settingsChange.onPseudoUrlPage
        }
        if(settingsChange.url != undefined) {
            this.settings.url = settingsChange.url
        }
        settingsChangeEmit(this.settings)

    }

    // Changes ownProfile member. If nothing is passed in, the loaded user profile is cleared.
    loadProfile(userProfile?:{LoggedInAs: Server.UserProfile, Email: string}, preventStateChange?:boolean) {
        this.ownProfile = userProfile
        if(this.ownProfile && (this.viewing != "comments") && !preventStateChange) this.viewing = "none"
        else if(this.ownProfile == undefined && preventStateChange != true) this.viewing = "login"
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

