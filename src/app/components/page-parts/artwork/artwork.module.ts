import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworkImageUploadComponent } from './artwork-image-upload/artwork-image-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { ComponentsModule } from '../../components.module';
import { AddArtworkItemButtonsComponent } from './add-artwork-item/add-artwork-item-buttons.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatRippleModule} from "@angular/material/core";

@NgModule({
  declarations: [
    ArtworkImageUploadComponent,
    AddArtworkItemButtonsComponent,
  ],
  exports: [ArtworkImageUploadComponent, AddArtworkItemButtonsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        MatButtonModule,
        ComponentsModule,
        DragDropModule,
        MatRippleModule,
    ],
})
export class ArtworkModule { }
