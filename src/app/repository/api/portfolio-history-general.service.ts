import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Portfolio} from "../entities/portfolio.entity";
import handleError from "../../service/handle.error";
import {PortfolioHistoryGeneral} from "../entities/portfolio-history-general.entity";

@Injectable({
  providedIn: 'root'
})
export class PortfolioHistoryGeneralService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {
  }

  create(portfolioHistoryId: string): Observable<PortfolioHistoryGeneral> {
    const url = `${environment.serverAddress}/portfolio-history-general/create?portfolioHistoryId=${portfolioHistoryId}`;

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    return this.httpClient.post<any>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  save(saveData: PortfolioHistoryGeneral): Observable<PortfolioHistoryGeneral> {
    const url = `${environment.serverAddress}/portfolio-history-general/save`;

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    const body = {...saveData};

    return this.httpClient.post<any>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }
}
