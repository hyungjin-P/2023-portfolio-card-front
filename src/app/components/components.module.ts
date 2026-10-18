import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedConfirmButtonComponent } from './shared/shared-confirm-button/shared-confirm-button.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedLoadingComponent } from './shared/shared-loading/shared-loading.component';
import { SharedInputComponent } from './shared/shared-input/shared-input.component';
import { SharedHeaderComponent } from './shared/shared-header/shared-header.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedButtonComponent } from './shared/shared-button/shared-button.component';
import { SharedCheckboxComponent } from './shared/shared-checkbox/shared-checkbox.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedConfirmDialogComponent } from './shared/shared-confirm-dialog/shared-confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedFooterComponent } from './shared/shared-footer/shared-footer.component';
import { SharedAuthorLinkFormComponent } from './shared/shared-author-link-form/shared-author-link-form.component';
import { SharedEditorTabsComponent } from './shared/shared-editor-tabs/shared-editor-tabs.component';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { ButtonPreviewComponent } from './shared/button-preview/button-preview.component';
import { SharedGuideComponent } from './shared/shared-guide/shared-guide.component';
import { SharedTextareaComponent } from './shared/shared-textarea/shared-textarea.component';
import { SharedBlockLabelComponent } from './shared/shared-block-label/shared-block-label.component';
import { MainViewBackgroundChangeComponent } from './page-parts/main-view-management/main-view-background-change/main-view-background-change.component';

import { LottieModule as LottieModules } from 'ngx-lottie';
import player from 'lottie-web';
import { AutoSizeInputModule } from 'ngx-autosize-input';
import { SharedBottomSheetComponent } from './shared/shared-bottom-sheet/shared-bottom-sheet.component';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SharedNoticeDialogComponent } from './shared/shared-notice-dialog/shared-notice-dialog.component';
import { MainViewTagComponent } from './page-parts/main-view-management/main-view-tag/main-view-tag.component';
import { SharedButtonsCancelSaveComponent } from './shared/shared-buttons-cancel-save/shared-buttons-cancel-save.component';
import { GuideBackgroundCoverComponent } from './template/dialog/guide-background-cover/guide-background-cover.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedArtWorkSliderComponent } from './shared/shared-art-work-slider/shared-art-work-slider.component';
import { SharedAccordionBlockComponent } from './shared/shared-accordion-block/shared-accordion-block.component';
import { GuideProfilePictureComponent } from './template/dialog/guide-profile-picture/guide-profile-picture.component';
import { SharedAccordionBlockNoticeComponent } from './shared/shared-accordion-block-notice/shared-accordion-block-notice.component';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { SharedButtonAddBlockSectionComponent } from './shared/shared-button-add-block-section/shared-button-add-block-section.component';
import { SharedButtonRemoveBlockSectionComponent } from './shared/shared-button-remove-block-section/shared-button-remove-block-section.component';
import { BlockSectionDividerComponent } from './shared/block-section-divider/block-section-divider.component';
import { SharedBlockSectionComponent } from './shared/shared-block-section/shared-block-section.component';
import { SharedYearInputLabelComponent } from './shared/shared-year-input-label/shared-year-input-label.component';
import { SharedYearInputComponent } from './shared/shared-year-input/shared-year-input.component';
import { SharedBlockSectionSubtitleComponent } from './shared/shared-block-section/shared-block-section-subtitle/shared-block-section-subtitle.component';
import { GuideArtworkImageUploadComponent } from './template/dialog/guide-artwork-image-upload/guide-artwork-image-upload.component';
import { DialogShareLinkComponent } from './template/dialog/dialog-share-link/dialog-share-link.component';
import {QRCodeModule} from "angularx-qrcode";

/* Lottie Json Animation Player */
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    SharedConfirmButtonComponent,
    SharedLoadingComponent,
    SharedInputComponent,
    SharedHeaderComponent,
    SharedButtonComponent,
    SharedCheckboxComponent,
    SharedConfirmDialogComponent,
    SharedFooterComponent,
    SharedAuthorLinkFormComponent,
    SharedEditorTabsComponent,
    ButtonPreviewComponent,
    SharedGuideComponent,
    SharedTextareaComponent,
    SharedBlockLabelComponent,
    MainViewBackgroundChangeComponent,
    SharedBottomSheetComponent,
    SharedNoticeDialogComponent,
    MainViewTagComponent,
    SharedButtonsCancelSaveComponent,
    GuideBackgroundCoverComponent,
    SharedArtWorkSliderComponent,
    SharedAccordionBlockComponent,
    GuideProfilePictureComponent,
    SharedAccordionBlockNoticeComponent,
    SharedButtonAddBlockSectionComponent,
    SharedButtonRemoveBlockSectionComponent,
    BlockSectionDividerComponent,
    SharedBlockSectionComponent,
    SharedYearInputLabelComponent,
    SharedYearInputComponent,
    SharedBlockSectionSubtitleComponent,
    GuideArtworkImageUploadComponent,
    DialogShareLinkComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,
    MatBottomSheetModule,
    RouterModule,
    MatRippleModule,
    LottieModules.forRoot({ player: playerFactory }),
    AutoSizeInputModule,
    MatListModule,
    MatTooltipModule,
    OverlayscrollbarsModule,
    QRCodeModule,
  ],
  exports: [
    SharedConfirmButtonComponent,
    SharedHeaderComponent,
    SharedInputComponent,
    SharedButtonComponent,
    SharedCheckboxComponent,
    SharedFooterComponent,
    SharedEditorTabsComponent,
    ButtonPreviewComponent,
    SharedAuthorLinkFormComponent,
    SharedBlockLabelComponent,
    SharedTextareaComponent,
    SharedConfirmDialogComponent,
    MainViewBackgroundChangeComponent,
    SharedLoadingComponent,
    MainViewTagComponent,
    SharedButtonsCancelSaveComponent,
    SharedAccordionBlockComponent,
    SharedAccordionBlockNoticeComponent,
    SharedButtonAddBlockSectionComponent,
    SharedButtonRemoveBlockSectionComponent,
    BlockSectionDividerComponent,
    SharedBlockSectionComponent,
    SharedBlockSectionSubtitleComponent,
    SharedArtWorkSliderComponent,
  ],
})
export class ComponentsModule {}
