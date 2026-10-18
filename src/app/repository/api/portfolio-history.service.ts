import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import handleError from "../../service/handle.error";
import {PortfolioHistory} from "../entities/portfolio-history.entity";

@Injectable({
  providedIn: 'root'
})
export class PortfolioHistoryService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {
  }

  create(portfolioId: string): Observable<PortfolioHistory> {
    const url = `${environment.serverAddress}/portfolio-history/create?portfolioId=${portfolioId}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.post<PortfolioHistory>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  getAllHistoryByPortfolioId(portfolioId: string): Observable<PortfolioHistory> {
    const url = `${environment.serverAddress}/portfolio-history/getAllHistoryByPortfolioId?portfolioId=${portfolioId}`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<PortfolioHistory>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }
}
