import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  SharedNoticeDialogComponent,
  SharedNoticeDialogData
} from "../../../../components/shared/shared-notice-dialog/shared-notice-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {
  GuideProfilePictureComponent
} from "../../../../components/template/dialog/guide-profile-picture/guide-profile-picture.component";
import {
  SharedConfirmDialogComponent,
  SharedConfirmDialogData
} from "../../../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component";
import {FileService} from "../../../../repository/api/file.service";
import {FileCompressService} from "../../../../service/file-compress.service";
import {Author} from "../../../../repository/entities/author.entity";
import {
  DefaultInformationProfileChangeComponent
} from "./default-information-profile-change/default-information-profile-change.component";
import {StorageService} from "../../../../service/storage.service";
import {SharedInputComponent} from "../../../../components/shared/shared-input/shared-input.component";
import {Validators} from "@angular/forms";
import {LoadingService} from "../../../../service/loading.service";
import {PortfolioHistoryGeneralService} from "../../../../repository/api/portfolio-history-general.service";
import {ProfileManagementComponent} from "../profile-management.component";
import {PortfolioHistoryGeneral} from "../../../../repository/entities/portfolio-history-general.entity";
import {FeedbackService} from "../../../../service/feedback.service";

@Component({
  selector: 'app-block-default-information',
  templateUrl: './block-default-information.component.html',
  styleUrls: ['./block-default-information.component.scss']
})
export class BlockDefaultInformationComponent implements OnInit, AfterViewInit {
  @ViewChild('profileChanger') profileChanger!: DefaultInformationProfileChangeComponent;
  @ViewChild('profileNameInput') profileNameInput!: SharedInputComponent;

  disableSaveButton: boolean = false;
  loginAuthor?: Author;
  requiredValidator = [Validators.required];

  portfolioHistoryGeneral?: PortfolioHistoryGeneral;
  portfolioHistoryId?: string;
  data: any;

  constructor(
    public dialog: MatDialog,
    private fileService: FileService,
    private fileCompressService: FileCompressService,
    private storageService: StorageService,
    private loadingService: LoadingService,
    private feedbackService: FeedbackService,
    private portfolioHistoryGeneralService: PortfolioHistoryGeneralService,

  ) {
    this.loginAuthor = this.storageService.getAuthor();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (ProfileManagementComponent.portfolioHistory){
      this.portfolioHistoryId = ProfileManagementComponent.portfolioHistory.id;
      this.getData();
    }

    setTimeout(() => {
      this.profileNameInput.changeValidator(this.requiredValidator);
    });
  }

  getData(){
    this.loadingService.loadingStart();
    this.portfolioHistoryGeneralService.create(this.portfolioHistoryId!).subscribe({
      next: (general)=>{
        this.loadingService.loadingEnd();
        this.portfolioHistoryGeneral = general;

        if(general.nickname) this.profileNameInput.setFormControlValue(general.nickname);
        if(general.generalImageUrl) this.profileChanger.setGeneralImageUrl(general.generalImageUrl);
      },
      error: ()=>{
        console.log('create fail');
        this.loadingService.loadingEnd();
      },
    });
  }

  openGuide(data: any): void {
    console.log('data', data)
    const dialogData: SharedNoticeDialogData = {
      innerContent: GuideProfilePictureComponent,
    };

    const dialogRef = this.dialog.open(SharedNoticeDialogComponent, {
      data: dialogData,
      panelClass: 'shared-notice-dialog',
    });

    dialogRef.afterClosed().subscribe();
  }

  /** @description 취소 버튼 클릭 시 로직 */
  openCancelConfirm(cancelDialogContent: SharedConfirmDialogData): void {
    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: cancelDialogContent,
      panelClass: 'shared-confirm-dialog',
    });
    dialogRef.afterClosed().subscribe({
        next: (action: any) => {
          if (action?.action === 'confirm') {
            this.profileChanger.initValue();
            this.profileNameInput.formControl.setValue('');
            this.getData();
          }
        }
      }
    );
  }

  getSaveData(): any {
    const nickName = this.profileNameInput.getFormControlValue();
    const imageUrl = this.profileChanger.getGeneralImageUrl();

    return {
      nickName,
      imageUrl,
    };
  }

  save(): void {
    const getData = this.getSaveData();

    const saveData: PortfolioHistoryGeneral = {
      id: this.portfolioHistoryGeneral?.id,
      portfolioHistoryId: this.portfolioHistoryGeneral?.portfolioHistoryId,
      nickname: getData.nickName,
      generalImageUrl: getData.imageUrl,
    }

    this.loadingService.loadingStart();

    this.portfolioHistoryGeneralService
      .save(saveData)
      .subscribe({
        next: (portfolioHistoryGeneral) => {
          this.loadingService.loadingEnd();
          this.portfolioHistoryGeneral = portfolioHistoryGeneral;
          this.feedbackService.openFeedback('저장 되었습니다.')
        },
        error: () => {
          this.loadingService.loadingEnd();
          this.feedbackService.openFeedback('기본 정보 저장에 실패했습니다.');
        },
      });

  }


  async coverImageUpload(image: FileList): Promise<void> {
    this.loadingService.loadingStart();

    const file: any = image[0];

    if (!file) return;

    if (!this.loginAuthor?.id) return;

    const compressedFile = await this.fileCompressService.fileCompress(
      image[0],
    );

    const authorId = this.loginAuthor.id;

    /* 압축파일 업로드 */
    this.fileService.saveFile(authorId, compressedFile).subscribe({
      next: (file) => {

        this.loadingService.loadingEnd();
        if (file?.url) {
          this.profileChanger.setGeneralImageUrl(file?.url);
        }
      },
      error: (error) => {
        console.error('file save error : ', error);
        this.loadingService.loadingEnd();
      },
    });
  }
}
