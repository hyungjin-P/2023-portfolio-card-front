import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Portfolio} from "../entities/portfolio.entity";
import handleError from "../../service/handle.error";

@Injectable({
  providedIn: 'root'
})
export class PortfolioHistorySnsLinkService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private httpClient: HttpClient
  ) {
  }

}
