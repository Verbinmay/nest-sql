import { existsSync } from 'fs';
import { promises as fsPromises } from 'fs';

export async function CheckDir(finalDir: string) {
  if (!existsSync(finalDir)) {
    await fsPromises.mkdir(finalDir, { recursive: true });
    return;
  }
  return;
}
