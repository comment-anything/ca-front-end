import { Dispatcher } from "./dispatcher";
import { Fetcher } from "./fetcher";
import { CafeNavBar } from "./navbar";
import { State } from "./State";

/** Cafe stands for "Comment Anywhere Front End". Cafe is the base class that is composed of other major classes used in the Front end. It is responsible for updating the State and listening for user input events on the DOM, and transmitting them to the fetcher when appropriate. 
 @listens StateEvent
 @listens CafeEvent

**/
export class Cafe {

    fetcher: Fetcher
    state: State
    navbar: CafeNavBar;
    dispatcher: Dispatcher
    
    constructor() {
        this.fetcher = new Fetcher()
        this.state = new State()
        this.navbar = new CafeNavBar()
        this.dispatcher = new Dispatcher()
        this.setClientEventListeners()
        this.setStateEventListeners()
        this.navbar.setFromState(this.state)
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

    // checkForResponses is called as a callback after every fetch. The server responses array is retrieved from the fetcher and passed to the dispatcher, along with a reference to cafe so the dispatcher can call the correct methods to realize the information retrieved from the server
    checkForResponses() {
        let responses = this.fetcher.getAndClearResponses()
        console.log("🎅🤶🤶 All server responses:", responses)
        this.dispatcher.dispatch(responses, this)
    }
}