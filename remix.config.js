import { defineConfig } from "@remix-run/dev";

export default defineConfig({
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  future: {
    unstable_minify: false,
  },
});
