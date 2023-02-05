import { Server } from "./SERVER";


type view = "register" | "login" | "forgotpassword" | "comments" | "settings" | "moderation" | "reports"

// State holds the current state of the front end, including who is logged in and what window is being viewed. Cafe passes State to NavBar to realize a state change.
export class State {
    viewing: view
    ownProfile?: Server.UserProfile
    constructor() {
        this.viewing = "register"
    }

    // Changes the viewing member of State to the parameter value.
    setViewingTo(newView:view) {
        this.viewing = newView
    }

    // Changes ownProfile member. If nothing is passed in, the loaded user profile is cleared.
    loadProfile(userProfile?:Server.UserProfile) {
        this.ownProfile = userProfile
    }
}