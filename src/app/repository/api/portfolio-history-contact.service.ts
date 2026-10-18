import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {PortfolioHistoryContact} from "../entities/portfolio-history-contact.entity";
import {environment} from "../../../environments/environment";
import handleError from "../../service/handle.error";

@Injectable({
  providedIn: 'root'
})
export class PortfolioHistoryContactService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {
  }

  create(portfolioHistoryId: string): Observable<PortfolioHistoryContact>{
    const url = `${environment.serverAddress}/portfolio-history-contact/create?portfolioHistoryId=${portfolioHistoryId}`;

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

  save(saveData: PortfolioHistoryContact): Observable<PortfolioHistoryContact> {
    const url = `${environment.serverAddress}/portfolio-history-contact/save`;

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
