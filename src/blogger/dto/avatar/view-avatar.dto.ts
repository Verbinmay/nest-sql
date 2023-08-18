export class imageInfo {
  url: string;
  width: number;
  height: number;
  fileSize: number;
}

export class avatarDto {
  wallpaper: imageInfo;
  main: [imageInfo];
}
