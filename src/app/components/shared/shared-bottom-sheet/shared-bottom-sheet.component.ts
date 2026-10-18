import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SharedConfirmDialogData } from '../shared-confirm-dialog/shared-confirm-dialog.component';
import { BottomSheetOptions } from '../../../service/bottom-sheet.service';

export enum BottomSheetControl {
  SAVE = 'save',
  MODIFY = 'modify',
  VISIBLE = 'visible',
  NON_VISIBLE = 'non-visible',
  CANCEL = 'cancel',
  DELETE = 'delete',
  UNSELECTED = 'unselected',
  OPEN = 'open',
}

class BottomSheetButtons {
  iconImage?: string;
  title?: string;
  subtitle?: string;
  suffix?: string;
  isSubtitle?: boolean;
  isSuffix?: boolean;
  isActive?: boolean;
  type?: BottomSheetControl;
}

@Component({
  selector: 'app-shared-bottom-sheet',
  templateUrl: './shared-bottom-sheet.component.html',
  styleUrls: ['./shared-bottom-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SharedBottomSheetComponent implements OnInit, AfterViewInit {
  /**
   * @description BottomSheetService의 open()으로 제어
   * @Todo 각 Save/Modify, visible/non-visible, Delete 등의 기능을 ON/OFF 및 상태제어 할 수 있는 옵션이 필요함.
   * */

  bottomSheetControl = BottomSheetControl;

  @Output() bottomSheetOptionClicked = new EventEmitter<BottomSheetControl>();

  bottomSheetOptions: BottomSheetOptions;

  bottomSheetButtons: BottomSheetButtons[] = [
    {
      iconImage: '/assets/icons/crackit/pencil.svg',
      title: '블록 제목 수정',
      subtitle: '해당 블록의 타이틀 제목을 본인이 직접 관리할 수 있어요.',
      suffix: '',
      isSubtitle: true,
      isSuffix: false,
      isActive: false,
      type: BottomSheetControl.MODIFY,
    },
    {
      iconImage: '/assets/icons/crackit/pencil.svg',
      title: '블록 제목 저장',
      subtitle: '저장',
      suffix: '',
      isSubtitle: true,
      isSuffix: false,
      isActive: false,
      type: BottomSheetControl.SAVE,
    },
    {
      iconImage: '/assets/icons/crackit/eye-on.svg',
      title: '공개',
      subtitle: '',
      suffix: '(해당 블록 공개)',
      isSubtitle: false,
      isSuffix: true,
      isActive: false,
      type: BottomSheetControl.NON_VISIBLE,
    },
    {
      iconImage: '/assets/icons/crackit/eye-off.svg',
      title: '비공개',
      subtitle: '',
      suffix: '(해당 블록 비공개)',
      isSubtitle: false,
      isSuffix: true,
      isActive: false,
      type: BottomSheetControl.VISIBLE,
    },
    {
      iconImage: '/assets/icons/crackit/trash.svg',
      title: '삭제',
      subtitle: '',
      suffix: '(해당 블록 삭제)',
      isSubtitle: false,
      isSuffix: true,
      isActive: false,
      type: BottomSheetControl.DELETE,
    },
  ];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetOptions>,
    @Inject(MAT_BOTTOM_SHEET_DATA) bottomSheetOptions: BottomSheetOptions,
  ) {
    this.bottomSheetRef.backdropClick().subscribe({
      next: () => {
        this.bottomSheetClose();
      },
    });
    this.bottomSheetOptions = bottomSheetOptions;
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.updateBottomSheetButtons();
  }

  chooseControl(bottomSheetControl?: BottomSheetControl): void {
    /* 요기 참조 */
    this.bottomSheetRef.dismiss({
      bottomSheetControl,
      bottomSheetOptions: this.bottomSheetOptions,
    });
  }

  bottomSheetClose(): void {
    /* 요기 참조 */
    this.bottomSheetRef.dismiss({
      bottomSheetControl: BottomSheetControl.CANCEL,
      bottomSheetOptions: this.bottomSheetOptions,
    });
  }

  /** @description 버튼 상태 업데이트 */
  updateBottomSheetButtons(): void {
    this.bottomSheetButtons.forEach((button) => {
      if (button.type === BottomSheetControl.DELETE)
        button.isActive = this.bottomSheetOptions.activeDeleteButton;
      if (button.type === this.bottomSheetOptions.saveType)
        button.isActive = this.bottomSheetOptions.activeSaveButton;
      if (button.type === this.bottomSheetOptions.visibleType)
        button.isActive = this.bottomSheetOptions.activeVisibleButton;
    });
  }
}
