import { ConfigService } from '@nestjs/config';

import { imageInfo } from '../blogger/dto/avatar/view-blog-images.dto';
import { Images } from '../entities/sql/image.entity';
import { S3StorageAdapter } from '../adapters/fileStorage.adapter';

export async function getImageViewModelUtil(
  images: Array<Images>,
  type: 'wallpaper' | 'main' | 'post',
): Promise<Array<imageInfo>> {
  const filtered = images.filter((i) => i.type === type);
  if (filtered.length > 1) {
    filtered.sort((a, b) => {
      const dateA = a.createdAt.getTime();
      const dateB = b.createdAt.getTime();
      return dateA - dateB;
    });
  }
  if (filtered.length > 0) {
    const fileStorageAdapter = new S3StorageAdapter(new ConfigService());
    const result = filtered.map((i) => {
      return {
        url: i.url,
        width: i.width,
        height: i.height,
        fileSize: i.fileSize,
      };
    });
    const changedUrl = [];
    for (let i = 0; i < result.length; i++) {
      const b = await fileStorageAdapter.getURL(result[i].url);

      changedUrl.push({
        ...result[i],
        url: b,
      });
    }
    return changedUrl;
  }
  return [];
}
