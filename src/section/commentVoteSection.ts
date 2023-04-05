import {Server} from "../communication/SERVER"
import { CafeCommentVote } from "../ui/commentVote"
import {CafeSection} from "./base"

export class CommentVoteSection extends CafeSection{
    funny: CafeCommentVote
    factual: CafeCommentVote
    agree: CafeCommentVote

    constructor(data:Server.Comment) {
        super()
        this.funny = new CafeCommentVote("funny", data.CommentId, data.Funny)
        this.factual = new CafeCommentVote("factual", data.CommentId, data.Factual)
        this.agree = new CafeCommentVote("agree", data.CommentId, data.Agree)
        this.el.append(this.funny.el, this.factual.el, this.agree.el)
    }

    update(data:Server.Comment) {
        this.funny.update(data.Funny)
        this.factual.update(data.Factual)
        this.agree.update(data.Agree)
    }
}