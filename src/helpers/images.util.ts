import { imageInfo } from '../blogger/dto/avatar/view-avatar.dto';
import { Images } from '../entities/sql/image.entity';

export function getImageViewModelUtil(
  images: Array<Images>,
  type: 'wallpaper' | 'main',
): imageInfo | Array<imageInfo> {
  if (images.length === 0 && type === 'wallpaper') return null;
  if (images.length === 0 && type === 'main') return [];

  const filtered = images.filter((i) => (i.type = type));
  if (filtered.length > 1) {
    filtered.sort((a, b) => {
      const dateA = a.createdAt.getTime();
      const dateB = b.createdAt.getTime();
      return dateA - dateB;
    });
  }

  const result = filtered.map((i) => {
    return {
      url: i.url,
      width: i.width,
      height: i.height,
      fileSize: i.fileSize,
    };
  });

  return type === 'main' ? result : result[0];
}
