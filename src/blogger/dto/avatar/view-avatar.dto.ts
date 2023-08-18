export class imageInfo {
  url: string;
  width: number;
  height: number;
  fileSize: number;
}

export class imageDto {
  wallpaper: imageInfo;
  main: Array<imageInfo>;
}
