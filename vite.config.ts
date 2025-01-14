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
	  sourcemap: true,      // 🔍 Включаем Source Maps для отладки
	  target: 'es2015',     // 📱 Поддержка старых браузеров
	  minify: 'esbuild',    // ⚡ Быстрая сборка (можно заменить на 'terser' для гибкости)
	},
	esbuild: {
	  jsxFactory: 'React.createElement',
	  jsxFragment: 'React.Fragment',
	},
  });
