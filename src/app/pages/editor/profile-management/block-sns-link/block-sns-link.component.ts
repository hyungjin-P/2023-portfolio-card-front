import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  SharedConfirmDialogComponent,
  SharedConfirmDialogData
} from "../../../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component";
import {FeedbackService} from "../../../../service/feedback.service";
import {BlockSectionSnsLinkComponent} from "./block-section-sns-link/block-section-sns-link.component";

@Component({
  selector: 'app-block-sns-link',
  templateUrl: './block-sns-link.component.html',
  styleUrls: ['./block-sns-link.component.scss']
})
export class BlockSnsLinkComponent implements OnInit {

  @ViewChild('blockSectionSnsLinkComponent') blockSectionSnsLinkComponent!: BlockSectionSnsLinkComponent;

  disableSaveButton: boolean = false;

  snsLinkBlockSections: any[] = [
    {
      id: '1',
      sns_title: '',
      sns_url: '',
    }
  ]

  initValue: any[] = [
    {
      id: '1',
      sns_title: '',
      sns_url: '',
    }
  ]


  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  /** @description 경계선 유무 상태 반영 */
  activeDivider(blockSection: any): boolean {
    return this.snsLinkBlockSections.indexOf(blockSection) + 1 !== this.snsLinkBlockSections.length
  }

  removeBlockSection(dialogData: any, blockSection: any): void {
    if (this.snsLinkBlockSections.length > 1) {
      this.openConfirmDialog(dialogData, blockSection);
    }
  }

  addBlockSection(): void {
    if (this.snsLinkBlockSections.length < 11) {
      this.snsLinkBlockSections.push({id: `${this.snsLinkBlockSections.length + 1}`})
    } else {
      this.feedbackService.openFeedback('최대 10개까지만 추가할 수 있습니다.');
    }
  }

  openConfirmDialog(dialogData: any, blockSection: any): void {
    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef
      .afterClosed()
      .subscribe((result) => {
        if (result?.action === 'confirm') {
          const index = this.snsLinkBlockSections.indexOf(blockSection);
          this.snsLinkBlockSections.splice(index, 1);
          this.feedbackService.openFeedback('선택한 내용이 삭제되었습니다.');
        }
      });
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
          this.snsLinkBlockSections = [...this.initValue]
          this.blockSectionSnsLinkComponent.initValue();
        }
      }
    });
  }

  /** @description block-section Link 업데이트 */
  updateLink(content: any, blockSection: any): void {
    blockSection.sns_url = content.value;
  }

  /** @description block-section LinkTitle 업데이트 */
  updateLinkTitle(content: any, blockSection: any): void {
    blockSection.sns_title = content.value;
  }

  save(): void {
    console.log('this.snsLinkBlockSections', this.snsLinkBlockSections)
  }
}
