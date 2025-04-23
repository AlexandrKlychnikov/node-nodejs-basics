import { access, constants } from 'fs/promises';
import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const create = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const file = path.join(__dirname, 'files', 'fresh.txt');
  const data = 'I am fresh and young';

  try {
    await access(file, constants.F_OK);
    throw new Error('FS operation failed');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeFile(file, data);
    } else {
      throw err;
    }
  }
};

await create();