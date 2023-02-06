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
        document.addEventListener("register", (ev)=>{
            let data = ev.detail
            console.log("REGISTER EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("register", "POST", data, my.checkForResponses.bind(my))
        })
        document.addEventListener("FrontEndError", (ev)=> {
            console.error("Front End Error!")
            my.navbar.message.updateMessage(ev.detail)
        })
    }
    
    // Called as part of the constructor to set listens for StateEvents.
    setStateEventListeners() {
        let my = this
        document.addEventListener("StateChangeRequest", (ev)=>{
            my.state.setViewingTo(ev.detail)
        })
        document.addEventListener("StateChanged", ()=> {
            my.navbar.setFromState(my.state)
        })
    }

    // checkForResponses is called as a callback after every fetch. The server responses array is retrieved from the fetcher and passed to the dispatcher, along with a reference to cafe so the dispatcher can call the correct methods to realize the information retrieved from the server
    checkForResponses() {
        let responses = this.fetcher.getAndClearResponses()
        console.log("All server responses:", responses)
        this.dispatcher.dispatch(responses, this)
    }
}