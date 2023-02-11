import { Server } from "../SERVER";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

export class CafeOwnProfileDisplay extends UIInput<Server.UserProfile> {
    username                : HTMLDivElement,
    createdOn               : HTMLDivElement,
    domainsModerating       : HTMLDivElement,
    isAdmin                 : HTMLDivElement,
    isDomainModerator       : HTMLDivElement,
    isGlobalModerator       : HTMLDivElement,
    profileBlurb            : HTMLDivElement,
    editProfileBlurbButton  : HTMLButtonElement,
    editProfileTextarea     : HTMLTextAreaElement,
    editProfileSubmitButton : HTMLButtonElement,
    changePasswordButton    : HTMLButtonElement
    
    constructor() {
        
    }
}