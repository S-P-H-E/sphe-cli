import inquirer from "inquirer"
import { Expo, Node, Nuxt } from "./functions.js"
import path from "path";
import { fileURLToPath } from "url";
import { createSpinner } from "nanospinner";
import { execSync } from "child_process"

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
            'Nuxt',
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
        case "Nuxt":
            await Nuxt({appsDir, targetDir})    

            break;
    }
}

async function Step4(targetDir) {
	const spinner = createSpinner("Installing dependencies...").start()

	try {
		execSync("npm install", {
			cwd: path.resolve(targetDir),
			stdio: ["ignore", "ignore", "pipe"],
			windowsHide: true,
		})
		spinner.success({ text: "Dependencies installed successfully." })
	} catch (err) {
		spinner.error({ text: "Dependency installation failed." })
		console.error(err.message)
	}
}

export { Step1, Step2, Step3, Step4 }