// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Dom } from './dom'

describe('dom utility', ()=> {
    it('should be able to create an input element.', ()=> {
        let inp = Dom.createInputField("text")
        expect(inp).toBeTruthy()
        expect(inp.type).toBe("text")
    })
})