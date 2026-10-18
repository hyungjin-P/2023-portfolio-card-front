 import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import handleError from "../../service/handle.error";
import { PortfolioArtWork } from '../entities/portfolio-artwork.entity';

@Injectable({
  providedIn: 'root'
})
export class PortfolioArtworkService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * @description 작품 초기 세팅 (기존 저장 된 내용 있을 시 기존 내용, 없을 시 생성)
   * */
  initArtWork(authorId?: string): Observable<PortfolioArtWork> {
    const url = `${environment.serverAddress}/portfolio-art-work/init?authorId=${authorId}`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<PortfolioArtWork>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

}
