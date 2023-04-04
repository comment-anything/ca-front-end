        import { Client } from "../communication/CLIENT";
        import { CafeFeedback } from "../ui/feedback";
        import { Dom } from "../util/dom";
        import { CafeSection } from "./base";
        import { Server } from "../communication/SERVER";
        import "./sendFeedback.css"
        
        const CSS = {
            sectionLabel : ["section-label", "section-label-as-button"],
            inputLabel : "section-input-label-medium",
            tnr : "times-new-roman",
            centeretnr : "centered-times-new-roman"
        }
        export class BanRecordsSection extends CafeSection {
                dropDownContainer: HTMLDivElement;
                //banRecords: Map<number, CafeBanRecord>;
                requestGlobalBansButton : HTMLButtonElement;
                forDomain : HTMLInputElement;
                requestDomainBansButton : HTMLButtonElement;
        
            constructor(){
                super()
                let sectionLabel = Dom.div("Moderator Bans", CSS.sectionLabel)
                this.dropDownContainer = Dom.div()
        
                let requestContainer = Dom.div()
                    
                this.forDomain = Dom.createInputElement("text", CSS.centeretnr)
                this.requestGlobalBansButton = Dom.button("Global Bans")
                this.requestDomainBansButton = Dom.button("Domain Bans")
        
                requestContainer.append(
                    Dom.createContainerWithLabel("URL:", CSS.inputLabel, "div", this.forDomain),
                    Dom.createContainer("div", CSS.tnr, this.forDomain),
                    this.requestGlobalBansButton,
                    this.requestDomainBansButton
                    )
                    this.dropDownContainer.append(requestContainer)
                    this.el.append(sectionLabel, this.dropDownContainer)
                    this.clickListen(sectionLabel, this.toggleFold, true)
            }
            hide(element:HTMLElement) {
                element.style.display = "none"
            }
            show(element:HTMLElement) {
                element.style.display = "block"
            }
            hideAll() {
            this.hide(this.forDomain)  
            }
            showAll() {
                this.show(this.forDomain)  
                }
            toggleFold() {
                if(this.dropDownContainer.style.display == "none") {
                    this.dropDownContainer.style.display = "block"
                } else {
                    this.dropDownContainer.style.display = "none"
                }
            }
        }