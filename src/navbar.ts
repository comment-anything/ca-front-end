import { State, StateView } from "./State";
import { Dom } from "./util/dom";
import { CafeWindow } from "./windows/base";
import { CafeLoginWindow } from "./windows/login";
import { CafeRegisterWindow } from "./windows/register";
import { CafePwResetRequestWindow } from "./windows/pwResetRequest"
import { CafeNewPasswordWindow } from "./windows/setNewPass"

import { CafeMessageDisplay } from "./ui/message";
import { Client } from "./CLIENT";
import { CafeSettingsWindow } from "./windows/settings";
import { CafeCommentsWindow } from "./windows/comments";
import { CafeAdminWindow } from "./windows/admin";
import { CafeModerationWindow } from "./windows/moderator";

import "./navbar.css"
import HamSVG from "./hamburger_menu.svg"

const CSS = {
    cafe: "cafe-container",
    nav: "nav-bar",
    hamburger: "hamburger-container",
    navButtonsContainer: "hamburger-buttons-container",
    navitemButton: "hamburger-nav-selection",
    hamburgerImage: "hamburger-image",
    activeNavTab : "active-nav-tab",
    logoutButton : "nav-tab-logout"
}

/** CafeNavBar displays navigation buttons for the user to move between states, holds the active window, and holds a general message display object. It ultimately contains all DOM Elements used by Comment Anywhere.
 *@emits StateEvent on navbar click
*/
export class CafeNavBar {
    el      : HTMLDivElement
    message : CafeMessageDisplay
    
    registerButton : HTMLButtonElement;
    loginButton    : HTMLButtonElement;
    logoutButton   : HTMLButtonElement;
    settingsButton : HTMLButtonElement;
    commentsButton : HTMLButtonElement;
    adminButton    : HTMLButtonElement;
    moderatorButton: HTMLButtonElement;
    
    currentlyViewing? : CafeWindow
    commentsWindow    : CafeCommentsWindow
    registerWindow    : CafeRegisterWindow
    loginWindow       : CafeLoginWindow;
    settingsWindow    : CafeSettingsWindow;
    forgotPWWindow    : CafePwResetRequestWindow;
    newPassWindow     : CafeNewPasswordWindow;
    adminWindow       : CafeAdminWindow;
    moderatorWindow   : CafeModerationWindow;
    
    constructor() {
        // create the base containers
        this.el = Dom.el("div", CSS.cafe)

        this.message = new CafeMessageDisplay()
        
        let [navbutton, nav] = getHamburger()
        this.el.append(navbutton)

        // create the window container
        let windowContainer = Dom.div()


        // create the nav buttons
        this.registerButton = Dom.button("Register", [CSS.navitemButton, CSS.activeNavTab])
        this.loginButton = Dom.button("Login", [CSS.navitemButton])
        this.settingsButton = Dom.button("Settings", [CSS.navitemButton])
        this.logoutButton = Dom.button("Logout", [CSS.navitemButton, CSS.logoutButton])
        this.commentsButton = Dom.button("Comments", [CSS.navitemButton])
        this.adminButton = Dom.button("Admin", [CSS.navitemButton])
        this.moderatorButton = Dom.button("Moderator", [CSS.navitemButton])
        
        // register callbacks
        this.registerButton.addEventListener("click", getNavClickCallback("register"))
        this.loginButton.addEventListener("click", getNavClickCallback("login"))
        this.settingsButton.addEventListener("click", getNavClickCallback("settings"))
        this.commentsButton.addEventListener("click", getNavClickCallback("comments"))
        
        // logout button has different callback because it's more than a window change.
        this.logoutButton.addEventListener("click", this.logoutButtonClicked.bind(this))

        this.adminButton.addEventListener("click", getNavClickCallback("admin"))
        this.moderatorButton.addEventListener("click", getNavClickCallback("moderation"))
        

        // create the windows
        this.settingsWindow = new CafeSettingsWindow()
        this.forgotPWWindow = new CafePwResetRequestWindow()
        this.registerWindow = new CafeRegisterWindow()
        this.loginWindow = new CafeLoginWindow()
        this.newPassWindow = new CafeNewPasswordWindow();
        this.commentsWindow = new CafeCommentsWindow()
        this.adminWindow = new CafeAdminWindow();
        this.moderatorWindow = new CafeModerationWindow();

        this.loginWindow.hide()
        this.currentlyViewing = this.registerWindow

        // construct the dom tree
        this.el.append(this.message.el, windowContainer)
        nav.append(this.commentsButton, this.registerButton, this.loginButton, this.logoutButton, this.settingsButton, this.moderatorButton, this.adminButton)
        
        // Order of appendation shouldn't matter
        windowContainer.append(this.registerWindow.el, this.loginWindow.el, this.settingsWindow.el, this.forgotPWWindow.el, this.newPassWindow.el, this.commentsWindow.el, this.adminWindow.el, this.moderatorWindow.el)

    }
    
    // TEMPORARY: Admin button shows while logged out. Fix that and delete that comment when done with testing.
    setFromState(state:State) {
        this.hideAll()
        if(state.ownProfile != undefined) {
            this.settingsWindow.ownProfile.updateProfile(state.ownProfile)
        }

        // login, register, logout buttons depend on if user defined
        
        if(state.ownProfile == undefined) {
            this.showLoggedOutButtons()
        }
        else {
            this.showLoggedInButtons()
            this.logoutButton.innerHTML = "Logout " + state.ownProfile.LoggedInAs.Username;
            if(state.ownProfile.LoggedInAs.IsAdmin) {
                showInlineBlock(this.adminButton)
                showInlineBlock(this.moderatorButton)
            }
            else if(state.ownProfile.LoggedInAs.IsDomainModerator) {
                showInlineBlock(this.moderatorButton)
            }
            else if(state.ownProfile.LoggedInAs.IsGlobalModerator) {
                showInlineBlock(this.moderatorButton)
            }
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
                
            case "settings":
                this.currentlyViewing = this.settingsWindow
                setActive(this.settingsButton)
                break;
                
            case "forgotpassword":
                this.currentlyViewing = this.forgotPWWindow
                setActive(this.settingsButton)
                break;
            
            case "comments":
                this.currentlyViewing = this.commentsWindow
                setActive(this.commentsButton)
                break;

            case "newPassword":
                this.currentlyViewing = this.newPassWindow
                break;

            case "admin":
                this.currentlyViewing = this.adminWindow
                break;

            case "moderation":
                this.currentlyViewing = this.moderatorWindow
                break;
                
            default:
                this.currentlyViewing = undefined
                break;
        }
        
        if(this.currentlyViewing != undefined) {
            this.currentlyViewing.show()
        }

        this.commentsWindow.settingChangeReceived(state.settings)
        
    }
    
    showLoggedOutButtons() {
        showInlineBlock(this.registerButton)
        showInlineBlock(this.loginButton)
        showInlineBlock(this.commentsButton)
    }

    showLoggedInButtons() {
        showInlineBlock(this.logoutButton)
        showInlineBlock(this.settingsButton)
        showInlineBlock(this.commentsButton)
        showInlineBlock(this.moderatorButton)//temporary
    }


    hideAll() {
        this.newPassWindow.hide()
        this.forgotPWWindow.hide()
        this.settingsWindow.hide()
        this.registerWindow.hide()
        this.loginWindow.hide()
        this.settingsWindow.hide()
        this.commentsWindow.hide()
        this.adminWindow.hide()
        this.moderatorWindow.hide()
        hide(this.registerButton)
        hide(this.loginButton)
        hide(this.logoutButton)
        hide(this.settingsButton)
        hide(this.commentsButton)
        hide(this.adminButton)
        hide(this.moderatorButton)
    }

    logoutButtonClicked() {
        this.hideAll()
        this.showLoggedOutButtons()
        let logout: Client.Logout = {}
        let event = new CustomEvent<Client.Logout>("logout", {detail:logout})
        document.dispatchEvent(event)
    }
    
}

// private
function getNavClickCallback(stateTo:StateView) {
    return function() {
        let event = new CustomEvent<Partial<State>>("StateChangeRequest", {
            detail: {
                viewing: stateTo
            }
        })
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

function getHamburger() {
    let nav = Dom.el("nav", CSS.hamburger)
    let hbutton = Dom.el("img", CSS.hamburgerImage)
    hbutton.src = HamSVG
    hbutton.title = "Click this hamburger to toggle the navigation menu."
    nav.append(hbutton) 
    let container = Dom.div(undefined, CSS.navButtonsContainer, {
        display:"block"
    })

    function toggler() {
        if(container.style.display == "block") {
            container.style.display = "none"
        } else {
            container.style.display = "block"
        }
    }
    hbutton.addEventListener("click", toggler)
    nav.append(container)
    return [nav, container]
}

