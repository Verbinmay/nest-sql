import { imageInfo } from '../../../blogger/dto/avatar/view-blog-images.dto';

export class ViewPostDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: likeInfo[];
  };
  images: { main: Array<imageInfo> };
}

export class likeInfo {
  addedAt: string;
  userId: string;
  login: string;
}
