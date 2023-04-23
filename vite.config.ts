import { defineConfig } from "vite"

export default defineConfig( ({command,mode,ssrBuild})=> {
    //if(command === 'build') {
        console.log("👍\trunning custom VITE build config for Comment Anywhere!👍\n\n")
        return {
            publicDir: "assets",
            build: {
                rollupOptions: {
                    input: {
                        index: "./src/main.ts",
                        background: "./src/backgroundscript/background.ts"
                    },
                    output: {
                        format: "commonjs",
                        strict: false,
                        chunkFileNames: `[name].js`,
                        entryFileNames: `[name].bundle.js`,
                        assetFileNames: `assets/[name].[ext]`,
                        dir: "dist"
                    }
                    
                }
            },

        }
    //}
    //return {

    //}
})