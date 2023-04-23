import { ModeratorsReportSection } from "../section/modReports";
import { ModActionsReportSection  } from "../section/modActions";
import { BanRecordsSection  } from "../section/banRecords";
import { CommentReportsSection  } from "../section/commentReports";
import { CafeWindow } from "./base";
import { BanUserSection } from "../section/banUser";

export class CafeModerationWindow extends CafeWindow {
    reports    : CommentReportsSection
    ban        : BanUserSection
    modActions : ModActionsReportSection
    //banRecords : BanRecordsSection
    //moderators : ModeratorsReportSection
    
    constructor() {
        super()
        
        this.reports = new CommentReportsSection()
        this.ban = new BanUserSection()
        this.modActions = new ModActionsReportSection()
        //this.moderators = new ModeratorsReportSection()
        //this.banRecords = new BanRecordsSection()
        
        this.el.append(
            this.reports.el,
            this.ban.el,
            this.modActions.el
        )
    }
}