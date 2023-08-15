import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileManager {
  private filePath: string;

  constructor() {
    this.filePath = './Data/';
  }

  async writeFile(fileName: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath + fileName, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async readFile(fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath + fileName, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
