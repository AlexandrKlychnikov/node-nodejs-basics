import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const copy = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sourceDir = path.join(__dirname, 'files');
    const targetDir = path.join(__dirname, 'files_copy');

    try {
        await fs.access(sourceDir);
        try {
            await fs.access(targetDir);
            throw new Error('FS operation failed');
        } catch (targetErr) {
            if (targetErr.code === 'ENOENT') {
                await copyDirectory(sourceDir, targetDir);
            } else {
                throw targetErr;
            }
        }
    } catch (sourceErr) {
        if (sourceErr.code === 'ENOENT') {
            throw new Error('FS operation failed');
        }
        throw sourceErr;
    }
};

async function copyDirectory(source, target) {
    await fs.mkdir(target);
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(source, entry.name);
        const destPath = path.join(target, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

await copy();
