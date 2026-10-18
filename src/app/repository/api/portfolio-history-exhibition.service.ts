import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import handleError from "../../service/handle.error";
import {PortfolioHistoryExhibition} from "../entities/portfolio-history-exhibition.entity";

@Injectable({
  providedIn: 'root'
})
export class PortfolioHistoryExhibitionService {
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
  getExhibitionData(historyId: string): Observable<any>{
    const url = `${environment.serverAddress}/portfolio-history-exhibition/getData?historyId=${historyId}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.get<any>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  saveExhibitionData(historyId: string, blocks: any): Observable<PortfolioHistoryExhibition[]>{
    const url = `${environment.serverAddress}/portfolio-history-exhibition/saveData?historyId=${historyId}`;
    const options = {
      ...this.httpHeader,
    };
    const body = [...blocks];

    return this.httpClient.post<PortfolioHistoryExhibition[]>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  deleteExhibition(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-exhibition/delete?id=${id}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.delete<void>(url,options).pipe(
      catchError((error)=>{
        return handleError(error);
      }),
    );
  }

  deleteExhibitionSubtitle(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-exhibition/deleteSubtitle?id=${id}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.delete<void>(url,options).pipe(
      catchError((error)=>{
        return handleError(error);
      }),
    );
  }

  deleteExhibitionValue(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-exhibition/deleteValue?id=${id}`;
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
