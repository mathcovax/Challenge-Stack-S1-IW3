import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "./src/main.js"),
			name: "main",
			fileName: "main",
			formats: ["cjs"],
		},
		minify: "esbuild",
		target: ["es2022"]
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	},
	server: {
		port: 80,
		host: "0.0.0.0"
	}
});
