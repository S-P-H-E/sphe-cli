#!/usr/bin/env node
import { Step1, Step2, Step3, Step4 } from './lib/steps.js'
import chalk from 'chalk'

async function main() {
    // Step 1: We collect the project name.
    const { appsDir, targetDir } = await Step1()

    // Step 2: The user picks a template.
    const { projectType } = await Step2()

    // Step 3: What to do with options.
    await Step3({ appsDir, targetDir, projectType})

    // Step 4: Install dependencies.
    await Step4(targetDir)

    // Step 5: The final, success message.
    console.log(chalk.green("\n🎉 Great! Your project has been created successfully! 🎉"))
    console.log("To view your project run:")
    switch(projectType) {
        case "Expo":
            console.log("")
            {targetDir != "." && console.log(chalk.yellow(`\tcd ${targetDir}`))}
            console.log(chalk.yellow("\tnpx expo start"))
            console.log("")
            break
        case "Node":
            console.log("")
            {targetDir != "." && console.log(chalk.yellow(`\tcd ${targetDir}`))}
            console.log(chalk.yellow("\tnpm run dev"))
            console.log("")
            break
    }
}
await main()