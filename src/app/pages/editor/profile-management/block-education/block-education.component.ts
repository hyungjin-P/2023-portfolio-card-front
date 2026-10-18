import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  SharedConfirmDialogComponent,
  SharedConfirmDialogData
} from "../../../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component";
import {FeedbackService} from "../../../../service/feedback.service";
import {BlockSectionEducationComponent} from "./block-section-education/block-section-education.component";
import { PortfolioHistoryEducationService } from 'src/app/repository/api/portfolio-history-education.service';
import { LoadingService } from 'src/app/service/loading.service';
import { ProfileManagementComponent } from '../profile-management.component';
import { PortfolioHistoryEducation } from 'src/app/repository/entities/portfolio-history-education.entity';

@Component({
  selector: 'app-block-education',
  templateUrl: './block-education.component.html',
  styleUrls: ['./block-education.component.scss']
})
export class BlockEducationComponent implements OnInit {
  @ViewChild('blockSectionEducationComponent') blockSectionEducationComponent!: BlockSectionEducationComponent;

  disableSaveButton: boolean = false;

  educationBlockSections: PortfolioHistoryEducation[] = [];

  portfolioHistoryId?: string;

  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
    private loadingService: LoadingService,
    private educationService: PortfolioHistoryEducationService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if(ProfileManagementComponent.portfolioHistory){
      this.portfolioHistoryId = ProfileManagementComponent.portfolioHistory.id;
      this.getData();
    }
  }

  getData(): void {
    if (this.portfolioHistoryId){
      this.educationService.getEducationData(this.portfolioHistoryId).subscribe({
        next: (data)=> {
          this.educationBlockSections = data;

        },
        error: (error)=> {
          console.error('History Education getData Error : ', error);
        }
      });
    }
  }

  /** @description 경계선 유무 상태 반영 */
  activeDivider(year: any): boolean {
    return this.educationBlockSections.indexOf(year) + 1 !== this.educationBlockSections.length
  }

  removeBlockSection(dialogData: any, blockSection: any): void {
    if (this.educationBlockSections.length > 1) {
      this.openConfirmDialog(dialogData, blockSection);
    }else{
      this.feedbackService.openFeedback('더 이상 삭제할 수 없습니다.')
    }
  }

  /** @description block-section 삭제 시 dialog */
  openConfirmDialog(dialogData: any, blockSection: any): void {
    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef
      .afterClosed()
      .subscribe((result) => {
        if (result?.action === 'confirm') {
          const index = this.educationBlockSections.indexOf(blockSection);
          this.educationBlockSections.splice(index, 1);

          const educationId = blockSection.id;
          if(educationId.length > 5){
            this.educationService.deleteEducation(educationId).subscribe({
              next: ()=>{
                this.feedbackService.openFeedback('선택한 내용이 삭제되었습니다.');
              },
              error: (error)=>{
                console.error('education delete error :: ', error);
              }
            })
          }
        }
      });
  }

  addBlockSection(): void {
    if (this.educationBlockSections.length < 11) {
      const block: PortfolioHistoryEducation = {
        id: `${this.educationBlockSections.length + 1}`,
        subtitles: [{
          subtitle: '',
          values: [{
            value: '',
          }]
        }],
        isError: false,
      }
      this.educationBlockSections.push(block)
    } else {
      this.feedbackService.openFeedback('최대 10개까지만 추가할 수 있습니다.');
    }
  }


  /** @description 취소 버튼 클릭 시 로직 */
  openCancelConfirm(cancelDialogContent: SharedConfirmDialogData): void {
    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: cancelDialogContent,
      panelClass: 'shared-confirm-dialog',
    });
    dialogRef.afterClosed().subscribe({
        next: (action: any) => {
          if (action.action === 'confirm') {
            this.educationBlockSections = [];
            this.getData();
          }
        }
      }
    );
  }

  /** @description block-section value 업데이트 */
  updateEducation(content: any, blockSection: any): void {
    blockSection.subtitles[0].values[0].value = content.value;
  }

  /** @description block-section subtitle 업데이트 */
  updateYear(content: any, blockSection: any): void {
    blockSection.subtitles[0].subtitle = content.value.value;
    blockSection.isError = content.isError;
  }

  save(): void {
    let isError = false;

    this.educationBlockSections.map((block)=>{

      if(block.subtitles){
        if (block.subtitles[0].subtitle === ''){
          console.log('subtitle error : ', block.subtitles[0].subtitle);
          isError = true;
        }

        if (block.subtitles[0].values){
          if (block.subtitles[0].values[0].value === ''){
            console.log('value error : ', block.subtitles[0].values);
            isError = true;
          }
        }

        if (isError){
          this.feedbackService.openFeedback('내용을 입력해주세요.');
          return;
        }

        if(block.subtitles[0].subtitle!.length !== 4){
          isError = true;
          this.feedbackService.openFeedback('연도를 YYYY 형식으로 입력해주세요.');
          return;
        }
      }

      if(block.isError){
        isError = true;
        this.feedbackService.openFeedback('입력창을 확인해주세요.');
        return;
      }
    })

    if(!isError){
      this.loadingService.loadingStart();
      this.educationService.saveEducationData(this.portfolioHistoryId!, this.educationBlockSections).subscribe({
        next: (data)=>{
          this.loadingService.loadingEnd();
          this.educationBlockSections = data;
        },
        error: (error)=>{
          this.loadingService.loadingEnd();
          this.feedbackService.openFeedback('저장에 실패하였습니다. 다시 시도해주세요');
        },
      });
    }
  }
}
