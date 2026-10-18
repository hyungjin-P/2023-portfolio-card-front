import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { InterceptorModule } from './interceptor/interceptor.module';
import { AutoSizeInputModule } from 'ngx-autosize-input';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatButtonModule,
    HttpClientModule,
    InterceptorModule,
    AutoSizeInputModule,
    OverlayscrollbarsModule,
  ],
  providers: [
    {
      provide: COMPOSITION_BUFFER_MODE,
      useValue: false
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
