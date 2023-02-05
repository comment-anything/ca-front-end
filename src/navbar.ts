import { Dom } from "./util/dom";
import { CafeWindow } from "./windows/base";
import { CafeRegisterWindow } from "./windows/register";

/** CafeNavBar displays navigation buttons for the user to move between states, holds the active window, and holds a general message display object. It ultimately contains all DOM Elements used by Comment Anywhere.
 *@emits StateEvent on navbar click
*/
export class CafeNavBar {
    el: HTMLDivElement
    registerWindow: CafeRegisterWindow
    currentlyViewing: CafeWindow
    registerButton: HTMLButtonElement;
    constructor() {
        // create the base containers
        this.el = Dom.div()
        let nav = Dom.el("nav", "nav-bar")
        let windowContainer = Dom.div()

        // create the nav buttons
        this.registerButton = Dom.button("Register", "nav-tab")       

        // create the windows
        this.registerWindow = new CafeRegisterWindow()
        this.currentlyViewing = this.registerWindow

        // construct the dom tree
        this.el.append(nav, windowContainer)
        nav.append(this.registerButton)
        windowContainer.append(this.registerWindow.el)

    }


    
}