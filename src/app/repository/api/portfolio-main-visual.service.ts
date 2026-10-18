import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PortfolioMainVisual} from "../entities/portfolio-main-visual.entity";
import handleError from "../../service/handle.error";
import { PortfolioMainVisualTag } from '../entities/portfolio-main-visual-tag.entity';

@Injectable({
  providedIn: 'root'
})
export class PortfolioMainVisualService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {
  }

  /**
   * @description 포트폴리오 메인 비주얼 전체 조회
   * */
  getAll(): Observable<PortfolioMainVisual[]> {
    const url = `${environment.serverAddress}/portfolio-main-visual/getAll`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<PortfolioMainVisual[]>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @param portfolioId
   * @description 포트폴리오 해당 1건 조회
   * */
  findOne(portfolioId: string): Observable<PortfolioMainVisual> {
    const url = `${environment.serverAddress}/portfolio-main-visual/findOne?portfolioId=${portfolioId}`;
    const options = {
      ...this.httpHeader,
    };
    return this.httpClient.get<PortfolioMainVisual>(url, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }


  /**
   * @param portfolioMainVisualCreate
   * @description 포트폴리오 메인 비주얼 추가
   * */
  create(portfolioMainVisualCreate: PortfolioMainVisualCreate): Observable<PortfolioMainVisual> {
    const url = `${environment.serverAddress}/portfolio-main-visual/create`;
    const options = {
      ...this.httpHeader,
    };
    const body = {...portfolioMainVisualCreate};

    return this.httpClient.post<PortfolioMainVisual>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  /**
   * @param portfolioMainVisualSaveInItemDto
   * @description 메인비주얼 (태그 포함) 저장
   * */
  saveAndInItem(portfolioMainVisualSaveInItemDto: PortfolioMainVisualSaveInItemDto): Observable<PortfolioMainVisual> {
    const url = `${environment.serverAddress}/portfolio-main-visual/saveAndInItem`;
    const options = {
      ...this.httpHeader,
    };
    const body = {...portfolioMainVisualSaveInItemDto};

    return this.httpClient.post<PortfolioMainVisual>(url, body, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }
}

export class PortfolioMainVisualCreate {
  portfolioId?: string;
  name?: string;
  mainVisualUrl?: string;
  nickName?: string;
  subTitle?: string;
}

export class PortfolioMainVisualSaveInItemDto {
  mainVisualId?: string;
  portfolioId?: string;
  name?: string;
  mainVisualUrl?: string;
  nickName?: string;
  subTitle?: string;
  portfolioMainVisualTags?: PortfolioMainVisualTag[];
}
