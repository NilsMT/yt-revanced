// index.js
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const API = "https://api.github.com/repos";
const SRC_DIR = "src";
const BUILD_DIR = "build";
const JAVA_PATH = "C:\\Program Files\\Java\\jdk-24.0.2\\bin\\java.exe";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

async function fetchJSON(url) {
    const res = await fetch(url, {
        headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "node",
        },
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    return res.json();
}

async function download(url, output) {
    console.log(`Downloading ${path.basename(output)}...`);
    const res = await fetch(url);
    if (!res.ok) throw new Error("Download failed");

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(output, buffer);
    console.log(`Saved → ${output}`);
}

async function downloadLatestAsset(owner, repo, matcher) {
    const release = await fetchJSON(`${API}/${owner}/${repo}/releases/latest`);
    const asset = release.assets.find((a) => matcher(a.name));
    if (!asset) throw new Error(`Asset not found in ${repo}`);

    const outPath = path.join(BUILD_DIR, asset.name);
    await download(asset.browser_download_url, outPath);
    return outPath;
}

// --------------------------------------------------
// Clean src folder
// --------------------------------------------------

function cleanBuild() {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
    for (const file of fs.readdirSync(BUILD_DIR)) {
        fs.rmSync(path.join(BUILD_DIR, file), { recursive: true, force: true });
    }
    console.log("build/ cleaned");
}

// --------------------------------------------------
// Get APK path from CLI argument
// --------------------------------------------------

function getApkFromArgs() {
    const apkArg = process.argv[2];
    if (!apkArg) {
        console.error("Usage: npm run build <path/to/apk>");
        process.exit(1);
    }

    const resolved = path.resolve(apkArg);
    if (!fs.existsSync(resolved)) {
        console.error("APK not found:", resolved);
        process.exit(1);
    }

    if (!resolved.endsWith(".apk") && !resolved.endsWith(".apkm")) {
        console.error("File must be .apk or .apkm");
        process.exit(1);
    }

    return resolved;
}

// --------------------------------------------------
// Main
// --------------------------------------------------

async function main() {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
    cleanBuild();

    console.log("Fetching latest ReVanced CLI...");
    const cliPath = await downloadLatestAsset(
        "ReVanced",
        "revanced-cli",
        (name) => name.endsWith(".jar"),
    );

    console.log("Fetching latest patches...");
    const patchesPath = await downloadLatestAsset(
        "ReVanced",
        "revanced-patches",
        (name) => name.endsWith(".rvp"),
    );

    console.log("Reading APK from CLI argument...");
    const apkPath = getApkFromArgs();
    console.log("Using APK:", apkPath);

    console.log("Running patch command...\n");

    // --------------------------------------------------
    // Spawn Java process directly (more reliable than PowerShell)
    // --------------------------------------------------
    const outPath = path.join(BUILD_DIR, "YouTube_ReVanced.apk");
    const args = [
        "-jar",
        cliPath,
        "patch",
        "-p",
        patchesPath,
        "-o",
        outPath,
        apkPath,
    ];

    const result = spawnSync(JAVA_PATH, args, { stdio: "inherit" });

    if (result.error) {
        console.error("Failed to run patch command:", result.error);
        process.exit(1);
    }

    if (result.status !== 0) {
        console.error("Patch command exited with code", result.status);
        process.exit(result.status);
    }

    console.log("\n✅ Done! Patched APK →", outPath);
}

// --------------------------------------------------
// Run
// --------------------------------------------------

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
