import { Server } from "../communication/SERVER";
import { Dom } from "../util/dom";
import { UIInput } from "./base";


export class CafeCommentVote extends UIInput<Server.CommentVoteDimension>{
    funny                 : CafeCommentVote
    factual               : CafeCommentVote
    agree                 : CafeCommentVote
}