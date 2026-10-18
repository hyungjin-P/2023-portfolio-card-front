import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { Author } from '../repository/entities/author.entity';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage = sessionStorage;
  private authorKey: string = 'authAccess';

  constructor(
    private cryptoService: CryptoService,
  ) {}

  /** @description 로그인 한 유저를 리턴 */
  getAuthor(): Author {
    const encryptText = this.storage.getItem(this.authorKey);

    let decryptObj: any = undefined;

    if (encryptText) {
      decryptObj = this.cryptoService.decrypt(encryptText);
    }
    return decryptObj;
  }

  /** @description 로그인 한 유저를 세팅 */
  setAuthor(author: Author): void {
    const encryptText = this.cryptoService.encrypt(author);
    this.storage.setItem('authAccess', encryptText);
  }

  /** @description 로그아웃 */
  async removeAuthor(): Promise<void> {
    this.storage.removeItem(this.authorKey);
  }

}
