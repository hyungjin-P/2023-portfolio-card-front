import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable} from "rxjs";
import {Author} from "../entities/author.entity";
import {environment} from "../../../environments/environment";
import handleError from "../../service/handle.error";
import {AuthorProfile} from "../entities/author-profile.entity";

@Injectable({
  providedIn: 'root'
})
export class AuthorProfileService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) { }

  /**
   * @description 사용자 프로필 전체 조회
   * @param authorId
   * @return Author
   */

  findAllAuthorProfileByAuthorId(authorId : string): Observable<AuthorProfile[]> {
    const url = `${environment.serverAddress}/authorProfile/findAllAuthorProfileByAuthorId?authorId=${authorId}`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<AuthorProfile[]>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @description 사용자 프로필 추가
   * */
  create(authorProfile: AuthorProfile): Observable<AuthorProfile> {
    const url = `${environment.serverAddress}/authorProfile/create`;
    const options = {
      ...this.httpHeader,
    };
    const body = { ...authorProfile };

    return this.httpClient.patch<AuthorProfile>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @description 사용자 프로필 삭제
   * @param authorProfileId
   * */
  remove(authorProfileId: string): Observable<void> {
    const url = `${environment.serverAddress}/authorProfile/remove?id=${authorProfileId}`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.delete<void>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @description 사용자 프로필 수정
   * @return AuthorProfile
   * @param authorProfile
   * */
  modify(authorProfile: AuthorProfile): Observable<AuthorProfile> {
    const url = `${environment.serverAddress}/authorProfile/modify`;
    const options = {
      ...this.httpHeader,
    };
    const body = { ...authorProfile };

    return this.httpClient.patch<AuthorProfile>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }


}
