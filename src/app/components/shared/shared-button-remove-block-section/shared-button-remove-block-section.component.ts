import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SharedConfirmDialogData} from "../shared-confirm-dialog/shared-confirm-dialog.component";

@Component({
  selector: 'shared-button-remove-block-section',
  templateUrl: './shared-button-remove-block-section.component.html',
  styleUrls: ['./shared-button-remove-block-section.component.scss'],
})
export class SharedButtonRemoveBlockSectionComponent implements OnInit {

  @Output() clickRemoveBlockSectionButtonEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  clickRemoveBlockSectionButton(event: any): void {
    const dialogData: SharedConfirmDialogData = {
      title: '해당 내용을 삭제하시겠어요?',
      message: '',
      confirmButtonText: '삭제',
      closeButtonText: '아니요'
    };

    this.clickRemoveBlockSectionButtonEmitter.emit(dialogData);
  }
}
