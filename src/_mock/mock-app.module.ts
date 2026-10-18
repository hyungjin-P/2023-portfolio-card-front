import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppModule } from '../app/app.module';
import { AppComponent } from '../app/app.component';

import { MockApiInterceptor } from './mock-api.interceptor';

/** 원본 AppModule 을 그대로 감싸고, back API 호출만 목업으로 바꾼다 */
@NgModule({
  imports: [AppModule],
  providers: [
    // InterceptorModule 의 원본 HttpInterceptorService(통과형) 다음에 실행된다
    { provide: HTTP_INTERCEPTORS, useClass: MockApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class MockAppModule {}
