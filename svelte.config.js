import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	// kit: {
	// 	adapter: adapter(),

	// 	// hydrate the <div id="svelte"> element in src/app.html
	// 	target: '#svelte',
	// 	appDir: 'app',
	// 	paths: {
	// 		base: process.env.NODE_ENV === 'production' ? '/svelte-golden-layout' : '',
	// 	},
	// },
};

export default config;
