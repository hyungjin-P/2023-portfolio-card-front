import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Portfolio} from "../entities/portfolio.entity";
import handleError from "../../service/handle.error";

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {
  }

  /**
   * @description 포트폴리오 추가
   * @param portfolio
   * */
  create(portfolio: Portfolio): Observable<Portfolio> {
    const url = `${environment.serverAddress}/portfolio/create`;
    const options = {
      ...this.httpHeader,
    };
    const body = {...portfolio};

    return this.httpClient.post<Portfolio>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @description 포트폴리오 있는지 없는지 확인 후 생성 혹은 조회
   * @param createNewPortfolioDto
   * */
  createNewPortfolio(createNewPortfolioDto: CreateNewPortfolioDto): Observable<Portfolio> {
    const url = `${environment.serverAddress}/portfolio/createNewPortfolio`;
    const options = {
      ...this.httpHeader,
    };
    const body = {...createNewPortfolioDto};

    return this.httpClient
      .post<Portfolio>(url, body, options)
      .pipe(catchError((error) => {
        return handleError(error);
      }),
    );
  }
}

export class CreateNewPortfolioDto {
  authorId?:string;
}
