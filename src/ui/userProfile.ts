import { UIInput } from "./base";
import { Server } from "../communication/SERVER";
import { Dom } from "../util/dom";

import "./userProfile.css"
import { CafeDom } from "../util/cafeDom";

const CSS = {
    element: 'ui-user-profile-element',
    close: 'ui-user-profile-close',
    details: {
        none: '',
        label: 'ui-user-profile-label',
        username: 'ui-user-profile-username',
        blurb: 'ui-user-profile-blurb'
    }
}

export class CafeUserDisplay extends UIInput<Server.UserProfile> {
    
    closeButton: HTMLButtonElement
    
    details: {
        username          : HTMLDivElement
        profileBlurb      : HTMLDivElement
        createdOn         : HTMLDivElement
        isAdmin           : HTMLDivElement
        isDomainModerator : HTMLDivElement
        isGlobalModerator : HTMLDivElement
        domainsModerating : HTMLDivElement
    }
    
    constructor(profile?: Server.UserProfile) {
        super(profile)
        this.el.classList.add(CSS.element)
        
        this.closeButton = CafeDom.genericIconButton(Dom.button('', CSS.close), {asset:'close'})
        
        this.details = {
            username          : Dom.div('', CSS.details.username),
            profileBlurb      : Dom.div('', CSS.details.blurb),
            createdOn         : Dom.div('', CSS.details.none),
            isAdmin           : Dom.div('', CSS.details.none),
            isDomainModerator : Dom.div('', CSS.details.none),
            isGlobalModerator : Dom.div('', CSS.details.none),
            domainsModerating : Dom.div('', CSS.details.none)
        }
        
        let container = {
            createdOn         : Dom.div(),
            isAdmin           : Dom.div(),
            isDomainModerator : Dom.div(),
            isGlobalModerator : Dom.div()
        }
        
        container.createdOn.append(Dom.div('Created on', CSS.details.label), this.details.createdOn)
        container.isAdmin.append(Dom.div('Admin?', CSS.details.label), this.details.isAdmin)
        container.isDomainModerator.append(Dom.div("Domain Moderator?", CSS.details.label), this.details.isDomainModerator)
        container.isGlobalModerator.append(Dom.div("Global Moderator?", CSS.details.label), this.details.isGlobalModerator)
        
        let prof: Partial<Server.UserProfile> = {
            Username: "Username",
            ProfileBlurb: "This is my super epic profile. I love commenting. I love comment anywhere.",
        }
        
        this.changeProfile(prof as Server.UserProfile)
        //this.show(10, 70)
        this.hide()
        
        this.el.append(
            this.details.username, this.closeButton,
            this.details.profileBlurb,
            this.details.createdOn,
            this.details.isAdmin,
            this.details.isDomainModerator,
            this.details.isGlobalModerator,
            this.details.domainsModerating,
        )
    }
    
    changeProfile(profile?: Server.UserProfile) {
        // this.details._____.textContent = 
        
        if (profile != undefined) {
            this.details.username.textContent = profile.Username
            this.details.profileBlurb.textContent = profile.ProfileBlurb
            
            
        }
    }
    
    hide() {
        this.el.style.display = 'none'
    }
    
    show(left: number, top: number) {
        this.el.style.position = 'absolute'
        this.el.style.left = left.toString()+'px'
        this.el.style.top = top.toString()+'px'
    }
}

