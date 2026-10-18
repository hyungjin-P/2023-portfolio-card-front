import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Author } from '../entities/author.entity';
import handleError from '../../service/handle.error';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {}

  /**
   * @description 사용자 정보 전체 조회
   * */
  getAll(): Observable<Author[]> {
    const url = `${environment.serverAddress}/author/getAll`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<Author[]>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @param author
   * @description 사용자 추가
   * */
  create(author: AuthorCreateDto): Observable<Author> {
    const url = `${environment.serverAddress}/author/create`;
    const options = {
      ...this.httpHeader,
    };
    const body = { ...author };

    return this.httpClient.post<Author>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @param authorId
   * @description 사용자 삭제
   * */
  remove(authorId: string): Observable<void> {
    const url = `${environment.serverAddress}/author/delete?id=${authorId}`;
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
   * @param author
   * @description 사용자 수정
   * */
  modify(author: Author): Observable<Author> {
    const url = `${environment.serverAddress}/author/modify`;
    const options = {
      ...this.httpHeader,
    };
    const body = { ...author };

    return this.httpClient.patch<Author>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @description 회원가입 완료
   * @param joinAuthorDto
   * */
  joinAuthor(joinAuthorDto: JoinAuthorDto): Observable<Author> {
    const url = `${environment.serverAddress}/author/joinAuthor`;
    const options = {
      ...this.httpHeader,
    };
    const body = { ...joinAuthorDto };

    return this.httpClient.post<Author>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @param createTempAuthor
   * @description 사용자 임시 주소 만들기
   * */
  createTempAuthor(createTempAuthor: CreateTempAuthorDto): Observable<Author> {
    const url = `${environment.serverAddress}/author/createTempAuthor`;
    const options = {
      ...this.httpHeader,
    };
    const body = { ...createTempAuthor };

    return this.httpClient.post<Author>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @description 로그인
   * @param loginAuthorDto
   * @return Author
   */
  loginAuthor(loginAuthorDto: LoginAuthorDto): Observable<Author> {
    const url = `${environment.serverAddress}/author/loginAuthor`;
    const options = {
      ...this.httpHeader,
    };
    const body = { ...loginAuthorDto }

    return this.httpClient.post<Author>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      })
    );
  }

  /**
   * @description 사용자 url 중복체크
   * @param authorLink
   * @return Author
   */

  isDuplicateAuthorLink(authorLink : string): Observable<boolean> {
    const url = `${environment.serverAddress}/author/isDuplicateAuthorLink?authorLink=${authorLink}`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<boolean>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @description 이메일 중복체크
   * @param email
   * @return Author
   */

  isDuplicateEmail(email : string): Observable<Author[]> {
    const url = `${environment.serverAddress}/author/isDuplicateEmail?authorLink=${email}`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<Author[]>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @description 사용자 url 중복체크
   * @param authorLink
   * @return Author
   */

  getAuthorByAuthorLink(authorLink : string): Observable<Author> {
    const url = `${environment.serverAddress}/author/getAuthorByAuthorLink?authorLink=${authorLink}`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<Author>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

}

export class LoginAuthorDto {
  authorLink?: string;
  password?: string;
}

export class JoinAuthorDto {
  id?: string;
  authorLink?: string;
  password?: string;
  email?: string;
  serviceTerm?: boolean;
}

export class CreateTempAuthorDto {
  provider?: string;
  authorLink?: string;
}

export class AuthorCreateDto {
  password?: string;
  provider?: string;
  providerId?: string;
  name?: string;
  email?: string;
}

class PortfolioMainVisualEntityDto {
  portfolioId?: string;
  name?: string;
  mainVisualUrl?: string;
  nickName?: string;
  subTitle?: string;
}
