// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { Server } from '../communication/SERVER'
import { Cafe } from '../Cafe'



describe('display comments', ()=>{
    it('should display comments correctly', ()=>{
        
        const cafe = new Cafe()
        
        let votedim: Server.CommentVoteDimension = {
            AlreadyVoted: 100,
            Downs: 100,
            Ups: 0
        }
        
        let testComment: Server.Comment = {
            UserId: 600,
            Username: "BadUser",
            CommentId: 9999999999,
            Content: "This is a very inappropriate comment.",
            Factual: votedim,
            Funny: votedim,
            Agree: votedim,
            Hidden: false,
            Parent: 0,
            Removed: false,
            TimePosted: 3
        }
        
        let page: Server.FullPage = {
            Comments: [testComment],
            Domain: "test.com",
            Path: "/"
        }
        
        cafe.navbar.commentsWindow.populateNewComments(page)
        document.body.append(cafe.navbar.el)
        
        // expect(inp.type).toBe("text")
    })
})
