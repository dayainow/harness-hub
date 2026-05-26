import fetch from 'node-fetch';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as fs from 'fs';

// Change this to production URL when deploying
const API_BASE = process.env.HARNESSHUB_API_URL || 'http://localhost:3002/api';

export async function installCommand(slug: string) {
  console.log(chalk.blue(`\n🔍 Looking up ${chalk.bold(slug)} on HarnessHub...`));

  // 1. Fetch metadata from API
  const res = await fetch(`${API_BASE}/harnesses/${slug}`);
  
  if (res.status === 404) {
    throw new Error(`Harness '${slug}' not found. Please check the spelling or search on harnesshub.dev.`);
  }
  
  if (!res.ok) {
    throw new Error(`Failed to communicate with HarnessHub (Status: ${res.status})`);
  }

  const harness = await res.json() as any;

  console.log(chalk.green(`✓ Found: ${chalk.bold(harness.name)} (${harness.licenseTier} License)`));
  
  if (harness.licenseTier === 'YELLOW') {
    console.log(chalk.yellow(`⚠ Warning: This harness uses a Copyleft license (${harness.license}). Integration requires open-sourcing derivative works.`));
  } else if (harness.licenseTier === 'RED') {
    console.log(chalk.red(`⚠ Warning: This harness uses a highly restrictive or non-OSI license (${harness.license}). Usage may be restricted.`));
  }

  // 2. Determine Installation Command
  let cmdToRun = harness.installCmd;
  
  if (!cmdToRun) {
    console.log(chalk.gray(`No standard install command provided. Falling back to git clone...`));
    cmdToRun = `git clone ${harness.repoUrl}`;
  }

  console.log(chalk.blue(`\n🚀 Executing: ${chalk.bold(cmdToRun)}`));
  console.log(chalk.gray(`──────────────────────────────────────────────────`));

  // 3. Execute Command
  try {
    execSync(cmdToRun, { stdio: 'inherit' });
    console.log(chalk.gray(`──────────────────────────────────────────────────`));
    console.log(chalk.green(`\n✨ Successfully installed ${slug}!`));
  } catch (err: any) {
    console.log(chalk.gray(`──────────────────────────────────────────────────`));
    throw new Error(`Installation failed during execution of command: ${cmdToRun}`);
  }
}
