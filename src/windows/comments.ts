import { CafeWindow } from "./base";

/**
 * CafeCommentsWindow displays all comments for the current page. It is responsible for repopulating with new comments when comments for a new page are retrieved and updating comments as new ones are added and voted on.
 */
export class CafeCommentsWindow extends CafeWindow {

    // Just a temporary override for debug purposes! Remove this when CafeCommentsWindow actually gets developed!
    show(): void {
        super.show()
        this.el.textContent = `Will request comments for ${document.URL}`;
    }
}