import { Server } from "../SERVER"
import { UIInput } from "./base"
import { Dom } from "../util/dom"

// TODO: THIS IS VERY INCOMPLETE!!!!!

/** Renders data from a GlobalModeratorRecord */
export class CafeGlobalModDisplay extends UIInput<Server.GlobalModeratorRecord> {
    grantedAt: HTMLTableCellElement
    grantedByUsername: HTMLTableCellElement
    grantedToUsername: HTMLTableCellElement
    
    constructor(data: Server.GlobalModeratorRecord) {
        super(data, "tr")
        
        let date = new Date(data.GrantedAt)
        let date_formatted = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        
        this.grantedAt = Dom.textEl("td", date_formatted)
        this.grantedByUsername = Dom.textEl("td", data.GrantedByUsername)
        this.grantedToUsername = Dom.textEl("td", data.GrantedToUsername)
        
        this.el.append(
            this.grantedAt,
            this.grantedByUsername,
            this.grantedToUsername
        )
    }
}

