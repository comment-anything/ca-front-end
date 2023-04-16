import { defineConfig } from "vite"

export default defineConfig( ({command,mode,ssrBuild})=> {
    console.log("👍\trunning custom VITE build config for Comment Anywhere!👍\n\n")
    if(command === 'build') {
        return {
            publicDir: "assets",
            build: {
                rollupOptions: {
                    input: {
                        index: "./src/main.ts",
                        content: "./src/contentscript/content.ts",
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
    }
    return {

    }
})