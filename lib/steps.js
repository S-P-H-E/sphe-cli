import inquirer from "inquirer"
import { Expo, Node } from "./functions.js"
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { createSpinner } from "nanospinner";

async function Step1() {
    let targetDir = process.argv[2];

    if (!targetDir) {
        const { projectName } = await inquirer.prompt({
            name: "projectName",
            type: "input",
            message: "Enter your project name:",
            default: ".",
            validate: (input) => input.trim() !== "" || "Please enter a valid project name.",
        })

        targetDir = projectName
    }

    // Resolve apps templates relative to this CLI package location
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const appsDir = path.resolve(__dirname, "../apps")

    return { appsDir, targetDir }
}

async function Step2() {
    const { projectType } = await inquirer.prompt({
        name: 'projectType',
        type: 'list',
        message: 'What template do you want to use?',
        choices: [
            'Expo',
            'Node',
        ]
    })

    return { projectType }
}

async function Step3({ appsDir, targetDir, projectType}) {
    // What to do when a specific framework is chosen.
    switch(projectType) {
        case "Expo":
            await Expo({appsDir, targetDir})

            break;
        case "Node":
            await Node({appsDir, targetDir})    

            break;
    }
}

async function Step4(targetDir) {
	const spinner = createSpinner('Installing dependencies...').start()
	try {
		await new Promise((resolve, reject) => {
			const child = spawn('npm', ['install', '--silent', '--no-progress', '--loglevel=error'], { cwd: path.resolve(targetDir), stdio: 'ignore' })
			child.on('error', reject)
			child.on('close', (code) => {
				if (code === 0) return resolve()
				reject(new Error(`npm install failed with exit code ${code}`))
			})
		})
		spinner.success({ text: 'Dependencies installed successfully.' })
	} catch (error) {
		spinner.error({ text: 'Dependency installation failed.' })
		throw error
	}
}

export { Step1, Step2, Step3, Step4 }