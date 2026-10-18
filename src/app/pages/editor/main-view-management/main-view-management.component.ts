import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PortfolioMainVisualTag} from '../../../repository/entities/portfolio-main-visual-tag.entity';
import {SharedInputComponent} from '../../../components/shared/shared-input/shared-input.component';
import {Validators} from '@angular/forms';
import {SharedTextareaComponent} from '../../../components/shared/shared-textarea/shared-textarea.component';
import {MatDialog} from '@angular/material/dialog';
import {FeedbackService} from '../../../service/feedback.service';
import {Author} from '../../../repository/entities/author.entity';
import {
  MainViewBackgroundChangeComponent
} from '../../../components/page-parts/main-view-management/main-view-background-change/main-view-background-change.component';
import {StorageService} from '../../../service/storage.service';
import {FileService} from '../../../repository/api/file.service';
import {FileCompressService} from '../../../service/file-compress.service';
import {LoadingService} from '../../../service/loading.service';
import {
  SharedNoticeDialogComponent,
  SharedNoticeDialogData,
} from '../../../components/shared/shared-notice-dialog/shared-notice-dialog.component';
import {
  GuideBackgroundCoverComponent
} from '../../../components/template/dialog/guide-background-cover/guide-background-cover.component';
import {
  SharedConfirmDialogComponent,
  SharedConfirmDialogData,
} from '../../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component';
import {
  MainViewTagComponent
} from '../../../components/page-parts/main-view-management/main-view-tag/main-view-tag.component';
import {
  PortfolioMainVisualSaveInItemDto,
  PortfolioMainVisualService,
} from '../../../repository/api/portfolio-main-visual.service';
import {PortfolioService} from '../../../repository/api/portfolio.service';
import {Portfolio} from '../../../repository/entities/portfolio.entity';
import {PortfolioMainVisual} from '../../../repository/entities/portfolio-main-visual.entity';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view-management.component.html',
  styleUrls: ['./main-view-management.component.scss'],
})
export class MainViewManagementComponent implements OnInit, AfterViewInit {

  loginAuthor?: Author;
  requiredValidator = [Validators.required];
  portfolioMainVisualTags: PortfolioMainVisualTag[] = [];
  disableSaveButton: boolean = false;

  /* Input Components */
  @ViewChild('backgroundChanger') backgroundChanger!: MainViewBackgroundChangeComponent;
  @ViewChild('mainTitleInput') mainTitleInput!: SharedInputComponent;
  @ViewChild('subTitleTextarea') subTitleTextarea!: SharedTextareaComponent;
  @ViewChild('mainViewTags') mainViewTags!: MainViewTagComponent;

  portfolio?: Portfolio;
  portfolioMainVisual?: PortfolioMainVisual;

  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
    private storageService: StorageService,
    private fileService: FileService,
    private fileCompressService: FileCompressService,
    private loadingService: LoadingService,
    private portfolioService: PortfolioService,
    private portfolioMainVisualService: PortfolioMainVisualService,
  ) {
    this.loginAuthor = this.storageService.getAuthor();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mainTitleInput.changeValidator(this.requiredValidator);
      this.subTitleTextarea.changeValidator(this.requiredValidator);
    });

    this.findRecentPortfolioAndMainVisual();
  }

  saveValidator(): boolean {
    return false;
  }

  findRecentPortfolioAndMainVisual(): void {
    if (this.loginAuthor) {
      this.loadingService.loadingStart();

      this.portfolioService
        .createNewPortfolio({authorId: this.loginAuthor?.id})
        .subscribe({
          next: (portfolio: Portfolio) => {
            this.portfolio = portfolio;

            if (this.portfolio?.id) {
              this.portfolioMainVisualService
                .findOne(this.portfolio.id)
                .subscribe({
                  next: (portfolioMainVisual) => {
                    this.loadingService.loadingEnd();
                    this.portfolioMainVisual = portfolioMainVisual;

                    /* 배경커버사진 세팅 */
                    if (this.portfolioMainVisual?.mainVisualUrl) {
                      this.backgroundChanger.setBackgroundSrc(this.portfolioMainVisual.mainVisualUrl);
                    }

                    /* 배경커버사진 */
                    if (this.portfolioMainVisual?.nickName) {
                      this.mainTitleInput.setFormControlValue(this.portfolioMainVisual.nickName);
                    }

                    /* 메인 타이틀 입력 */
                    if (this.portfolioMainVisual?.subTitle) {
                      this.subTitleTextarea.setFormControlValue(this.portfolioMainVisual.subTitle);
                    }

                    if (this.portfolioMainVisual?.portfolioMainVisualTags) {
                      this.portfolioMainVisualTags = this.portfolioMainVisual.portfolioMainVisualTags
                    }

                    this.validateSaveButton();
                  },
                  error: (error) => {
                    console.log('portfolio find error : ', error);
                    this.loadingService.loadingEnd();
                  }
                });
            }
          },
          error: (err) => {
            this.feedbackService.openFeedback('포트폴리오 생성에 실패했습니다.');
            this.loadingService.loadingEnd();
          }
        });
    }
  }

  openGuide(data: any): void {
    const dialogData: SharedNoticeDialogData = {
      innerContent: GuideBackgroundCoverComponent,
    };

    const dialogRef = this.dialog.open(SharedNoticeDialogComponent, {
      data: dialogData,
      panelClass: 'shared-notice-dialog',
    });

    dialogRef.afterClosed().subscribe();
  }

  async coverImageUpload(image: FileList): Promise<void> {
    this.validateSaveButton();
    this.loadingService.loadingStart();

    const file: any = image[0];

    if (!file) return;

    if (!this.loginAuthor?.id) return;

    const compressedFile = await this.fileCompressService.fileCompress(
      image[0],
      {
        maxSizeMb: 1,
        maxWidthOrHeight: 1920,
      }
    );

    const authorId = this.loginAuthor.id;

    /* 압축파일 업로드 */
    this.fileService.saveFile(authorId, compressedFile).subscribe({
      next: (file) => {
        this.loadingService.loadingEnd();
        if (file?.url) {
          this.backgroundChanger.setBackgroundSrc(file?.url);
        }
      },
      error: (error) => {
        console.error('file save error : ', error);
        this.loadingService.loadingEnd();
      },
    });
  }

  addTag(inputValue: any): void {
    if (this.portfolioMainVisualTags.length < 5) {
      this.portfolioMainVisualTags.push(inputValue);
    } else {
      this.feedbackService.openFeedback('태그는 5개까지만 입력할 수 있습니다.');
    }
  }

  deleteTag(tag: PortfolioMainVisualTag): void {
    const tagIndex = this.portfolioMainVisualTags.indexOf(tag);
    this.portfolioMainVisualTags.splice(tagIndex, 1);
  }

  /** @description block 작성 내용 취소시  dialog */
  openCancelConfirm(cancelDialogContent: SharedConfirmDialogData): void {
    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: cancelDialogContent,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef.afterClosed().subscribe({
      next: (action: any) => {
        if (action.action === 'confirm') this.initValue();
      }
    });
  }

  initValue(): void {
    this.backgroundChanger.initBackgroundSrc();
    this.mainTitleInput.formControl.setValue('');
    this.subTitleTextarea.formControl.setValue('');
    this.portfolioMainVisualTags = [];
  }


  validateSaveButton(): void {
    const saveData = this.getSaveData();

    if (!saveData.mainVisualUrl || !saveData.subTitle || !saveData.nickName) {
      this.disableSaveButton = false;
      return;
    }

    const valid: any[] = [
      saveData.mainVisualUrl.length > 0,
      saveData.subTitle.length > 0,
      saveData.nickName.length > 0,
    ];

    let maxLength: number = valid.length;
    let passCount: number = 0;

    valid.forEach(item => {
      if (item) {
        passCount++;
      }
    });

    this.disableSaveButton = maxLength === passCount;
  }

  getSaveData(): PortfolioMainVisualSaveInItemDto {
    const mainVisualUrl = this.backgroundChanger.getBackgroundSrc();
    const nickName = this.mainTitleInput.getFormControlValue();
    const subTitle = this.subTitleTextarea.getFormControlValue();
    const portfolioMainVisualTags =
      this.mainViewTags.getPortfolioMainVisualTags();
    const mainVisualId = this.portfolioMainVisual?.id;
    const portfolioId = this.portfolio?.id;

    return {
      mainVisualId,
      portfolioId,
      name: '포트폴리오',
      mainVisualUrl,
      nickName,
      subTitle,
      portfolioMainVisualTags,
    };
  }

  save(): void {
    const saveData = this.getSaveData();

    this.loadingService.loadingStart();

    this.portfolioMainVisualService
      .saveAndInItem(saveData)
      .subscribe({
        next: (portfolioMainVisual) => {
          this.loadingService.loadingEnd();
          this.portfolioMainVisual = portfolioMainVisual;
          this.feedbackService.openFeedback('저장 되었습니다.');
        },
        error: () => {
          this.loadingService.loadingEnd();
          this.feedbackService.openFeedback('대표화면 저장에 실패했습니다.');
        },
      });

  }

}
