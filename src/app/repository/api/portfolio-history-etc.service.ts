import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Portfolio} from "../entities/portfolio.entity";
import handleError from "../../service/handle.error";
import {PortfolioHistoryEtc} from "../entities/portfolio-history-etc.entity";

@Injectable({
  providedIn: 'root'
})
export class PortfolioHistoryEtcService {
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
  getEtcData(historyId: string): Observable<any>{
    const url = `${environment.serverAddress}/portfolio-history-etc/getData?historyId=${historyId}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.get<any>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  saveEtcData(historyId: string, blocks: any): Observable<PortfolioHistoryEtc[]>{
    const url = `${environment.serverAddress}/portfolio-history-etc/saveData?historyId=${historyId}`;
    const options = {
      ...this.httpHeader,
    };
    const body = [...blocks];

    return this.httpClient.post<PortfolioHistoryEtc[]>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  deleteEtc(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-etc/delete?id=${id}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.delete<void>(url,options).pipe(
      catchError((error)=>{
        return handleError(error);
      }),
    );
  }

  deleteEtcSubtitle(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-etc/deleteSubtitle?id=${id}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.delete<void>(url,options).pipe(
      catchError((error)=>{
        return handleError(error);
      }),
    );
  }

  deleteEtcValue(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-etc/deleteValue?id=${id}`;
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
