import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import handleError from "../../service/handle.error";
import { PortfolioHistoryEducation } from '../entities/portfolio-history-education.entity';

@Injectable({
  providedIn: 'root'
})
export class PortfolioHistoryEducationService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {

  }

  getAll(): Observable<any>{
    const url = `${environment.serverAddress}/portfolio-history-education/getAll`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.get<any>(url, options);
  }

  /**
   * @description 학력정보 초기 세팅 (기존 저장 된 내용 있을 시 기존 내용, 없을 시 생성)
   * */
  getEducationData(historyId: string): Observable<any>{
    const url = `${environment.serverAddress}/portfolio-history-education/getData?historyId=${historyId}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.get<any>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  saveEducationData(historyId: string, blocks: any): Observable<PortfolioHistoryEducation[]>{
    const url = `${environment.serverAddress}/portfolio-history-education/saveData?historyId=${historyId}`;
    const options = {
      ...this.httpHeader,
    };
    const body = [...blocks];

    return this.httpClient.post<PortfolioHistoryEducation[]>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  deleteEducation(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-education/delete?id=${id}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.delete<void>(url,options).pipe(
      catchError((error)=>{
        return handleError(error);
      }),
    );
  }

  deleteEducationSubtitle(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-education/deleteSubtitle?id=${id}`;
    const options = {
      ...this.httpHeader,
    };

    return this.httpClient.delete<void>(url,options).pipe(
      catchError((error)=>{
        return handleError(error);
      }),
    );
  }

  deleteEducationValue(id: string): Observable<void>{
    const url = `${environment.serverAddress}/portfolio-history-education/deleteValue?id=${id}`;
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
