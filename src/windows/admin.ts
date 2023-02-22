import { FeedbackReportSection } from "../section/feedbackReport";
import { UsersReportSection } from "../section/usersReport";
import { Dom } from "../util/dom";
import { CafeWindow } from "./base";

const CSS = {}

export class CafeAdminWindow extends CafeWindow {
    usersReport : UsersReportSection
    feedbackReport : FeedbackReportSection
    constructor() {
        super()
        this.usersReport = new UsersReportSection()
        this.feedbackReport = new FeedbackReportSection()
        this.el.append(this.usersReport.el)
        this.el.append(this.feedbackReport.el)
    }
}