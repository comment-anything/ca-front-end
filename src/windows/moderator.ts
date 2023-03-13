import { ModeratorsReportSection } from "../section/modReports";
import { ModActionsReportSection  } from "../section/modActions";
import { BanRecordsSection  } from "../section/banRecords";
import { CommentReportsSection  } from "../section/commentReports";
import { CafeWindow } from "./base";

export class CafeModerationWindow extends CafeWindow {
    moderators : ModeratorsReportSection
    modActions : ModActionsReportSection
    banRecords : BanRecordsSection
    reports    : CommentReportsSection
    
    constructor() {
        super()
        this.moderators = new ModeratorsReportSection()
        this.modActions = new ModActionsReportSection()
        this.banRecords = new BanRecordsSection()
        this.reports = new CommentReportsSection()
        
        this.el.append(
            this.reports.el
        )
        
        //this.el.append(this.moderators.el)
        //this.el.append(this.modActions.el)
        //this.el.append(this.banRecords.el)
        //this.el.append(this.reports.el)
    }
}