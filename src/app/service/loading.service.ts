import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingSubject: Subject<boolean> = new Subject();

  public isLoading = false;

  constructor() { }

  loadingStart(): void {
    this.isLoading = true;
    this.sendLoadingStatus();
  }

  loadingEnd(): void {
    setTimeout(() => {
      this.isLoading = false;
      this.sendLoadingStatus();
    }, 500);
  }

  getLoadingObserver(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  sendLoadingStatus(): void {
    this.loadingSubject.next(this.isLoading);
  }
}
