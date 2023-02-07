#! /usr/bin/env node

import fs from "fs";
import { execSync, spawn } from "child_process";
const Watcher = (
	await import("/usr/local/lib/node_modules/watcher/dist/watcher.js")
).default;

if (!fs.existsSync("/app/node_modules")) {
	console.log("Install all package.");
	execSync("npm install", { cwd: "/app", stdio: "ignore" });
	execSync("chmod -R 777 /app", { stdio: "ignore" });
}

class child {
	static start() {
		this.process = spawn("npm", ["run", "dev"], {
			stdio: "inherit",
			cwd: "/app",
			detached: true,
		});
		this.process1 = spawn(
			"npx",
			["sass", "--watch", "/app/src/scss/main.scss:/app/public/css/main.css"],
			{ stdio: "inherit", cwd: "/app", detached: true }
		);
		this.watcher = new Watcher("/app/node_modules").on("unlinkDir", () =>
			child.restart()
		);
		this.watcher1 = new Watcher("/app/webpack.config.js").on("change", () =>
			child.restart()
		);
	}

	static stop() {
		this.watcher.close();
		this.watcher1.close();
		try {
			execSync("lsof -t -i :1506 | xargs kill -9", { stdio: "inherit" });
			process.kill(this.process.pid, "SIGINT");
		} catch {}
	}

	static restart() {
		this.stop();
		if (!fs.existsSync("/app/node_modules")) {
			console.log("Starting reinstall all package");
			execSync("npm install", { stdio: "ignore", cwd: "/app" });
			execSync("chmod -R 777 ./node_modules", { stdio: "ignore", cwd: "/app" });
		}
		this.start();
	}

	static process;
	static process1;
	static watcher;
	static watcher1;
}

child.start();
