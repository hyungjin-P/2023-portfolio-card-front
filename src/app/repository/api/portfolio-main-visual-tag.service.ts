import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PortfolioMainVisualTag} from "../entities/portfolio-main-visual-tag.entity";
import handleError from "../../service/handle.error";

@Injectable({
  providedIn: 'root'
})
export class PortfolioMainVisualTagService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {
  }

  /**
   * @param portfolioMainVisualTagCreate
   * @description 포트폴리오 메인 비주얼 태그 생성
   * */
  create(portfolioMainVisualTagCreate: PortfolioMainVisualTagCreate): Observable<PortfolioMainVisualTag> {
    const url = `${environment.serverAddress}/portfolio-main-visual-tag/create`;
    const options = {
      ...this.httpHeader,
    };
    const body = {...portfolioMainVisualTagCreate};

    return this.httpClient.post<PortfolioMainVisualTag>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @param id
   * @description 포트폴리오 메인 비주얼 태그 삭제
   * */
  remove(id: string): Observable<void> {
    const url = `${environment.serverAddress}/portfolio-main-visual-tag/remove?id=${id}`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.delete<void>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }
}

export class PortfolioMainVisualTagCreate {
  portfolioMainVisualId?: string;
  content?: string;
}
