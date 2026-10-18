import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';

export class FileCompressOptions {
  maxSizeMb?: number;
  maxWidthOrHeight?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FileCompressService {
  constructor() {}

  /** @description 최대 300kb까지 허용, 가로, 세로 500까지 */
  async fileCompress(
    file: any,
    compressOption?: FileCompressOptions,
  ): Promise<any> {
    const imageFile = file;
    const options = {
      maxSizeMB: compressOption?.maxSizeMb ? compressOption?.maxSizeMb : 0.3,
      maxWidthOrHeight: compressOption?.maxWidthOrHeight
        ? compressOption?.maxWidthOrHeight
        : 500,
      useWebWorker: true,
    };

    try {
      return await imageCompression(imageFile, options);
    } catch (error) {
      console.error('image compression failed : ', error);
    }
  }
}
