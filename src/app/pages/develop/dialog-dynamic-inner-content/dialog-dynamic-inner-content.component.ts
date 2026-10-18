import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackService } from '../../../service/feedback.service';
import {
  SharedNoticeDialogComponent,
  SharedNoticeDialogData,
} from '../../../components/shared/shared-notice-dialog/shared-notice-dialog.component';
import { DynamicDialogTemplateComponent } from '../dynamic-dialog-template/dynamic-dialog-template.component';

@Component({
  selector: 'app-dialog-dynamic-inner-content',
  templateUrl: './dialog-dynamic-inner-content.component.html',
  styleUrls: ['./dialog-dynamic-inner-content.component.scss']
})
export class DialogDynamicInnerContentComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
  ) { }

  ngOnInit(): void {
  }

  openNoticeDialog(): void {
    const dialogData: SharedNoticeDialogData = {
      title: '컴포넌트 내용 바꾸기릿',
      closeButtonText: '알겠어요',
      innerContent: DynamicDialogTemplateComponent,
    };

    const dialogRef = this.dialog.open(SharedNoticeDialogComponent, {
      data: dialogData,
      panelClass: 'shared-notice-dialog',
    });

    dialogRef
      .afterClosed()
      .subscribe((result) => {
        this.feedbackService.openFeedback('취소 클릭');
      });
  }

}
