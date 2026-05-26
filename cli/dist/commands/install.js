"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCommand = installCommand;
const node_fetch_1 = __importDefault(require("node-fetch"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
// Change this to production URL when deploying
const API_BASE = process.env.HARNESSHUB_API_URL || 'http://localhost:3002/api';
async function installCommand(slug) {
    console.log(chalk_1.default.blue(`\n🔍 Looking up ${chalk_1.default.bold(slug)} on HarnessHub...`));
    // 1. Fetch metadata from API
    const res = await (0, node_fetch_1.default)(`${API_BASE}/harnesses/${slug}`);
    if (res.status === 404) {
        throw new Error(`Harness '${slug}' not found. Please check the spelling or search on harnesshub.dev.`);
    }
    if (!res.ok) {
        throw new Error(`Failed to communicate with HarnessHub (Status: ${res.status})`);
    }
    const harness = await res.json();
    console.log(chalk_1.default.green(`✓ Found: ${chalk_1.default.bold(harness.name)} (${harness.licenseTier} License)`));
    if (harness.licenseTier === 'YELLOW') {
        console.log(chalk_1.default.yellow(`⚠ Warning: This harness uses a Copyleft license (${harness.license}). Integration requires open-sourcing derivative works.`));
    }
    else if (harness.licenseTier === 'RED') {
        console.log(chalk_1.default.red(`⚠ Warning: This harness uses a highly restrictive or non-OSI license (${harness.license}). Usage may be restricted.`));
    }
    // 2. Determine Installation Command
    let cmdToRun = harness.installCmd;
    if (!cmdToRun) {
        console.log(chalk_1.default.gray(`No standard install command provided. Falling back to git clone...`));
        cmdToRun = `git clone ${harness.repoUrl}`;
    }
    console.log(chalk_1.default.blue(`\n🚀 Executing: ${chalk_1.default.bold(cmdToRun)}`));
    console.log(chalk_1.default.gray(`──────────────────────────────────────────────────`));
    // 3. Execute Command
    try {
        (0, child_process_1.execSync)(cmdToRun, { stdio: 'inherit' });
        console.log(chalk_1.default.gray(`──────────────────────────────────────────────────`));
        console.log(chalk_1.default.green(`\n✨ Successfully installed ${slug}!`));
    }
    catch (err) {
        console.log(chalk_1.default.gray(`──────────────────────────────────────────────────`));
        throw new Error(`Installation failed during execution of command: ${cmdToRun}`);
    }
}
