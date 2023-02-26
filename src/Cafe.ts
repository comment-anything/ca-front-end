import { Client } from "./CLIENT";
import { Dispatcher } from "./dispatcher";
import { Fetcher } from "./fetcher";
import { CafeNavBar } from "./navbar";
import { State } from "./State";



/** Holds comment sorting settings configured by the user */
export type CafeSettings = {
    viewHidden    : boolean,
    sortAscending : boolean,
    sortBy        : Client.SortOption
}



/** Cafe stands for "Comment Anywhere Front End". Cafe is the base class that is composed of other major classes used in the Front end. It is responsible for updating the State and listening for user input events on the DOM, and transmitting them to the fetcher when appropriate. 
 @listens StateEvent
 @listens CafeEvent

**/
export class Cafe {

    fetcher: Fetcher
    state: State
    navbar: CafeNavBar;
    dispatcher: Dispatcher
    sortSettings: CafeSettings
    
    constructor() {
        this.fetcher = new Fetcher()
        this.state = new State()
        this.navbar = new CafeNavBar()
        this.dispatcher = new Dispatcher()
        this.setClientEventListeners()
        this.setStateEventListeners()
        this.setClientLocalListeners()
        this.navbar.setFromState(this.state)
        
        this.sortSettings = {
            viewHidden    : false,
            sortAscending : true,
            sortBy        : "new"
        }
    }
    
    // Called as part of the constructor to set listeners for ClientEvents.
    setClientEventListeners() {
        let my = this // to scope Cafe into callbacks
        let retrieveResponses = my.checkForResponses.bind(this)
        document.addEventListener("register", (ev)=>{
            let data = ev.detail
            console.log("REGISTER EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("register", "POST", data, retrieveResponses)
        })
        document.addEventListener("login", (ev)=>{
            let data = ev.detail
            console.log("LOGIN EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("login", "POST", data, retrieveResponses)
        })
        document.addEventListener("logout", (ev)=>{
            let data = ev.detail
            console.log("LOGOUT EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("logout", "PUT", data, retrieveResponses)
        })
        document.addEventListener("pwResetReq", (ev)=>{
            let data = ev.detail
            console.log("FORGOT PASSWORD EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("pwResetReq", "POST", data, retrieveResponses)
        })
        document.addEventListener("newPassword", (ev)=>{
            let data = ev.detail
            console.log("SET NEW PASSWORD EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("newPassword", "POST", data, retrieveResponses)
        })
        document.addEventListener("changeEmail", (ev)=> {
            let data = ev.detail
            console.log("CHANGE EMAIL EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("changeEmail", "POST", data, retrieveResponses)
        })
        document.addEventListener("changeProfile", (ev)=> {
            let data = ev.detail
            console.log("CHANGE PROFILE BLURB EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("changeProfile", "POST", data, retrieveResponses)

        })
        document.addEventListener("getComments", (ev)=> {
            let data = ev.detail
            console.log("GET COMMENTS EVENT RECEIVED WITH DATA: ", data)
            // Cant do this with GET! Get requests can't have a body! Everything will be post!
            my.fetcher.fetch("getComments", "POST", data, retrieveResponses)
        })
        document.addEventListener("newComment", (ev)=> {
            let data = ev.detail
            console.log("NEW COMMENT EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("newComment", "POST", data, retrieveResponses)
        })
        document.addEventListener("voteComment", (ev)=> {
            let data = ev.detail
            console.log("NEW COMMENT EVENT RECEIVED WITH DATA: ", data)
            // Cant do this with GET! Get requests can't have a body! Everything will be post!
            my.fetcher.fetch("voteComment", "POST", data, retrieveResponses)
        })
        document.addEventListener("viewUsersReport", (ev)=> {
            let data = ev.detail
            console.log("NEW VIEW USERSREPORT EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("viewUsersReport", "POST", data, retrieveResponses)
        })
        
        document.addEventListener("viewFeedback", (ev)=> {
            let data = ev.detail
            console.log("NEW VIEW FEEDBACK EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("viewFeedback", "POST", data, retrieveResponses)
        })

        // Front End error catch
        document.addEventListener("FrontEndError", (ev)=> {
            console.error("Front End Error!")
            my.navbar.message.updateMessage(ev.detail)
        })
    }
    
    /** Called as part of the constructor to set listens for StateEvents. */
    setStateEventListeners() {
        let my = this
        document.addEventListener("StateChangeRequest", (ev)=>{
            my.state.setViewingTo(ev.detail)
        })
        document.addEventListener("StateChanged", ()=> {
            console.log("state change event received", my.state)
            my.navbar.setFromState(my.state)
        })
    }
    
    setClientLocalListeners() {
        document.addEventListener("SortSettingsUpdate", () => {
            alert("SETTINGS GLOBAL UPDATED")
        })
    }

    // checkForResponses is called as a callback after every fetch. The server responses array is retrieved from the fetcher and passed to the dispatcher, along with a reference to cafe so the dispatcher can call the correct methods to realize the information retrieved from the server
    checkForResponses() {
        let responses = this.fetcher.getAndClearResponses()
        console.log("🎅🤶🤶 All server responses:", responses)
        this.dispatcher.dispatch(responses, this)
    }
}