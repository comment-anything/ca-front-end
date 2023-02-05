import { State, StateView } from "./State";
import { Dom } from "./util/dom";
import { CafeWindow } from "./windows/base";
import { CafeLoginWindow } from "./windows/login";
import { CafeRegisterWindow } from "./windows/register";

import "./navbar.css"
import { CafeMessageDisplay } from "./ui/message";

const CSS = {
    cafe: "cafe-container",
    nav: "nav-bar",
    navTabButton: "nav-tab",
    activeNavTab : "active-nav-tab"
}

/** CafeNavBar displays navigation buttons for the user to move between states, holds the active window, and holds a general message display object. It ultimately contains all DOM Elements used by Comment Anywhere.
 *@emits StateEvent on navbar click
*/
export class CafeNavBar {
    el: HTMLDivElement
    message: CafeMessageDisplay
    registerWindow: CafeRegisterWindow
    currentlyViewing?: CafeWindow
    registerButton: HTMLButtonElement;
    loginButton: HTMLButtonElement;
    logoutButton: HTMLButtonElement;
    loginWindow: CafeLoginWindow;

    constructor() {
        // create the base containers
        this.el = Dom.el("div", CSS.cafe)
        let nav = Dom.el("nav", CSS.nav)

        this.message = new CafeMessageDisplay()

        let windowContainer = Dom.div()

        // create the nav buttons
        this.registerButton = Dom.button("Register", [CSS.navTabButton, CSS.activeNavTab])
        this.loginButton = Dom.button("Login", [CSS.navTabButton])
        this.logoutButton = Dom.button("Logout", [CSS.navTabButton, "nav-logout"])

        
        // register callbacks
        this.registerButton.addEventListener("click", getNavClickCallback("register"))
        this.loginButton.addEventListener("click", getNavClickCallback("login"))
        this.logoutButton.addEventListener("click", getNavClickCallback("none"))

        // create the windows
        this.registerWindow = new CafeRegisterWindow()
        this.loginWindow = new CafeLoginWindow()
        this.loginWindow.hide()
        this.currentlyViewing = this.registerWindow

        // construct the dom tree
        this.el.append(this.message.el, nav, windowContainer)
        nav.append(this.registerButton, this.loginButton, this.logoutButton)
        windowContainer.append(this.registerWindow.el, this.loginWindow.el)

    }

    setFromState(state:State) {
        this.hideAll()

        // login, register, logout buttons depend on if user defined
        if(state.ownProfile == undefined) {
            showInlineBlock(this.loginButton)
            showInlineBlock(this.registerButton)
        }
        else {
            showInlineBlock(this.logoutButton)
        }
        
        switch(state.viewing) {
            case "register":
                this.currentlyViewing = this.registerWindow
                setActive(this.registerButton)
                break;
            case "login":
                this.currentlyViewing = this.loginWindow
                setActive(this.loginButton)
                break; 
            default:
                this.currentlyViewing = undefined
        }
        if(this.currentlyViewing != undefined) {
            this.currentlyViewing.show()
        }


    }
    hideAll() {
        this.registerWindow.hide()
        this.loginWindow.hide()
        hide(this.registerButton)
        hide(this.loginButton)
        hide(this.logoutButton)
    }
    
}


// private
function getNavClickCallback(stateTo:StateView) {
    return function() {
        let event = new CustomEvent<StateView>("StateChangeRequest", {detail:stateTo})
        document.dispatchEvent(event)
    }
}

// private util function. Sets display to "none" and removes the "active" class from the classlist.
function hide(element:HTMLElement) {
    element.style.display = "none"
    setInactive(element)
}

// Sets display to "inline-block"
function showInlineBlock(element:HTMLElement) {
    element.style.display = "inline-block"
}

// Adds class CSS.activeNavTab
function setActive(element:HTMLElement) {
    element.classList.add(CSS.activeNavTab)

}

// Removes class CSS.activeNavTab
function setInactive(element:HTMLElement) {
    element.classList.remove(CSS.activeNavTab)
}