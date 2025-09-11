import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';

export default defineConfig({
	plugins: [
		sveltekit(),
		svelteInspector({
			holdMode: true,
			showToggleButton: 'always',
			toggleButtonPos: 'bottom-right'
		})
	],
	server: {
		hmr: {
			overlay: true
		},
		fs: {
			allow: ['..']
		}
	},
	optimizeDeps: {
		exclude: ['@sveltejs/kit', 'svelte']
	}
});
