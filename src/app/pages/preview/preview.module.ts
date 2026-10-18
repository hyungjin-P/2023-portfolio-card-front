import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './preview.component';
import { PreviewFrontComponent } from './preview-front/preview-front.component';
import { PreviewBackComponent } from './preview-back/preview-back.component';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { PreviewArtworkComponent } from './preview-artwork/preview-artwork.component';
import { CardFaceControllerComponent } from './card-face-controller/card-face-controller.component';
import { MatRippleModule } from '@angular/material/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewTagsComponent } from '../../components/page-parts/preview/preview-tags/preview-tags.component';

@NgModule({
  declarations: [
    PreviewComponent,
    PreviewFrontComponent,
    PreviewBackComponent,
    PreviewArtworkComponent,
    CardFaceControllerComponent,
    PreviewTagsComponent,
  ],
  imports: [
    CommonModule,
    OverlayscrollbarsModule,
    MatRippleModule,
    ComponentsModule,
  ],
})
export class PreviewModule { }
