import * as path from 'path';
import * as fs from 'node:fs/promises';
import { safelyStringifyJSON } from '@/shared/utils';
import logger from './LoggerService';

class FileService {
  async exists(path): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async readFile(path: string): Promise<string | null> {
    try {
      return await fs.readFile(path, {
        encoding: 'utf8',
      });
    } catch (err) {
      logger.error('Error when read file', err);
      return null;
    }
  }

  async saveFile(folder: string, fileName: string, data: unknown) {
    const dataStr = typeof data === 'string' ? data : safelyStringifyJSON(data);

    try {
      const pathToDir = path.join(process.cwd(), `/${folder}/`);
      const pathToFile = path.join(process.cwd(), `/${folder}/`, fileName);

      const isDirExists = await this.exists(pathToDir);

      if (!isDirExists) {
        await fs.mkdir(pathToDir);
      }

      await fs.writeFile(pathToFile, dataStr);
    } catch (err) {
      logger.error('Error when write file', err);
    }
  }
}

export default new FileService();
