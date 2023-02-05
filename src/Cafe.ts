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
    // dispatcher
    constructor() {
        this.fetcher = new Fetcher()
        this.state = new State()
        this.navbar = new CafeNavBar()
        document.body.append(this.navbar.el)


        this.setClientEventListeners()
    }

    // Called as part of the constructor to set listeners for ClientEvents.
    setClientEventListeners() {
        let my = this // to scope Cafe into callbacks
        document.addEventListener("register", (ev)=>{
            let data = ev.detail
            console.log("REGISTER EVENT RECEIVED WITH DATA: ", data)
            my.fetcher.fetch("register", "POST", data, my.checkForResponses)
        })
    }

    // checkForResponses is called as a callback after every fetch. The server responses array is retrieved from the fetcher and passed to the dispatcher, along with a reference to cafe so the dispatcher can call the correct methods to realize the information retrieved from the server
    checkForResponses() {
        let responses = this.fetcher.getAndClearResponses()
        // call dispatcher
    }
}