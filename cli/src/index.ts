#!/usr/bin/env node

import { Command } from 'commander';
import { installCommand } from './commands/install';
import chalk from 'chalk';

const program = new Command();

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
      await installCommand(slug);
    } catch (error: any) {
      console.error(chalk.red(`\n✖ Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
