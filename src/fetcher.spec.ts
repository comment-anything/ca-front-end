import { describe, it, expect } from 'vitest'

describe('environment config', ()=> {
    it('should be able to fetch the server base address.', ()=> {
        const server_url = import.meta.env.VITE_API_ADDRESS
        expect(server_url).toBeDefined()
        expect(server_url.length).toBeGreaterThan(0)
    })
})