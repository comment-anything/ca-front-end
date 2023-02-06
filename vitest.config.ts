import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        // example file that would be matched: src/cafe.spec.ts
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'] 
    }
})