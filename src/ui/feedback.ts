import { Server } from "../SERVER";
import { Dom } from "../util/dom";
import { UIInput } from "./base";

export class CafeFeedback extends UIInput<Server.FeedbackRecord> {
    id: HTMLTableCellElement;
    submittedAt: HTMLTableCellElement;
    feedbackType: HTMLTableCellElement;
    userId: HTMLTableCellElement;
    username: HTMLTableCellElement;
    content: HTMLTableCellElement;

    constructor(data: Server.FeedbackRecord) {
        super(data, "tr")
        this.id = Dom.textEl("td", data.ID.toString())
        let date = new Date(data.SubmittedAt)
        this.submittedAt = Dom.textEl("td", date.toDateString() + " " + date.toTimeString())
        this.feedbackType = Dom.textEl("td", data.FeedbackType)
        this.userId = Dom.textEl("td", data.UserID.toString())
        this.username = Dom.textEl("td", data.Username)
        this.content = Dom.textEl("td", data.Content)

        this.el.append(this.id, this.submittedAt, this.feedbackType, this.userId, this.username, this.content)
    }
}