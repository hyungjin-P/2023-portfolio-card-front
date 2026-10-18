import {Injectable} from '@angular/core';
import {Author} from '../repository/entities/author.entity';
import {Observable, Subject} from 'rxjs';
import {StorageService} from "./storage.service";
import {HeaderElementType} from "../components/shared/shared-header/shared-header.component";


/** @description 상태를 전달하는 용도 */
@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  authorSubject: Subject<Author> = new Subject<Author>();

  /* 주제 */
  isLogoSubject: Subject<boolean> = new Subject<boolean>();
  headerTypeSubject: Subject<HeaderElementType> = new Subject<HeaderElementType>();
  isLoginSubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private storageService: StorageService
  ) {}

  /** @description 유저 정보를 얻어온다 */
  getAuthor(): void {
    this.sendAuthorSubject();
  }

  /** @description 유저 정보를 설정한다  */
  setAuthor(): void {
    this.sendAuthorSubject()
  }

  /** @description 유저 정보를 지운다 (로그아웃) */
  removeAuthor(): void {
    this.sendAuthorSubject();
  }

  authorSubjectObservable(): Observable<Author> {
    return this.authorSubject.asObservable();
  }

  isLogoSubjectObservable(): Observable<boolean> {
    return this.isLogoSubject.asObservable();
  }

  sendIsLogoSubject(isLogo: boolean): void {
    this.isLogoSubject.next(isLogo);
  }

  sendHeaderTypeSubject(HeaderType: HeaderElementType): void {
    this.headerTypeSubject.next(HeaderType);
  }

  headerTypeSubjectObservable(): Observable<HeaderElementType> {
    return this.headerTypeSubject.asObservable();
  }

  /** @description 로그인 */
  isLoginSubjectObservable(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  /** @description 로그인 */
  sendIsLoginSubject(isLogin: boolean): void {
    this.isLoginSubject.next(isLogin);
  }

  sendAuthorSubject(): void {
    const author: Author = this.storageService.getAuthor()
    this.authorSubject.next(author);
  }
}
