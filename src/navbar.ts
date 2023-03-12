import { State, StateView } from "./State";
import { Dom } from "./util/dom";
import { CafeWindow } from "./windows/base";
import { CafeLoginWindow } from "./windows/login";
import { CafeRegisterWindow } from "./windows/register";
import { CafePwResetRequestWindow } from "./windows/pwResetRequest"
import { CafeNewPasswordWindow } from "./windows/setNewPass"

import "./navbar.css"
import { CafeMessageDisplay } from "./ui/message";
import { Client } from "./CLIENT";
import { CafeSettingsWindow } from "./windows/settings";
import { CafeCommentsWindow } from "./windows/comments";
import { CafeAdminWindow } from "./windows/admin";
import { CafeModerationWindow } from "./windows/moderator";

const CSS = {
    cafe: "cafe-container",
    nav: "nav-bar",
    navTabButton: "nav-tab",
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
        let nav = Dom.el("nav", CSS.nav)

        this.message = new CafeMessageDisplay()

        let windowContainer = Dom.div()

        // create the nav buttons
        this.registerButton = Dom.button("Register", [CSS.navTabButton, CSS.activeNavTab])
        this.loginButton = Dom.button("Login", [CSS.navTabButton])
        this.settingsButton = Dom.button("Settings", [CSS.navTabButton])
        this.logoutButton = Dom.button("Logout", [CSS.navTabButton, CSS.logoutButton])
        this.commentsButton = Dom.button("Comments", [CSS.navTabButton])
        this.adminButton = Dom.button("Admin", [CSS.navTabButton])
        this.moderatorButton = Dom.button("Moderator", [CSS.navTabButton])

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
        this.el.append(this.message.el, nav, windowContainer)
        nav.append(this.commentsButton, this.registerButton, this.loginButton, this.logoutButton, this.settingsButton, this.adminButton, this.moderatorButton)
        
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
            }
            if(state.ownProfile.LoggedInAs.IsDomainModerator) {
                showInlineBlock(this.moderatorButton)
                showInlineBlock(this.moderatorWindow.moderators.domainFrom)
                showInlineBlock(this.moderatorWindow.moderators.domainTo)
                showInlineBlock(this.moderatorWindow.moderators.domainFeedbackType)
                showInlineBlock(this.moderatorWindow.moderators.requestDomainModeratorsButton)
                showInlineBlock(this.moderatorWindow.moderators.domainModRecords)
            }
            if(state.ownProfile.LoggedInAs.IsGlobalModerator) {
                showInlineBlock(this.moderatorButton)
                showInlineBlock(this.moderatorWindow.moderators.globalFrom)
                showInlineBlock(this.moderatorWindow.moderators.globalTo)
                showInlineBlock(this.moderatorWindow.moderators.globalFeedbackType)
                showInlineBlock(this.moderatorWindow.moderators.requestGlobalModeratorsButton)
                showInlineBlock(this.moderatorWindow.moderators.globalModRecords)
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