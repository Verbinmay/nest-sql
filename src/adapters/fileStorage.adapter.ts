import {
  S3Client,
  AbortMultipartUploadCommand,
  PutObjectAclCommand,
  PutObjectCommand,
  PutObjectAclCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { log } from 'console';
import { randomUUID } from 'crypto';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CheckDir } from './checkDir';

@Injectable()
export class FileStorageAdapter {
  async saveImage(finalDir: string, originalname: string, buffer: Buffer) {
    await CheckDir(finalDir);
    await fsPromises.writeFile(path.join(finalDir, originalname), buffer);
    return { url: path.join(finalDir, originalname) };
  }
  async deleteImage(url: string) {
    await fsPromises.unlink(url);
    return;
  }
}

@Injectable()
export class S3StorageAdapter {
  s3Client: S3Client;
  private Bucket: 'markmaistrenko';
  constructor(private configService: ConfigService) {
    const REGION = 'us-east-1';
    this.s3Client = new S3Client({
      region: REGION,
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
        accessKeyId: this.configService.get('ACCESS_KEY_ID'),
      },
    });
  }
  async saveImage(finalDir: string, originalname: string, buffer: Buffer) {
    const key: string = finalDir
      .split(path.dirname(require.main.filename))[1]
      .substring(1);

    const bucketParams = {
      Bucket: 'markmaistrenko',
      Key: `${key}/${originalname}`,
      Body: buffer,
      ContentType: 'images/jpeg',
    };

    const command = new PutObjectCommand(bucketParams);

    try {
      const uploadResult: PutObjectAclCommandOutput = await this.s3Client.send(
        command,
      );

      return {
        url: bucketParams.Key,
      };
    } catch (exceptions) {
      console.error(exceptions);
      throw exceptions;
    }
  }
  async deleteImage(url: string) {
    const bucketParams = {
      Bucket: 'markmaistrenko',
      Key: url,
    };

    const command = new DeleteObjectCommand(bucketParams);

    try {
      const deleteResult: DeleteObjectCommandOutput = await this.s3Client.send(
        command,
      );
      return deleteResult;
    } catch (exceptions) {
      console.error(exceptions);
      throw exceptions;
    }
  }
}
