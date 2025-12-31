#!/usr/bin/env node
import { isCancel, cancel, text, select, confirm, group } from '@clack/prompts';
import path from 'path'
import chalk from 'chalk';
import { initializeGit, installDependencies, setupNext, setupNode, setupNuxt, setupSvelte } from './setup';

const SUPPORTED_PROJECTS = [
    { name: 'Next JS', type: 'next', category: 'Frontend' },
    { name: 'Nuxt', type: 'nuxt', category: 'Frontend' },
    { name: 'Svelte', type: 'svelte', category: 'Frontend' },
    { name: 'Node', type: 'node', category: 'Backend' },
] as const
  
const SUPPORTED_PACKAGES = [
    { pkName: 'npm', pkInstall: 'npx' },
    { pkName: 'pnpm', pkInstall: 'pnpx' },
    { pkName: 'bun', pkInstall: 'bunx' },
] as const

const SUPPORTED_CATEGORIES = [...new Set(SUPPORTED_PROJECTS.map(p => p.category))]
type Package = (typeof SUPPORTED_PACKAGES)[number]

function validateProjectName(value: string) {
    if (/\s/.test(value)) {
      throw new Error('Spaces are not allowed in the project name')
    }

    if (!/^[a-z][a-z0-9-]*$/.test(value)) {
        throw new Error(
            'Project name must start with a letter and contain only lowercase letters, numbers, and dashes'
        )
    }
}

export function getDirectory() {
    let targetDir = process.argv[2];
    let dirName = targetDir === "." ? path.basename(process.cwd()) : path.basename(path.resolve(targetDir))
    return { targetDir, dirName }
}

function isCanceled(value: boolean | string | symbol): asserts value is string | boolean {
    if (isCancel(value)) {
        cancel('Project creation cancelled.');
        process.exit(0);
    }
}

function getPackageManager(): Package {
  const ua = process.env.npm_config_user_agent ?? ''
  const detected = SUPPORTED_PACKAGES.find(p => ua.startsWith(p.pkName)) ?? SUPPORTED_PACKAGES[0];
  return detected;
}

async function main() {
    // Step 1: Get project name
    let { targetDir, dirName } = getDirectory();

    if (targetDir) {
        validateProjectName(targetDir)
    } else {
        const dir = await text({
            message: "Enter your project name:",
            placeholder: ".",
            defaultValue: ".",
            validate(value) {
                try {
                    validateProjectName(value)
                } catch (e) {
                    return (e as Error).message
                }
            }
        })

        isCanceled(dir)

        targetDir = dir.toString()
    }
    
    // Step 2: Get package manager
    const { pkName, pkInstall } = getPackageManager();

    // Step 3: Confirm package manager & git
    const { packageManager, git } = await group(
        {
            packageManager: () => select({
                message: 'Which package manager would you like to use?',
                initialValue: pkName,
                options: SUPPORTED_PACKAGES.map(p => ({
                  value: p.pkName,
                  label: p.pkName,
                  hint: pkName === p.pkName ? 'detected' : '',
                })),
            }),
            git: () => confirm({
                message: 'Do you want to initialize a git repo?',
            })
        }, {
            onCancel: () => {
                cancel('Project creation cancelled.');
                process.exit(0);
            },
    })

    // Step 4: Project category
    const projectCategory = await select({
        message: 'What type of project do you want?',
        options: SUPPORTED_CATEGORIES.map(p => ({ value: p, label: p })),
    });

    isCanceled(projectCategory)

    // Step 5: Project type
    const projectType = await select({
        message: `What ${projectCategory.toLowerCase()} template do you want to use?`,
        options: SUPPORTED_PROJECTS.filter(p => p.category === projectCategory).map(p => ({
            value: p.type,
            label: p.name,
        })),
    });
    
    isCanceled(projectType)

    // Make this more dynamic
    switch(projectType) {
        case "next":
            await setupNext(targetDir, pkInstall, dirName)
          break;
        case "nuxt":
            await setupNuxt(targetDir, pkInstall, dirName, packageManager)
          break;
        case "node":
            await setupNode(targetDir, pkInstall, dirName)
          break;
        case "svelte":
            await setupSvelte(targetDir, pkInstall, dirName, packageManager)
          break;
    }

    // Step 6 & 7: Install dependencies & initialize git
    await installDependencies(targetDir, packageManager, projectType)

    if (git) {
        await initializeGit(targetDir)
    }

    // Success message
    console.log(chalk.green("\n🎉 Great! Your project has been created successfully! 🎉"))
    console.log("To view your project run:")
    console.log("")
    {targetDir != "." && console.log(chalk.yellow(`\tcd ${targetDir}`))}
    {packageManager=="npm" ? (
        console.log(chalk.yellow(`\t${packageManager} run dev`))
    ):(
        console.log(chalk.yellow(`\t${packageManager} dev`))
    )}
    console.log("")
}

main();