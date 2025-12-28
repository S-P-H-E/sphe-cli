#!/usr/bin/env node
import { gitignore, globalsCss, nextPageCode, nodeIndex, nodePackage, nuxtApp, readmeCode } from './files';
import { spinner, isCancel, cancel, text, select, confirm, group } from '@clack/prompts';
import { SUPPORTED_PROJECTS, SUPPORTED_PACKAGES } from './constants';
import { execa } from 'execa';
import fs from 'fs'
import path from 'path'
import chalk from 'chalk';

const SUPPORTED_CATEGORIES = [...new Set(SUPPORTED_PROJECTS.map(p => p.category))]
type Package = (typeof SUPPORTED_PACKAGES)[number]

const s = spinner();

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
    let { targetDir } = getDirectory();

    if (!targetDir) {
        const dir = await text({
            message: "Enter your project name:",
            placeholder: ".",
            defaultValue: ".",
            validate(value) {
                // if (value.length === 0) return `Project name is required!`;
                if (/\s/.test(value)) return `Spaces are not allowed in the project name!`;
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
            s.start('Setting up Next JS Project');
            await execa`${pkInstall} create-next-app@latest ${targetDir} --yes --empty --skip-install --disable-git --biome`;

            fs.writeFileSync(path.join(targetDir, 'app/page.tsx'), nextPageCode)
            fs.writeFileSync(path.join(targetDir, 'app/globals.css'), globalsCss)
            fs.writeFileSync(path.join(targetDir, 'README.md'), readmeCode)

            s.stop('Next JS Project created!');
          break;
        case "nuxt":
            s.start('Setting up Nuxt Project');
            await execa`${pkInstall} create-nuxt@latest ${targetDir} --template=minimal --force --no-install --no-modules --gitInit=false --packageManager=${packageManager}`

            fs.writeFileSync(path.join(targetDir, 'app/app.vue'), nuxtApp)
            fs.writeFileSync(path.join(targetDir, 'app/globals.css'), globalsCss)

            s.stop('Nuxt Project created!');
          break;
        case "node":
            s.start('Setting up Node Project');

            // Create the target directory if it doesn't exist
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            
            fs.writeFileSync(path.join(targetDir, 'package.json'), nodePackage)
            fs.writeFileSync(path.join(targetDir, 'index.ts'), nodeIndex)

            s.stop('Node Project created!');
          break;
        // case "expo":
        //     s.start('Setting up Expo Project');
        //     await execa`${pkInstall} create-nuxt@latest ${targetDir} --template=minimal --force --no-install --no-modules --gitInit=false --packageManager=${packageManager}`

        //     fs.writeFileSync(path.join(targetDir, 'app/app.vue'), nuxtApp)
        //     fs.writeFileSync(path.join(targetDir, 'app/globals.css'), globalsCss)

        //     s.stop('Expo Project created!');
        //   break;

        case "svelte":
            s.start('Setting up Svelte Project');
            await execa(pkInstall, ['sv', 'create', '--template', 'minimal', '--types', 'ts', '--add', 'tailwindcss=plugins:none', '--no-install', targetDir], { stdio: 'ignore' })
            
            // Delete the .vscode folder
            fs.rmSync(path.join(targetDir, '.vscode'), { recursive: true, force: true })

            // Delete the static folder
            fs.rmSync(path.join(targetDir, 'static'), { recursive: true, force: true })

            // Delete the .npmrc file
            fs.rmSync(path.join(targetDir, '.npmrc'), { force: true })

            // Replace adapter '@sveltejs/adapter-auto'
            if (packageManager == 'bun') {
                const svelteConfigPath = path.join(targetDir, 'svelte.config.js')
                fs.writeFileSync(svelteConfigPath, fs.readFileSync(svelteConfigPath, 'utf-8').replace("'@sveltejs/adapter-auto'", "'svelte-adapter-bun'"))
            }

            // fs.writeFileSync(path.join(targetDir, 'app/app.vue'), nuxtApp)
            // fs.writeFileSync(path.join(targetDir, 'app/globals.css'), globalsCss)

            fs.writeFileSync(path.join(targetDir, 'README.md'), readmeCode)

            s.stop('Svelte Project created!');
          break;
    }

    // Step 6 & 7: Install dependencies & initialize git
    s.start(`Installing dependencies`);
    
    await execa(packageManager.toString(), ['install'], {
        cwd: targetDir,
        stdio: ["ignore", "ignore", "pipe"],
        windowsHide: true,
    })

    // Add bun adapter if using bun & svelte
    if (packageManager === 'bun' && projectType === 'svelte') {
        await execa('bun', ['add', '-D', 'svelte-adapter-bun'], {
            cwd: targetDir,
            stdio: ["ignore", "ignore", "pipe"],
            windowsHide: true,
        })
    }

    s.stop(`Installed via ${packageManager}`);

    if (git) {
        s.start("Initializing git");
        await execa("git", ["init"], {
            cwd: path.resolve(targetDir),
            stdio: "ignore",
		    windowsHide: true,
        })

        const gitignorePath = path.resolve(targetDir, ".gitignore");
        if (!fs.existsSync(gitignorePath)) {
            fs.writeFileSync(gitignorePath, gitignore);
        }

        await execa("git", ["add", "."], {
            cwd: path.resolve(targetDir),
            stdio: "ignore",
		    windowsHide: true,
        })

        await execa("git", ["commit", "-m", '"Initial commit"'], {
            cwd: path.resolve(targetDir),
            stdio: "ignore",
		    windowsHide: true,
        })

        s.stop("Git initialized");
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

main()