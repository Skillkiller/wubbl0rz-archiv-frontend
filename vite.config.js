import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [sveltekit()],
    build: {
        chunkSizeWarningLimit: 1500
    },
    ssr: {
        noExternal: ['chart.js/**']
    }
};

export default config;
