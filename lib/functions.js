import inquirer from "inquirer"
import { expoNamer, nodeNamer } from "./namers.js";

async function Expo({ appsDir, targetDir }) {
    const { expoTemplate } = await inquirer.prompt({
        name: 'expoTemplate',
        type: 'list',
        message: 'Choose your Expo template:',
        choices: [
            { name: "Empty (barebones)", value: "barebones" },
            { name: "Empty (nativewind styling)", value: "nativewind" },
        ],
    })

    switch (expoTemplate) {
        case "barebones":
            await expoNamer({ folder: "expo-blank", appsDir, targetDir })

            console.log("\nBarebones Expo template copied.")
            break
        case "nativewind":
            await expoNamer({ folder: "expo-nativewind", appsDir, targetDir })

            console.log("\nNativewind Expo template copied.")
            break
    }
}

async function Node({ appsDir, targetDir }) {
    await nodeNamer({ folder: "node-blank", appsDir, targetDir })
    
    console.log("\nNode template copied.")
}

async function Nuxt({appsDir, targetDir}) {
    await nodeNamer({ folder: "nuxt-blank", appsDir, targetDir })

    console.log("\nNuxt template copied.")
}

export { Expo, Node, Nuxt }