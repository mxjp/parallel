#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";

let npmScriptNames;
function getNpmScriptNames() {
	if (!npmScriptNames) {
		const packageJson = JSON.parse(readFileSync("package.json", "utf-8"));
		npmScriptNames = Object.keys(packageJson.scripts ?? {});
	}
	return npmScriptNames;
}

const argv = process.argv.slice(2);
for (const command of argv) {
	if (command.startsWith("npm:")) {
		if (command.includes("*")) {
			const pattern = new RegExp(`^${
				command.slice(4).replace(/\W/g, char => {
					if (char === "*") {
						return `.+?`;
					}
					return `\\${char}`;
				})
			}$`);
			for (const scriptName of getNpmScriptNames()) {
				if (pattern.test(scriptName)) {
					start(`npm run ${scriptName}`);
				}
			}
		} else {
			start(`npm run ${command.slice(4)}`);
		}
	} else {
		start(command);
	}
}

function start(command) {
	const proc = spawn(command, {
		cwd: process.cwd(),
		stdio: ["ignore", "pipe", "pipe"],
		shell: true,
	});
	proc.on("spawn", () => {
		for (const stream of [proc.stdout, proc.stderr]) {
			createInterface(stream).on("line", line => {
				console.log(line);
			});
		}
	});
	proc.on("error", error => {
		process.exitCode = 1;
		console.error(error);
	});
	proc.on("exit", (code, signal) => {
		if (code || signal) {
			process.exitCode = 1;
		}
	});
}
