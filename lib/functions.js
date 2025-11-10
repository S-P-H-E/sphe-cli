import { expoNamer, nodeNamer } from "./namers.js";

async function Expo({ appsDir, targetDir }) {
    await expoNamer({ folder: "expo-blank", appsDir, targetDir })

    console.log("\nBarebones Expo template copied.")
}

async function Node({ appsDir, targetDir }) {
    await nodeNamer({ folder: "node-blank", appsDir, targetDir })
    
    console.log("\nNode template copied.")
}

async function Nuxt({appsDir, targetDir}) {
    await nodeNamer({ folder: "nuxt-blank", appsDir, targetDir })

    console.log("\nNuxt template copied.")
}

async function Waku({appsDir, targetDir}) {
    await nodeNamer({ folder: "waku-blank", appsDir, targetDir })

    console.log("\nWaku template copied.")
}
export { Expo, Node, Nuxt, Waku }