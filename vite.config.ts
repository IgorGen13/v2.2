import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

installGlobals();

export default defineConfig({
	plugins: [
		remix({
			ssr: false,
		}),
		tsconfigPaths(),
	],
	build: {
		sourcemap: process.env.NODE_ENV === 'production', // Включает sourcemap в продакшене
		target: 'es2015',
		minify: 'terser',  // Поменяли минификатор на более совместимый
	},
	esbuild: {
		jsxFactory: 'React.createElement',
		jsxFragment: 'React.Fragment',
	},
});
