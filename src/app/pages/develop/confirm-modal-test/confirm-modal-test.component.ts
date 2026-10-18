import {Component, OnInit} from '@angular/core';
import {
  MatDialog,
} from '@angular/material/dialog';
import {FeedbackService} from 'src/app/service/feedback.service';
import {
  SharedConfirmDialogComponent,
  SharedConfirmDialogData,
} from '../../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component';
import {
  SharedNoticeDialogComponent, SharedNoticeDialogData
} from "../../../components/shared/shared-notice-dialog/shared-notice-dialog.component";

@Component({
  selector: 'app-confirm-modal-test',
  templateUrl: './confirm-modal-test.component.html',
  styleUrls: ['./confirm-modal-test.component.scss'],
})
export class ConfirmModalTestComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
  ) {
  }

  ngOnInit(): void {
  }

  openConfirmDialog(): void {
    const dialogData: SharedConfirmDialogData = {
      title: '회원가입을 종료하시겠어요?',
      message: '이 페이지를 나가시면 입력하신\n정보가 삭제됩니다',
      confirmButtonText: '종료하기',
      closeButtonText: '아니요'
    };

    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef
      .afterClosed()
      .subscribe((result) => {
        console.log('confirm dialog cancel : ', result);
        if (result?.action === 'confirm') {
          this.feedbackService.openFeedback('확인 클릭');
        } else {
          this.feedbackService.openFeedback('취소 클릭');
        }
      });
  }

  openNoticeDialog(): void {
    const dialogData: SharedNoticeDialogData = {
      title: '버튼 하나뿐인 dialog',
      message: 'guide나 notice에 사용',
      closeButtonText: '알겠어요',

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
