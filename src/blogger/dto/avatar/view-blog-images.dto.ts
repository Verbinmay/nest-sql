export class imageInfo {
  url: string;
  width: number;
  height: number;
  fileSize: number;
}

export class imageBlogDto {
  wallpaper: imageInfo;
  main: Array<imageInfo>;
}
