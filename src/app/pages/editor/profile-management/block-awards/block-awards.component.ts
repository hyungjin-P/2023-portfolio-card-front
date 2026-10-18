import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FeedbackService} from "../../../../service/feedback.service";
import {
  SharedConfirmDialogComponent,
  SharedConfirmDialogData
} from "../../../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component";
import {PortfolioHistoryAward} from "../../../../repository/entities/portfolio-history-award.entity";
import {PortfolioHistoryAwardService} from "../../../../repository/api/portfolio-history-award.service";
import {ProfileManagementComponent} from "../profile-management.component";
import {LoadingService} from "../../../../service/loading.service";

@Component({
  selector: 'app-block-awards',
  templateUrl: './block-awards.component.html',
  styleUrls: ['./block-awards.component.scss']
})
export class BlockAwardsComponent implements OnInit {


  disableSaveButton: boolean = false;

  awardsBlockSections: PortfolioHistoryAward[] = [
    {
      id: '1',
      title: '',
      subtitles: [
        {
          id: '1',
          subtitle: '',
          values: [
            {
              id: '1',
              value: '',
            },
          ]
        },
      ],
    }
  ]

  portfolioHistoryId?: string;

  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
    private loadingService: LoadingService,
    private awardService: PortfolioHistoryAwardService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    if(ProfileManagementComponent.portfolioHistory){
      this.portfolioHistoryId = ProfileManagementComponent.portfolioHistory.id;
      this.getData();
    }
  }

  getData(){
   if (this.portfolioHistoryId){
     this.awardService.getAwardData(this.portfolioHistoryId).subscribe({
       next: (data)=>{
         this.awardsBlockSections = data;
       },
       error: (error)=>{
         console.log('History Award getData Error : ', error);
       }
     })
   }
  }

  /** @description 경계선 유무 상태 반영 */
  activeDivider(blockSection: any): boolean {
    return this.awardsBlockSections.indexOf(blockSection) + 1 !== this.awardsBlockSections.length
  }

  /** @description block-section title 업데이트 */
  updateBlockSectionTitle(title: any, blockSection: any ): void {
    blockSection.title = title.value;
  }

  /** @description block-section content 업데이트 */
  updateBlockSection(content: any, blockSection: any ): void {
    blockSection.subtitles = content;
  }

  /** @description block-section 추가 */
  addBlockSection(): void {
    if (this.awardsBlockSections.length < 11) {
      this.awardsBlockSections.push({
        id: `${this.awardsBlockSections.length + 1}`,
        title: '',
        subtitles: [
          {
            id: '1',
            subtitle: '',
            values: [
              {
                id: '1',
                value: '',
              },
            ],
          },
        ]
      })
    } else {
      this.feedbackService.openFeedback('최대 10개까지만 추가할 수 있습니다.');
    }
  }

  /** @description block-section 삭제 */
  removeBlockSection(dialogData: any, blockSection: any): void {
    if (this.awardsBlockSections.length > 1) {
      this.openConfirmDialog(dialogData, blockSection);
    }else{
      this.feedbackService.openFeedback('더 이상 삭제할 수 없습니다.')
    }
  }

  /** @description block-section 삭제 시 확인 dialog */
  openConfirmDialog(dialogData: any, blockSection: any): void {
    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef
      .afterClosed()
      .subscribe((result) => {
        if (result?.action === 'confirm') {
          const index = this.awardsBlockSections.indexOf(blockSection);
          this.awardsBlockSections.splice(index, 1);

          const awardId = blockSection.id;
          if(awardId.length > 5){
            this.awardService.deleteAward(awardId).subscribe({
              next: ()=>{
                this.feedbackService.openFeedback('선택한 내용이 삭제되었습니다.');
              },
              error: (error)=>{
                console.error('award delete error :: ', error);
              }
            })
          }
        }
      });
  }

  /** @description block 작성 내용 취소시  dialog */
  openCancelConfirm(cancelDialogContent: SharedConfirmDialogData): void {
    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: cancelDialogContent,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef.afterClosed().subscribe({
      next: (action: any) => {
        if (action.action === 'confirm') {
          this.awardsBlockSections = [];
          this.getData();
        }
      }
    });
  }

  /** @description block 작성 내용 저장 */
  save(): void {
    const isError = this.checkValidator();

    if(!isError){
      this.loadingService.loadingStart();
      this.awardService.saveAwardData(this.portfolioHistoryId!, this.awardsBlockSections).subscribe({
        next: (data)=>{
          this.loadingService.loadingEnd();
          this.awardsBlockSections = data;
        },
        error: (err) => {
          this.loadingService.loadingEnd();
          this.feedbackService.openFeedback('저장에 실패하였습니다. 다시 시도해주세요');
        },
      })
    }
  }

  checkValidator(): boolean {
    let isError = false;

    this.awardsBlockSections.map((block)=>{
      if(block.subtitles && block.subtitles.length > 0){
        block.subtitles.map((subtitles)=>{
          if(!subtitles.subtitle || subtitles.subtitle.length === 0){
            isError = true;
          }else{
            const subtitleStyle = /[0-9]/;
            if(!subtitleStyle.test(subtitles.subtitle) || subtitles.subtitle.length !== 4){
              isError = true;
            }

            if (subtitles.values && subtitles.values.length > 0){
              subtitles.values.map((values)=>{
                if(!values.value || values.value.length === 0){
                  isError = true;
                }
              })
            } else {
              isError = true;
            }
          }
        })
      }else{
        isError = true;
      }
    })

    if (isError){
      this.feedbackService.openFeedback('입력창을 확인해주세요.');
    }

    return isError;
  }

  removeSubtitle(subtitle: any) {
    const removedSubtitleId = subtitle.id;
    if (removedSubtitleId.length > 5)
      this.awardService.deleteAwardSubtitle(removedSubtitleId).subscribe();
  }

  removeValue(value: any) {
    const removedValueId = value.id;
    if (removedValueId.length > 5)
      this.awardService.deleteAwardValue(removedValueId).subscribe();
  }

}
