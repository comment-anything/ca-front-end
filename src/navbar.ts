
import { State, StateView } from "./State"
import { Client } from "./communication/CLIENT"
import { Dom } from "./util/dom"
import { CafeMessageDisplay } from "./ui/message"

import { CafeAdminWindow }          from "./windows/admin"
import { CafeWindow }               from "./windows/base"
import { CafeCommentsWindow }       from "./windows/comments"
import { CafeLoginWindow }          from "./windows/login"
import { CafeModerationWindow }     from "./windows/moderator"
import { CafePwResetRequestWindow } from "./windows/pwResetRequest"
import { CafeRegisterWindow }       from "./windows/register"
import { CafeNewPasswordWindow }    from "./windows/setNewPass"
import { CafeSettingsWindow }       from "./windows/settings"
import { CafeUserDisplay }          from "./ui/userProfile"

import "./navbar.css"

const CSS = {
    cafe   : 'cafe-global',
    navbar : {
        container : 'cafe-navbar-container',
        hamburger : 'cafe-navbar-hamburger',
        pane      : 'cafe-navbar-pane',
        button    : 'cafe-navbar-pane-button',
        windowContainer : 'cafe-window-container'
    },
    active: "cafe-navbar-active-button"
}

const titleTexts : Record<string, string> = {
    hamburger : "Click this button to show navigation options.",
    register  : "Click this button to register an account with Comment Anywhere.",
    login     : "Click this button login in to Comment Anywhere.",
    logout    : "Click this button to logout of Comment Anywhere.",
    comments  : "Click this button to view a Comment section.",
    settings  : "Click this button to view your settings.",
    moderator : "Click this button to view moderation options.",
    admin     : "Click this button to view administrator options."
}

export class CafeNavBar {
    el          : HTMLDivElement
    message     : CafeMessageDisplay
    userDisplay : CafeUserDisplay
    
    navbar: {
        el        : HTMLDivElement,
        hamburger : HTMLButtonElement,
        pane      : HTMLDivElement,
        register  : HTMLButtonElement,
        login     : HTMLButtonElement,
        logout    : HTMLButtonElement,
        comments  : HTMLButtonElement,
        settings  : HTMLButtonElement,
        moderator : HTMLButtonElement,
        admin     : HTMLButtonElement
    }
    
    window: {
        register       : CafeRegisterWindow,
        login          : CafeLoginWindow,
        forgotPassword : CafePwResetRequestWindow,
        setNewPassword : CafeNewPasswordWindow,
        comments       : CafeCommentsWindow,
        settings       : CafeSettingsWindow,
        moderator      : CafeModerationWindow,
        admin          : CafeAdminWindow,
        container      : HTMLDivElement
        viewing?       : CafeWindow
    }
    
    constructor() {
        this.el = Dom.div('', CSS.cafe)
        this.message = new CafeMessageDisplay()
        this.userDisplay = new CafeUserDisplay()
        
        this.window = {
            register       : new CafeRegisterWindow(),
            login          : new CafeLoginWindow(),
            forgotPassword : new CafePwResetRequestWindow(),
            setNewPassword : new CafeNewPasswordWindow(),
            comments       : new CafeCommentsWindow(),
            settings       : new CafeSettingsWindow(),
            moderator      : new CafeModerationWindow(),
            admin          : new CafeAdminWindow(),
            container      : Dom.div(undefined, CSS.navbar.windowContainer)
        }
        
        this.window.viewing = this.window.register
        
        this.navbar = {
            el        : Dom.div('', CSS.navbar.container),
            hamburger : Dom.button('', CSS.navbar.hamburger),
            pane      : Dom.div('', CSS.navbar.pane),
            register  : Dom.button("Register", CSS.navbar.button),
            login     : Dom.button("Login", CSS.navbar.button),
            logout    : Dom.button("Logout", CSS.navbar.button),
            comments  : Dom.button("Comments", CSS.navbar.button),
            settings  : Dom.button("Settings", CSS.navbar.button),
            moderator : Dom.button("Moderate", CSS.navbar.button),
            admin     : Dom.button("Admin", CSS.navbar.button)
        }

        for(let key of Object.keys(titleTexts)) {
            let n = this.navbar as Record<string, HTMLElement>
            if( n[key] != undefined) {
                n[key].title = titleTexts[key]
            }
        }
        
        this.navbar.el.append(
            this.message.el,
            this.navbar.hamburger,
            this.navbar.pane,
            this.userDisplay.el
        )
        
        this.window.container.append(
            this.window.register.el,
            this.window.login.el,
            this.window.forgotPassword.el,
            this.window.setNewPassword.el,
            this.window.comments.el,
            this.window.settings.el,
            this.window.moderator.el,
            this.window.admin.el,
        )
        
        this.navbar.pane.append(
            this.navbar.register,
            this.navbar.login,
            this.navbar.comments,
            this.navbar.settings,
            this.navbar.moderator,
            this.navbar.admin,
            this.navbar.logout
        )
        
        this.el.append(this.navbar.el, this.window.container)
        
        this.navbar.hamburger.addEventListener('click', this.toggleNavPane.bind(this))
        
        this.navbar.register.addEventListener('click', getNavClickCallback("register"))
        this.navbar.login.addEventListener('click', getNavClickCallback("login"))
        this.navbar.settings.addEventListener('click', getNavClickCallback("settings"))
        this.navbar.comments.addEventListener('click', getNavClickCallback("comments"))
        this.navbar.moderator.addEventListener('click', getNavClickCallback("moderation"))
        this.navbar.admin.addEventListener('click', getNavClickCallback("admin"))
        
        this.navbar.logout.addEventListener('click', this.logoutButtonClicked.bind(this))
    }

    toggleNavPane(_ev?: MouseEvent, show_hide?:boolean) {
        if(show_hide == undefined) {
            if (this.navbar.pane.style.display == 'none') {
                show_hide = true;
            }
            else {
                show_hide = false
            }
        } 
        if(show_hide == true) {
            this.navbar.pane.style.display = 'block'
            this.navbar.hamburger.style.backgroundColor = '#8ca4e5'
        } else {
            this.navbar.pane.style.display = 'none'
            this.navbar.hamburger.style.backgroundColor = '#e6eae4'

        }
    }
    
    
    
    setFromState(state: State) {
        this.hideAll()
        
        if (state.ownProfile == undefined) {
            this.showLoggedOutButtons()
            if(state.viewing != "comments" && state.viewing != "register" && state.viewing != "forgotpassword" && state.viewing != "newPassword") {
                state.viewing = "login"
            }
        }
        else {
            this.window.settings.ownProfile.updateProfile(state.ownProfile)
        
            this.showLoggedInButtons()
            this.navbar.logout.textContent = "Logout " + state.ownProfile.LoggedInAs.Username;
            
            if(state.ownProfile.LoggedInAs.IsAdmin) {
                showInlineBlock(this.navbar.admin)
                showInlineBlock(this.navbar.moderator)
            }
            
            else if(state.ownProfile.LoggedInAs.IsDomainModerator)
                showInlineBlock(this.navbar.moderator)
                
            else if(state.ownProfile.LoggedInAs.IsGlobalModerator)
                showInlineBlock(this.navbar.moderator)
        }
        
        switch(state.viewing) {
            case "register":
                this.window.viewing = this.window.register
                setActive(this.navbar.register)
                break;
                
            case "login":
                this.window.viewing = this.window.login
                setActive(this.navbar.login)
                break;
                
            case "settings":
                this.window.viewing = this.window.settings
                setActive(this.navbar.settings)
                break;
                
            case "forgotpassword":
                this.window.viewing = this.window.forgotPassword
                setActive(this.navbar.settings)
                break;
            
            case "comments":
                this.window.viewing = this.window.comments
                setActive(this.navbar.comments)
                break;

            case "newPassword":
                this.window.viewing = this.window.setNewPassword
                break;

            case "admin":
                this.window.viewing = this.window.admin
                setActive(this.navbar.admin)
                break;

            case "moderation":
                this.window.viewing = this.window.moderator
                setActive(this.navbar.moderator)
                break;
                
            default:
                this.window.viewing = undefined
                break;
        }
        
        if (this.window.viewing != undefined)
            this.window.viewing.show()
            
        this.window.comments.settingChangeReceived(state.settings)
    }
    
    showLoggedInButtons() {
        showInlineBlock(this.navbar.logout)
        showInlineBlock(this.navbar.settings)
        showInlineBlock(this.navbar.comments)
    }
    
    showLoggedOutButtons() {
        showInlineBlock(this.navbar.register)
        showInlineBlock(this.navbar.login)
        showInlineBlock(this.navbar.comments)
    }
    
    hideAll() {
        this.toggleNavPane(undefined, false)
        this.window.register.hide()
        this.window.login.hide()
        this.window.forgotPassword.hide()
        this.window.setNewPassword.hide()
        this.window.comments.hide()
        this.window.settings.hide()
        this.window.moderator.hide()
        this.window.admin.hide()
        hide(this.navbar.register)
        hide(this.navbar.login)
        hide(this.navbar.logout)
        hide(this.navbar.settings)
        hide(this.navbar.comments)
        hide(this.navbar.moderator)
        hide(this.navbar.admin)
    }
    
    logoutButtonClicked() {
        this.hideAll()
        this.showLoggedOutButtons()
        let logout: Client.Logout = {}
        let event = new CustomEvent<Client.Logout>("logout", {detail: logout})
        document.dispatchEvent(event)
    }
}



function getNavClickCallback(stateTo: StateView) {
    return function() {
        let event = new CustomEvent<Partial<State>>("StateChangeRequest", {
            detail: {viewing: stateTo}
        })
        document.dispatchEvent(event)
    }
}



function hide(element: HTMLElement) {
    element.style.display = 'none'
    setInactive(element)
}

function setActive(el: HTMLElement) {
    el.classList.add(CSS.active)
}



function setInactive(el: HTMLElement) {
    el.classList.remove(CSS.active)
}



function showInlineBlock(el: HTMLElement) {
    el.style.display = 'inline-block'
}