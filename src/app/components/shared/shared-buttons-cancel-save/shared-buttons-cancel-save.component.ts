import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SharedConfirmDialogData} from "../shared-confirm-dialog/shared-confirm-dialog.component";

@Component({
  selector: 'shared-buttons-cancel-save',
  templateUrl: './shared-buttons-cancel-save.component.html',
  styleUrls: ['./shared-buttons-cancel-save.component.scss']
})
export class SharedButtonsCancelSaveComponent implements OnInit {

  @Input() disableSaveButton: boolean = true;
  @Output() clickCancelEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickSaveEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  emitClickCancel(): void {
    const cancelDialogContent: SharedConfirmDialogData = {
      title: '작성중인 내용이 삭제됩니다.\n' + '닫으시겠습니까?',
      confirmButtonText: '닫기',
      closeButtonText: '아니요',
    };
    this.clickCancelEmitter.emit(cancelDialogContent);
  }
  emitClickSave(event: any): void {
    this.clickSaveEmitter.emit(event);
  }
}
