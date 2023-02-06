import "./base.css"

const CSS = {
    cafeWindow : "cafe-window"
}

// CafeWindow is the base class for all CafeWindows. CafeWindows ultimately hold all the viewable content of CommentAnywhere, except for the navbar buttons and message. They correspond to the front end states. Only one CafeWindow is visible at any given time and is displayed and hidden by the CafeNavBar instance.
export class CafeWindow {
    el: HTMLDivElement
    
    constructor(elId?: string, cssClasses?: string | string[]) {
        this.el = document.createElement('div')
        if (Array.isArray(cssClasses)) {
            this.el.classList.add(...cssClasses)
        } else if (cssClasses != undefined) {
            this.el.classList.add(cssClasses)
        }
        if (elId != undefined) {
            this.el.id = elId
        }
        this.el.classList.add(CSS.cafeWindow)
    }
    
    // Shows a CafeWindow instance.
    show() {
        this.el.style.display = 'block'
    }
    
    // Hides a CafeWindow instance.
    hide() {
        this.el.style.display = 'none'
    }
}



