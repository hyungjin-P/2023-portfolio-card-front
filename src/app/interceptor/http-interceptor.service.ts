import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from '../service/global.service';
import { StorageService } from '../service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private globalService: GlobalService,
    private storageService: StorageService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('running interceptor ');

    // const request: HttpRequest<any> = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${token is here}`,
    //   },
    // })

    return next.handle(req);
  }
}
