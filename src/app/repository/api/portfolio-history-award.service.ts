import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import handleError from "../../service/handle.error";
import {PortfolioHistoryAward} from "../entities/portfolio-history-award.entity";

@Injectable({
  providedIn: 'root'
})
export class PortfolioHistoryAwardService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * @description 정보 초기 세팅 (기존 저장 된 내용 있을 시 기존 내용, 없을 시 생성)
   * */
  getAwardData(historyId: string): Observable<any>{
    const url = `${environment.serverAddress}/portfolio-history-award/getData?historyId=${historyId}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.get<any>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  saveAwardData(historyId: string, blocks: any): Observable<PortfolioHistoryAward[]>{
    const url = `${environment.serverAddress}/portfolio-history-award/saveData?historyId=${historyId}`;
    const options = {
      ...this.httpHeader,
    };
    const body = [...blocks];

    return this.httpClient.post<PortfolioHistoryAward[]>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  deleteAward(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-award/delete?id=${id}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.delete<void>(url,options).pipe(
      catchError((error)=>{
        return handleError(error);
      }),
    );
  }

  deleteAwardSubtitle(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-award/deleteSubtitle?id=${id}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.delete<void>(url,options).pipe(
      catchError((error)=>{
        return handleError(error);
      }),
    );
  }

  deleteAwardValue(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-award/deleteValue?id=${id}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.delete<void>(url,options).pipe(
      catchError((error)=>{
        return handleError(error);
      }),
    );
  }

}
