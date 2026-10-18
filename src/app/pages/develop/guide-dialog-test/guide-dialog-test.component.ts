import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  SharedConfirmDialogComponent,
  SharedConfirmDialogData
} from "../../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FeedbackService} from "../../../service/feedback.service";

@Component({
  selector: 'app-guide-dialog-test',
  templateUrl: './guide-dialog-test.component.html',
  styleUrls: ['./guide-dialog-test.component.scss']
})
export class GuideDialogTestComponent implements OnInit {
  private nativeElement: any;

  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
  ) {
  }

  @ViewChild('backgroundInput') backgroundInput!: GuideDialogTestComponent

  /**
   * @description 이미 등록된 사진이 있으면 버튼이 배경 바꾸기 버튼으로 바뀜
   */
  isUploaded: boolean = false;


  ngOnInit(): void {
  }

  openConfirmDialog(data: any): void {
    console.log(data)
    const dialogData: SharedConfirmDialogData = {
      title: data.title,
      message: data.content,
      confirmButtonText: '',
      closeButtonText: '닫기'
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

  imageSrc: string = '';

  /**
   * @description 사진 입력 감지 -- 테스트용
   */
  onChange(event: any): void {
    // if (!event) return;
    const file = event.target.files[0];
    console.log('file', file)
    const url = URL.createObjectURL(file)
    console.log('url', url);
  }


}
