import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Portfolio} from "../entities/portfolio.entity";
import handleError from "../../service/handle.error";
import {PortfolioMainVisual} from "../entities/portfolio-main-visual.entity";
import {PortfolioArtWorkBlockPicture} from "../entities/portfolio-artwork-block-picture.entity";

@Injectable({
  providedIn: 'root'
})
export class PortfolioArtworkBlockPictureService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {
  }

  createPictures(picturesInfo: { portfolioArtWorkBlockId: any; url: string | undefined; sortNumber: number; }): Observable<PortfolioArtWorkBlockPicture> {
    const url = `${environment.serverAddress}/portfolio-art-work-picture/create`;
    const options = {
      ...this.httpHeader,
    };
    const body = {...picturesInfo};

    return this.httpClient.post<PortfolioArtWorkBlockPicture>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  deletePicture(id: string): Observable<void> {
    const url = `${environment.serverAddress}/portfolio-art-work-picture/delete?id=${id}`;
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
