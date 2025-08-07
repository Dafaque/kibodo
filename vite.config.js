import { defineConfig } from 'vite'

export default defineConfig({
    base: '/',
    build: {
        minify: true,
        manifest: false,
        rollupOptions: {
            output: [{
                dir: 'assets/web',
            }],
        },
    },
})