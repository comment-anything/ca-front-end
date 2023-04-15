import { Client } from "../communication/CLIENT"
import { CafeDom } from "../util/cafeDom"
import { Dom } from "../util/dom"
import { CafeSection } from "./base"



export class OwnProfileBlurbSection extends CafeSection {
    profileBlurb            : HTMLDivElement
    editProfileBlurbButton  : HTMLButtonElement
    editProfileTextarea     : HTMLTextAreaElement
    editProfileSubmitButton : HTMLButtonElement
    editProfileBlurbDiv: HTMLDivElement
    
    constructor(blurb?:string) {
        super()
        
        this.profileBlurb = Dom.div()
        this.editProfileBlurbButton = CafeDom.formSubmitButtonSmall("Edit")
        
        this.editProfileBlurbDiv = Dom.div(undefined, undefined, {display:"none"})
        this.editProfileTextarea = Dom.el("textarea")
        this.editProfileSubmitButton = CafeDom.formSubmitButtonSmall("Submit")
        this.editProfileBlurbDiv.append(this.editProfileTextarea, this.editProfileSubmitButton)
        
        this.clickListen(this.editProfileBlurbButton, this.toggleProfileTextArea, true)
        this.clickListen(this.editProfileSubmitButton, this.submitProfileEditClicked, true)
        
        this.el.append (
            this.profileBlurb, this.editProfileBlurbButton, this.editProfileBlurbDiv
        )
        this.update(blurb)
    }

    submitProfileEditClicked() {
        let cblurb : Client.ChangeProfileBlurb = {
            NewBlurb: this.editProfileTextarea.value
        }
        let event = new CustomEvent<Client.ChangeProfileBlurb>("changeProfile", {
            detail: cblurb
        })
        document.dispatchEvent(event)
        this.toggleProfileTextArea()

    }
    
    update(blurb?: string) {
        if(blurb != undefined) {
            this.profileBlurb.textContent = blurb
        } else {
            this.profileBlurb.textContent = ""
        }
    }
    
    toggleProfileTextArea() {
        // Show the text area for editing
        if(this.profileBlurb.style.display == "none") {
            this.editProfileBlurbDiv.style.display = "none"
            this.profileBlurb.style.display = "block"
        }
        // Hide the text area
        else {
            this.profileBlurb.style.display = "none"
            this.editProfileBlurbDiv.style.display = "block"
            this.editProfileTextarea.value = this.profileBlurb.textContent ? this.profileBlurb.textContent : ""
        }
    }
}

