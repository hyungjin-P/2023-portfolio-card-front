import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PortfolioMainVisualTheme} from "../entities/portfolio-main-visual-theme.entity";
import handleError from "../../service/handle.error";

@Injectable({
  providedIn: 'root'
})
export class PortfolioMainVisualThemeService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {
  }

  /**
   * @param portfolioMainVisualThemeCreate
   * @description 포트폴리오 메인비주얼 테마 추가
   * */
  create(portfolioMainVisualThemeCreate: PortfolioMainVisualThemeCreate): Observable<PortfolioMainVisualTheme> {
    const url = `${environment.serverAddress}/portfolio-main-visual-theme/create`;
    const options = {
      ...this.httpHeader,
    };
    const body = {...portfolioMainVisualThemeCreate};

    return this.httpClient.post<PortfolioMainVisualTheme>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @description 포트폴리오 메인 비주얼 전체 조회
   * */
  getAll(): Observable<PortfolioMainVisualTheme[]> {
    const url = `${environment.serverAddress}/portfolio-main-visual-theme/getAll`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<PortfolioMainVisualTheme[]>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @param portfolioMainVisualId
   * @description 포트폴리오 메인비주얼 최근 것 1개 조회
   * */
  getOneByRecently(portfolioMainVisualId: string): Observable<PortfolioMainVisualTheme[]> {
    const url = `${environment.serverAddress}/portfolio-main-visual-theme/getOneByRecently?portfolioId=${portfolioMainVisualId}`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<PortfolioMainVisualTheme[]>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @param id
   * @description 포트폴리오 메인비주얼 해당 1건 삭제
   * */
  remove(id: string): Observable<void> {
    const url = `${environment.serverAddress}/portfolio-main-visual-theme/remove?id=${id}`;
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
   * @param portfolioMainVisualTheme
   * @description 사용자 수정
   * */
  modify(portfolioMainVisualTheme: PortfolioMainVisualTheme): Observable<PortfolioMainVisualTheme> {
    const url = `${environment.serverAddress}/portfolio-main-visual-theme/modify`;
    const options = {
      ...this.httpHeader,
    };
    const body = {...portfolioMainVisualTheme};

    return this.httpClient.patch<PortfolioMainVisualTheme>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

}


export class PortfolioMainVisualThemeCreate {
  portfolioMainVisualId?: string;
  controllerClass?: string;
  shareButtonClass?: string;
  titleClass?: string;
  subTitleClass?: string;
  tagClass?: string;
}

