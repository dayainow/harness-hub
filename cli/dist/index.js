#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const install_1 = require("./commands/install");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name('harnesshub')
    .description('The npm for AI Agent Harnesses')
    .version('1.0.0');
program
    .command('install')
    .description('Install an AI agent harness from HarnessHub')
    .argument('<slug>', 'The harness slug to install (e.g., princeton-nlp/SWE-agent)')
    .action(async (slug) => {
    try {
        await (0, install_1.installCommand)(slug);
    }
    catch (error) {
        console.error(chalk_1.default.red(`\n✖ Error: ${error.message}`));
        process.exit(1);
    }
});
program.parse(process.argv);
