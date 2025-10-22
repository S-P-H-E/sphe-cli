import path from "path";
import fs from "fs-extra";

export async function expoNamer({folder, appsDir, targetDir}) {
    // Copy contents of /expo into targetDir root (no extra /expo folder)
    await fs.copy(path.join(appsDir, folder), targetDir).then(() => {
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
}

export async function nodeNamer({folder, appsDir, targetDir}) {
    // here we just copy the /node folder
    const nodeSource = path.join(appsDir, folder)
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
    })
}