import {
  Component, EventEmitter,
  Inject,
  Input,
  OnInit, Output,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export class SharedConfirmDialogData {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  closeButtonText?: string;
}

@Component({
  selector: 'shared-confirm-dialog',
  templateUrl: './shared-confirm-dialog.component.html',
  styleUrls: ['./shared-confirm-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SharedConfirmDialogComponent implements OnInit {
  /** @description 다이얼로그 내용 */
  @Input() confirmDialogData?: SharedConfirmDialogData;

  /** @description 취소 버튼 클릭 했는지 여부 */
  @Output() selectedCancel = new EventEmitter<any>();

  /** @description 확인 버튼 클릭 했는지 여부 */
  @Output() selectedConfirm = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<SharedConfirmDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: SharedConfirmDialogData,
  ) {
    this.confirmDialogData = data;
  }

  ngOnInit(): void {}

  cancel(): void {
    this.selectedCancel.emit();
    this.dialogRef.close({
      action: 'close',
    });
  }

  confirm(): void {
    this.selectedConfirm.emit();
    this.dialogRef.close({
      action: 'confirm'
    });
  }
}
