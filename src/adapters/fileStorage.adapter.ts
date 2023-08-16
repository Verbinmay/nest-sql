import { promises as fsPromises } from 'fs';
import * as path from 'path';

import { Injectable } from '@nestjs/common';

@Injectable()
export class FileStorageAdapter {
  async saveAvatar(finalDir: string, originalname: string, buffer: Buffer) {
    return await fsPromises.writeFile(
      path.join(finalDir, originalname),
      buffer,
    );
  }
}
