
import { Dom } from '../util/dom'

// CafeWindow is the base class for all CafeWindows. CafeWindows ultimately hold all the viewable content of CommentAnywhere, except for the navbar buttons and message. They correspond to the front end states. Only one CafeWindow is visible at any given time and is displayed and hidden by the CafeNavBar instance.
export class CafeWindow {
    el: HTMLDivElement
    
    constructor(id: string, title: string) {
        this.el = document.createElement('div')
        this.el.classList.add('cafe-window', 'section')
        this.el.id = id
        this.el.innerHTML = '<div class="section-title">' + title + '</div>'
        Dom.appendToApp(this.el)
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



