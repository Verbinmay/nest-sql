import {
  S3Client,
  AbortMultipartUploadCommand,
  PutObjectAclCommand,
  PutObjectCommand,
  PutObjectAclCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  DeleteBucketCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { log } from 'console';
import { randomUUID } from 'crypto';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
  async getImage(url: string) {
    return '';
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

  async getURL(url: string) {
    const bucketParams = {
      Bucket: 'markmaistrenko',
      Key: url,
    };

    const command = new GetObjectCommand(bucketParams);

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      return url;
    } catch (exceptions) {
      console.error(exceptions);
      throw exceptions;
    }
  }
  async deleteBucket() {
    const bucketParams = {
      Bucket: 'markmaistrenko',
    };

    const listOfFilesCommand = new ListObjectsV2Command(bucketParams);

    try {
      let isTruncated = true;

      const contentsUrl: Array<string> = [];

      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } =
          await this.s3Client.send(listOfFilesCommand);
        if (!Contents || Contents.length === 0) return;

        const contentsList = Contents.map((c) => c.Key);
        while (contentsList.length > 0) {
          contentsUrl.push(contentsList.splice(0, 1)[0]);
        }

        isTruncated = IsTruncated;
        listOfFilesCommand.input.ContinuationToken = NextContinuationToken;
      }

      const keysByDelete = contentsUrl.map((m) => {
        return {
          Key: m,
        };
      });

      const bucketDeleteAllParams = {
        Bucket: 'markmaistrenko',
        Delete: {
          Objects: keysByDelete,
        },
      };

      const deleteAllCommand = new DeleteObjectsCommand(bucketDeleteAllParams);
      const resultOfDelete = await this.s3Client.send(deleteAllCommand);
      console.log(resultOfDelete, 'resultOfDelete');
    } catch (exceptions) {
      console.error(exceptions);
      throw exceptions;
    }
  }
}
