#! /usr/bin/env node

import fs from "fs";
import { execSync, spawn } from "child_process";
const Watcher = (await import("/usr/local/lib/node_modules/watcher/dist/watcher.js")).default;

if(!fs.existsSync("/app/node_modules")){
	console.log("Install all package.");
	execSync("npm install", {cwd: "/app", stdio: "ignore"});
	execSync("chmod -R 777 /app", {stdio: "ignore"});
}

class child{
	static start(){
		this.process = spawn("npm", ["run", "dev"], {stdio: "inherit", cwd: "/app", detached: true});
		this.watcher = new Watcher("/app/node_modules").on("unlinkDir", () => child.restart());
	}

	static stop(){
		this.watcher.close();
		try{
			process.kill(this.process.pid, "SIGINT");
		}catch{}
	}

	static restart(){
		this.stop();
		console.log("Starting reinstall all package");
		execSync("npm install", {stdio: "ignore", cwd: "/app"});
		execSync("chmod -R 777 ./node_modules", {stdio: "ignore", cwd: "/app"});
		this.start();
	}

	static process;
	static watcher;
}

child.start();
