import { OwnEmailSection } from "../section/ownEmail";
import { OwnProfileBlurbSection } from "../section/ownProfileBlurb";
import { Server } from "../communication/SERVER";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

import "./ownProfile.css"
import { State } from "../State";
import { CafeDom } from "../util/cafeDom";

const CSS = {
    sectionLabel : ["section-label", "section-label-as-button"],
    profileRow : "profile-info-row",
    profileChangeRow : "profile-blurb-row"
}
/**
CafeOwnProfileDisplay is used to display a User's own profile to them
*/
export class CafeOwnProfileDisplay extends UIInput<Server.UserProfile> {
    
    /** Drop down elements */
    dropDownContainer   : HTMLDivElement

    username            : HTMLDivElement
    isVerified          : HTMLDivElement
    createdOn           : HTMLDivElement
    domainsModerating   : HTMLDivElement
    isAdmin             : HTMLDivElement
    isDomainModerator   : HTMLDivElement
    isGlobalModerator   : HTMLDivElement
    emailSection        : OwnEmailSection
    profileBlurbSection : OwnProfileBlurbSection
    bannedFrom: HTMLDivElement;
    
    constructor(profile?:Server.UserProfile) {
        super(profile)

        this.dropDownContainer = Dom.div()
        let sectionLabel = Dom.div("About You", CSS.sectionLabel)
        sectionLabel.title = "Click this to show or hide your own user profile."
        
        let container_username = Dom.div(undefined, CSS.profileRow)
        let label_username = Dom.textEl("label","Username");
        this.username = Dom.div();
        container_username.append(label_username,this.username)

        let container_email = Dom.div(undefined, CSS.profileChangeRow)
        let label_email = Dom.textEl("label", "Email")
        this.emailSection = new OwnEmailSection()
        container_email.append(label_email, this.emailSection.el)

        let container_profile = Dom.div(undefined, CSS.profileChangeRow)
        let label_profile = Dom.textEl("label", "About")
        this.profileBlurbSection = new OwnProfileBlurbSection()
        container_profile.append(label_profile, this.profileBlurbSection.el)
        
        let container_createdOn = Dom.div(undefined, CSS.profileRow)
        let label_createdOn = Dom.textEl("label","Created On");
        this.createdOn = Dom.div();
        container_createdOn.append(label_createdOn,this.createdOn)
        
        let container_isVerified = Dom.div(undefined, CSS.profileRow)
        let label_isVerified = Dom.textEl("label", "Verified?");
        this.isVerified = Dom.div();
        container_isVerified.append(label_isVerified, this.isVerified)
        
        let container_bannedFrom = Dom.div(undefined, CSS.profileRow)
        let label_bannedFrom = Dom.textEl("label", "Banned From")
        this.bannedFrom = Dom.div()
        container_bannedFrom.append(label_bannedFrom, this.bannedFrom)
        
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
        
        
        let passwordResetButton = CafeDom.formSubmitButtonSmallCenteredBlock("Request Password Reset", {marginTop: "10px"})
        
        this.dropDownContainer.append(
            container_username,
            container_email,
            container_profile,
            container_createdOn,
            container_isVerified,
            container_bannedFrom,
            container_domainsModerating,
            container_isAdmin,
            container_isDomainModerator,
            container_isGlobalModerator,
            passwordResetButton
        )
        this.el.append(sectionLabel, this.dropDownContainer)

        //this.clickListen(sectionLabel, this.toggleFold, true)
        this.eventman.watchEventListener('click', sectionLabel, this.toggleFold)

        this.updateProfile({LoggedInAs:profile, Email:""})

        //this.clickListen(passwordResetButton, this.passwordResetClicked, true)
        this.eventman.watchEventListener('click', passwordResetButton, this.passwordResetClicked)

    }
    
    updateProfile(newProfile : {LoggedInAs?:Server.UserProfile, Email?:string}) {
        if(newProfile.LoggedInAs != undefined) {
            this.data = newProfile.LoggedInAs;
            this.username.textContent = this.data.Username
            this.createdOn.textContent = (new Date(this.data.CreatedOn)).toLocaleDateString()
            this.isVerified.textContent = "Unavailable"
            this.domainsModerating.textContent = this.data.DomainsModerating ? this.data.DomainsModerating.join(",") : ""
            this.bannedFrom.textContent = this.data.DomainsBannedFrom ? this.data.DomainsBannedFrom.join(", ") : ""
            this.isAdmin.textContent = this.data.IsAdmin ? "yes" : "no"
            this.isDomainModerator.textContent = this.data.DomainsModerating ? "yes" : "no"
            this.isGlobalModerator.textContent = this.data.IsGlobalModerator ? "yes" : "no"
            this.emailSection.update(newProfile.Email ? newProfile.Email : "")
            this.profileBlurbSection.update(this.data.ProfileBlurb)
        } else {
            this.username.textContent = ""
            this.createdOn.textContent = ""
            this.domainsModerating.textContent = ""
            this.isVerified.textContent = ""
            this.isAdmin.textContent = ""
            this.isDomainModerator.textContent = ""
            this.isGlobalModerator.textContent = ""
            this.emailSection.update("")
            this.profileBlurbSection.update("")
        }
    }

    toggleFold() {
        if(this.dropDownContainer.style.display == "none") {
            this.dropDownContainer.style.display = "block"
        } else {
            this.dropDownContainer.style.display = "none"
        }
    }

    
    /** When the user clicks the password reset button, a password reset request chain will start */
    passwordResetClicked() {
        let state_event = new CustomEvent<Partial<State>>("StateChangeRequest", {detail:{
            viewing:"forgotpassword"}})
        document.dispatchEvent(state_event);
    }
}