import inquirer from "inquirer"
import path from "path";
import fs from "fs-extra";

async function Expo({appsDir, targetDir}) {

    const { expoTemplate } = await inquirer.prompt({
        name: 'expoTemplate',
        type: 'list',
        message: 'Choose your Expo template:',
        choices: [
            { name: "Empty (barebones)", value: "barebones" },
            { name: "Custom structure", value: "custom" },
        ],
    })
    
    // The expo path "./apps/expo"
    const expoSource = path.join(appsDir, "expo")

    if (expoTemplate === "barebones") {
        // Copy contents of /expo into targetDir root (no extra /expo folder)
        await fs.copy(expoSource, targetDir).then(() => {
            const projectPath = path.resolve(targetDir);
            const projectName = path.basename(projectPath);

            // Update package.json name
            try {
                const packageJsonPath = path.join(projectPath, 'package.json');
                const packageJson = fs.readJsonSync(packageJsonPath);
                packageJson.name = projectName;
                fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
            } catch (err) {
                // Ignore if package.json is missing or invalid; continue install
            }

            // Update package-lock.json name (if present)
            try {
                const packageLockPath = path.join(projectPath, 'package-lock.json');
                if (fs.existsSync(packageLockPath)) {
                    const packageLock = fs.readJsonSync(packageLockPath);
                    packageLock.name = projectName;
                    fs.writeJsonSync(packageLockPath, packageLock, { spaces: 2 });
                }
            } catch (err) {
                // Ignore if package-lock.json is missing or invalid; continue install
            }

            // Update app.json name, slug, and scheme
            try {
                const appJsonPath = path.join(projectPath, 'app.json');
                const appJson = fs.readJsonSync(appJsonPath);
                appJson.expo.name = projectName;
                appJson.expo.slug = projectName;
                // Remove hyphens from scheme if present
                if (appJson.expo.scheme) {
                    appJson.expo.scheme = projectName.replace(/-/g, '');
                }
                fs.writeJsonSync(appJsonPath, appJson, { spaces: 2 });
            } catch (err) {
                // Ignore if app.json is missing or invalid; continue install
            }
        })

        console.log("\nBarebones Expo template copied.")
    } else {
        // Copy contents of /expo into targetDir and add extra folders in root
        const dest = targetDir
        await fs.copy(expoSource, dest)
        // create extra folders
        const extraFolders = ["components", "utils", "types", "screens"]
        for (const folder of extraFolders) {
            await fs.ensureDir(path.join(dest, folder))
        }
        console.log("\nCustom Expo template created with extra folders.")
    }
}

async function Node({appsDir, targetDir}) {
    // here we just copy the /node folder
    const nodeSource = path.join(appsDir, "node")
    // copy contents of /node into the targetDir root (no extra /node folder)
    await fs.copy(nodeSource, targetDir).then(() => {
        const projectPath = path.resolve(targetDir);
        const projectName = path.basename(projectPath);

        // Update package.json name
        try {
            const packageJsonPath = path.join(projectPath, 'package.json');
            const packageJson = fs.readJsonSync(packageJsonPath);
            packageJson.name = projectName;
            fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
        } catch (err) {
            // Ignore if package.json is missing or invalid; continue install
        }

        // Update package-lock.json name (if present)
        try {
            const packageLockPath = path.join(projectPath, 'package-lock.json');
            if (fs.existsSync(packageLockPath)) {
                const packageLock = fs.readJsonSync(packageLockPath);
                packageLock.name = projectName;
                fs.writeJsonSync(packageLockPath, packageLock, { spaces: 2 });
            }
        } catch (err) {
            // Ignore if package-lock.json is missing or invalid; continue install
        }
    })
    console.log("\nNode template copied.")
}

export { Expo, Node }