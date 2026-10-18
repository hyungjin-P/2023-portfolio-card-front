import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export class SharedNoticeDialogData {
  title?: string;
  message?: string;
  closeButtonText?: string;
  isCheckIcon?: boolean;
  innerContent?: any;
}

@Component({
  selector: 'shared-notice-dialog',
  templateUrl: './shared-notice-dialog.component.html',
  styleUrls: ['./shared-notice-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SharedNoticeDialogComponent implements OnInit {
  /** @description 다이얼로그 내용 */
  @Input() noticeDialogData?: SharedNoticeDialogData;

  /** @description 취소 버튼 클릭 했는지 여부 */
  @Output() selectedClose = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<SharedNoticeDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: SharedNoticeDialogData,
  ) {
    this.noticeDialogData = data;
  }

  ngOnInit(): void {}

  clickClose(): void {
    this.selectedClose.emit();

    this.dialogRef.close({
      action: 'close',
    });
  }
}
