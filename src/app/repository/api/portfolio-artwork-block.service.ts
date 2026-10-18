import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import handleError from "../../service/handle.error";
import {PortfolioArtWorkBlock} from "../entities/portfolio-artwork-block.entity";
import {PortfolioMainVisual} from "../entities/portfolio-main-visual.entity";


@Injectable({
  providedIn: 'root'
})
export class PortfolioArtworkBlockService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {
  }

  save(block: portfolioArtworkBlockSaveDto): Observable<PortfolioArtWorkBlock> {
    const url = `${environment.serverAddress}/portfolio-art-work-block/save`;
    const options = {
      ...this.httpHeader,
    };
    const body = {...block};

    return this.httpClient.post<PortfolioMainVisual>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );

  }

  create(block: portfolioArtWorkBlockCreateDto): Observable<PortfolioArtWorkBlock> {
    const url = `${environment.serverAddress}/portfolio-art-work-block/save`;
    const options = {
      ...this.httpHeader,
    };
    const body = {...block};

    return this.httpClient.post<PortfolioMainVisual>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  delete(id: string): Observable<void> {
    const url = `${environment.serverAddress}/portfolio-art-work-block/delete?id=${id}`;
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

export class portfolioArtworkBlockSaveDto {
  id?: string;
  sortNumber?: number;
  title?: string;
  description?: string;
  visibility?: boolean;
}

export class portfolioArtWorkBlockCreateDto {
  portfolioArtWorkId?: string;
  blockType?: string;
  sortNumber?: number;
}
