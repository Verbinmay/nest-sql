import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Images } from '../entities/sql/image.entity';
import { S3StorageAdapter } from '../adapters/fileStorage.adapter';

@Injectable()
export class ImagesRepository {
  constructor(
    @InjectRepository(Images)
    private readonly imageRepository: Repository<Images>,
    private readonly fileStorageAdapter: S3StorageAdapter,
  ) {}

  async create(image: Images) {
    await this.imageRepository.create(image);
    return await this.imageRepository.save(image);
  }

  async update(image: Images): Promise<Images> {
    return await this.imageRepository.save(image);
  }
  async delete(url: string) {
    return await this.imageRepository.delete({ url: url });
  }
  async deleteAll() {
    await this.fileStorageAdapter.deleteBucket();
    return await this.imageRepository.delete({});
  }
}
