import { Dispatcher } from "./dispatcher";
import { Fetcher } from "./communication/fetcher"
import { CafeNavBar } from "./navbar";
import { State } from "./State";
import { ClientMap } from "./communication/CLIENT"

import { T_ExtensionMsg as M } from "./communication/EXTENSTION";
import { Settings } from "./Settings";

const browser_storage_key = import.meta.env.VITE_BROWSER_STORAGE_KEY

type SerializedData = {
    state : State,
    token : string
}

/** Cafe stands for "Comment Anywhere Front End". Cafe is the base class that is composed of other major classes used in the Front end. It is responsible for updating the State and listening for user input events on the DOM, and transmitting them to the fetcher when appropriate. 
 @listens StateEvent
 @listens CafeEvent

**/
export class Cafe {

    fetcher    : Fetcher
    state      : State
    navbar     : CafeNavBar
    dispatcher : Dispatcher
    
    constructor() {
        this.fetcher    = new Fetcher()
        this.state      = new State()
        this.navbar     = new CafeNavBar()
        this.dispatcher = new Dispatcher()
        this.checkActiveUrl = ()=>{}

        this.setBrowserEventListeners()
        this.setClientEventListeners()
        this.setStateEventListeners()
        this.deserializePick()
        
        if(typeof browser == "undefined") {
            console.warn("You are not using comment anywhere as an extension. This is dangerous, and your credentials could be stolen!")
        }
    }
    /**
     * Called with values retrieved from browser storage if running as an extension, otherwise, called with values from localStorage. 
     */
    deserialize(val:SerializedData) {
        console.log("Cafe.ts: attempting to deserialize", val)
        if(val) {
            if(val.state != undefined) {
                let ev = new CustomEvent<State>("StateChangeRequest", {
                    detail: val.state
                })
                document.dispatchEvent(ev)
            }
            if(val.token != undefined) {
                console.log("Cafe.ts: Setting token in fetcher to", val.token)
                this.fetcher.setToken(val.token)
            }
        } else {
            console.error("Cafe.ts: No information to deserialize!")
        }
    }
    /**
     * Determines whether CA is running in an extension and calls the appropriate deserialize method. 
     */
    deserializePick() {
        console.log("Cafe.ts: picking deserialization method")
        let me = this
        if(typeof browser != "undefined") {
            console.log("Cafe.ts: picking browser storage")
            browser.storage.local.get().then( (v)=>{
                console.log("Cafe.ts: got browser storage")
                if(v) {
                    try {
                        let parse = JSON.parse(v[browser_storage_key])
                        console.log("Cafe.ts: parsed", parse)
                        me.deserialize(parse as SerializedData)
                    } catch(e) {
                        console.log("Cafe.ts: Exception ", e)
                    }
                } else {
                    let x : SerializedData = {
                        state: {
                            viewing: "login",
                            settings: {
                                onPseudoUrlPage: false,
                                url: ""
                            } as Settings
                        } as State ,
                        token: ""
                    }
                    console.log("Created ", x)
                    me.deserialize(x)
                }
                if(!me.state.settings.onPseudoUrlPage) {
                    me.checkActiveUrl()
                } else {
                    /** Check if logged in when popup is opened */
                    me.fetcher.fetch("amILoggedIn", "POST", {Url: me.state.settings.url}, this.checkForResponses.bind(this))
                } 
            })
        } else {
            let vals = localStorage.getItem(browser_storage_key)
            if(vals) {
                try {
                    let parsed = JSON.parse(vals)
                    console.log("Cafe.ts: PARSED DATA:",parsed)
                    me.deserialize(parsed as SerializedData)
                } catch(e) {
                    console.log("Cafe.ts: Exception", e)
                }
            } else {
                let x : SerializedData = {
                    state: {
                        viewing: "login",
                        settings: {
                            onPseudoUrlPage: false,
                            url: ""
                        } as Settings
                    } as State ,
                    token: ""
                }
                me.deserialize(x)
            }
            /** Check if logged in when popup is opened */
            me.fetcher.fetch("amILoggedIn", "POST", {Url: me.state.settings.url}, this.checkForResponses.bind(this))
            
        }
    }

    /**
     * Determines whether CA is running in an extension and calls the appropriate serialize method. 
     */
    serialize() {
        let saved_data : SerializedData = {
            state: this.state,
            token: this.fetcher.token
        }
        if(typeof browser != "undefined") {
            browser.storage.local.set({
                [browser_storage_key]: JSON.stringify(saved_data)
            }
            ).then( ()=> {
                console.log("Cafe.ts: Browser saved this data:", saved_data)
            })
        } else {
            localStorage.setItem(browser_storage_key, JSON.stringify(saved_data))
            console.log("Cafe.ts: LocalStorage saved this data:", saved_data)
        }
    }
    
    /** Called when user logs out; clears the token from storage to prevent bugs */
    clearToken() {
        if(typeof browser != "undefined") {
            browser.storage.local.get(browser_storage_key).then( (v )=>{
                let serialized = v as SerializedData
                if(serialized) {
                    serialized.token = ""
                    serialized.state.ownProfile = undefined
                    browser.storage.local.set({
                        [browser_storage_key]: serialized
                    })                    
                }
            })
            // clear it from browser storage
        } else {
            let savedData = localStorage.getItem(browser_storage_key)
            
            if(savedData != undefined) {
                let parsed = JSON.parse(savedData) as SerializedData
                parsed.token = ""
                parsed.state.ownProfile = undefined
                localStorage.setItem(browser_storage_key, JSON.stringify(parsed))
            }
        }
    }
    
    addListenerWithFetch<K extends keyof ClientMap>(APIendpoint: K, httpmethod: ClientMap[K][1], retrieveResponses: ()=>void) {
        let cafe = this
        
        document.addEventListener(APIendpoint, (event) => {
            let data = event.detail
            console.log("Cafe.ts: Client Requested the \"" + APIendpoint + "\" endpoint. Sending data:", data)
            cafe.fetcher.fetch(APIendpoint, httpmethod, data, retrieveResponses)
        })
    }
    
    // Called as part of the constructor to set listeners for ClientEvents.
    setClientEventListeners() {
        let my = this // to scope Cafe into callbacks
        let retrieveResponses = my.checkForResponses.bind(this)
        
        my.addListenerWithFetch("register",                "POST", retrieveResponses)
        my.addListenerWithFetch("login",                   "POST", retrieveResponses)
        my.addListenerWithFetch("logout",                  "POST", retrieveResponses)
        my.addListenerWithFetch("pwResetReq",              "POST", retrieveResponses)
        my.addListenerWithFetch("newPassword",             "POST", retrieveResponses)
        my.addListenerWithFetch("changeEmail",             "POST", retrieveResponses)
        my.addListenerWithFetch("changeProfile",           "POST", retrieveResponses)
        my.addListenerWithFetch("getComments",             "POST", retrieveResponses)
        my.addListenerWithFetch("newComment",              "POST", retrieveResponses)
        my.addListenerWithFetch("voteComment",             "POST", retrieveResponses)
        my.addListenerWithFetch("viewUsersReport",         "POST", retrieveResponses)
        my.addListenerWithFetch("viewFeedback",            "POST", retrieveResponses)
        my.addListenerWithFetch("toggleFeedbackHidden",    "POST", retrieveResponses)
        my.addListenerWithFetch("newFeedback",             "POST", retrieveResponses)
        my.addListenerWithFetch("assignAdmin",             "POST", retrieveResponses)
        my.addListenerWithFetch("assignGlobalModerator",   "POST", retrieveResponses)
        my.addListenerWithFetch("viewCommentReports",      "POST", retrieveResponses)
        my.addListenerWithFetch("newReport",               "POST", retrieveResponses)
        my.addListenerWithFetch("viewLogs",                "POST", retrieveResponses)
        my.addListenerWithFetch("moderate",                "POST", retrieveResponses)
        my.addListenerWithFetch("viewModRecords",          "POST", retrieveResponses)
        my.addListenerWithFetch("ban",                     "POST", retrieveResponses)
        my.addListenerWithFetch("requestVerificationCode", "POST", retrieveResponses)
        my.addListenerWithFetch("inputVerificationCode",   "POST", retrieveResponses)
        
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
            my.state.stateChangeRequest(ev.detail)
        })
        
        document.addEventListener("StateChanged", ()=> {
            
            console.log("Cafe.ts: state change event received", my.state)
            my.navbar.setFromState(my.state)
            my.serialize()
        })

        document.addEventListener("ClearURL", (ev)=> {
            console.log("Cafe.ts: clear url event received")
            my.state.settings.url = ev.detail.settings.url
            my.state.settings.onPseudoUrlPage = ev.detail.settings.onPseudoUrlPage
            my.navbar.setFromState(my.state)
        })
        
        document.addEventListener("logout", ()=>{
            this.state.ownProfile = undefined
            my.clearToken()
            let ev = new CustomEvent<State>("StateChanged", {
                detail: my.state
            })
            document.dispatchEvent(ev)
        })

        
    }

    checkActiveUrl: ()=>void

    /** Sets the content script listeners (if running as an extension, and browser is available) */
    setBrowserEventListeners() {
        let my = this;

        if(typeof browser != "undefined") {
            let myport : M.Popup.Port = browser.runtime.connect({name: "popup-port"}) as any
            
            myport.onMessage.addListener( (m)=> {
                if(m.type == "message") {
                    console.log("Cafe.ts: port msg:", m.data)
                } else if(m.type == "href") {     
                    if(my.state.settings.onPseudoUrlPage != true) {
                        let partialState : Partial<State> = {
                            settings: {
                                url: m.data
                            } as Settings
                        }
                        let e = new CustomEvent<Partial<State>>("StateChangeRequest", {
                            detail: partialState
                        })
                        document.dispatchEvent(e)
                        my.fetcher.fetch("amILoggedIn", "POST", {Url: my.state.settings.url}, this.checkForResponses.bind(this))
                    }
                    console.log("Cafe.ts: port href msg: ", m.data)
                }
            })

            this.checkActiveUrl = () => {
                myport.postMessage({
                    type: "send-href"
                })
            }
        }
    }


    
    // checkForResponses is called as a callback after every fetch. The server responses array is retrieved from the fetcher and passed to the dispatcher, along with a reference to cafe so the dispatcher can call the correct methods to realize the information retrieved from the server
    checkForResponses() {
        let responses = this.fetcher.getAndClearResponses()
        console.log("Cafe.ts: 🎅🤶🤶 All server responses:", responses)
        this.dispatcher.dispatch(responses, this)
        this.serialize()
    }
}