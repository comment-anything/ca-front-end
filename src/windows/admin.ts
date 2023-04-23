import { AccessLogSection } from "../section/accessLogs";
import { AssignAdminSection } from "../section/assignAdmin";
import { AssignGlobalModSection } from "../section/assignGlobal";
import { FeedbackReportSection } from "../section/feedbackReport";
import { UsersReportSection } from "../section/usersReport";
import { CafeWindow } from "./base";

export class CafeAdminWindow extends CafeWindow {
    usersReport     : UsersReportSection
    feedbackReport  : FeedbackReportSection
    assignGlobalMod : AssignGlobalModSection
    assignAdmin     : AssignAdminSection
    accessLogs      : AccessLogSection
    
    constructor() {
        super()
        
        this.usersReport = new UsersReportSection()
        this.feedbackReport = new FeedbackReportSection()
        this.assignGlobalMod = new AssignGlobalModSection()
        this.assignAdmin = new AssignAdminSection()
        this.accessLogs = new AccessLogSection()
        
        this.el.append(this.usersReport.el)
        this.el.append(this.feedbackReport.el)
        this.el.append(this.assignGlobalMod.el)
        this.el.append(this.assignAdmin.el)
        this.el.append(this.accessLogs.el)
    }
}