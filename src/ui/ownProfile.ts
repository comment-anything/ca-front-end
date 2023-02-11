import { Server } from "../SERVERK";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

const CSS = {
    profileRow : "profile-info-row"
}
/**
CafeOwnProfileDisplay is used to display a User's own profile to them
*/
export class CafeOwnProfileDisplay extends UIInput<Server.UserProfile> {
    username                : HTMLDivElement
    createdOn               : HTMLDivElement
    domainsModerating       : HTMLDivElement
    isAdmin                 : HTMLDivElement
    isDomainModerator       : HTMLDivElement
    isGlobalModerator       : HTMLDivElement
    profileBlurb            : HTMLDivElement
    editProfileBlurbButton  : HTMLButtonElement
    editProfileTextarea     : HTMLTextAreaElement
    editProfileSubmitButton : HTMLButtonElement
    
    constructor(profile?:Server.UserProfile) {
        super(profile)
        
        let container_username = Dom.div(undefined, CSS.profileRow)
        let label_username = Dom.textEl("label","Username");
        this.username = Dom.div();
        container_username.append(label_username,this.username)
        
        
        let container_createdOn = Dom.div(undefined, CSS.profileRow)
        let label_createdOn = Dom.textEl("label","Created On");
        this.createdOn = Dom.div();
        container_createdOn.append(label_createdOn,this.createdOn)
        
        
        let container_domainsModerating = Dom.div(undefined, CSS.profileRow)
        let label_domainsModerating = Dom.textEl("label","Domains Moderating");
        this.domainsModerating = Dom.div();
        container_domainsModerating.append(label_domainsModerating,this.domainsModerating)
        
        
        let container_isAdmin = Dom.div(undefined, CSS.profileRow)
        let label_isAdmin = Dom.textEl("label","isAdmin");
        this.isAdmin = Dom.div();
        container_isAdmin.append(label_isAdmin,this.isAdmin)
        
        
        let container_isDomainModerator = Dom.div(undefined, CSS.profileRow)
        let label_isDomainModerator = Dom.textEl("label","domain mod?");
        this.isDomainModerator = Dom.div();
        container_isDomainModerator.append(label_isDomainModerator,this.isDomainModerator)
        
        
        let container_isGlobalModerator = Dom.div(undefined, CSS.profileRow)
        let label_isGlobalModerator = Dom.textEl("label","global mod?");
        this.isGlobalModerator = Dom.div();
        container_isGlobalModerator.append(label_isGlobalModerator,this.isGlobalModerator)
        
        
        let container_profileBlurb = Dom.div(undefined, CSS.profileRow)
        let label_profileBlurb = Dom.textEl("label","about me");
        this.editProfileBlurbButton = Dom.button("✏");
        this.profileBlurb = Dom.div();
        this.editProfileTextarea = Dom.el("textarea", undefined, {display:"none"});
        this.editProfileSubmitButton = Dom.button("Submit", undefined, {display:"none"})
        container_profileBlurb.append(label_profileBlurb,this.profileBlurb, this.editProfileTextarea, this.editProfileSubmitButton, this.editProfileBlurbButton)

        this.clickListen(this.editProfileBlurbButton, this.toggleProfileTextArea, true)
        
        
        this.el.append( container_username,
            container_createdOn,
            container_domainsModerating,
            container_isAdmin,
            container_isDomainModerator,
            container_isGlobalModerator,
            container_profileBlurb )

        this.updateProfile(profile)
    }

    toggleProfileTextArea() {
        if(this.profileBlurb.style.display == "none") {
            this.profileBlurb.style.display = "inline-block"
            this.profileBlurb.textContent = this.profileBlurb.textContent 
        } else {
            this.profileBlurb.style.display = "none"
            this.editProfileTextarea.style.display = "inline"
            this.editProfileSubmitButton.style.display = "inline"
        }
    }
    
    updateProfile(newProfile? : Server.UserProfile) {
        if(newProfile != undefined) {
            this.data = newProfile;
            this.username.textContent = this.data.Username
            this.createdOn.textContent = (new Date(this.data.CreatedOn)).toISOString()
            this.domainsModerating.textContent = this.data.DomainsModerating
            this.isAdmin.textContent = this.data.IsAdmin ? "yes" : "no"
            this.isDomainModerator.textContent = this.data.DomainsModerating ? this.data.DomainsModerating : ""
            this.isGlobalModerator.textContent = this.data.IsGlobalModerator ? "yes" : "no"
            this.profileBlurb.textContent = this.data.ProfileBlurb
        } else {
            this.username.textContent = ""
            this.createdOn.textContent = ""
            this.domainsModerating.textContent = ""
            this.isAdmin.textContent = ""
            this.isDomainModerator.textContent = ""
            this.isGlobalModerator.textContent = ""
            this.profileBlurb.textContent = ""
        }
    }
}