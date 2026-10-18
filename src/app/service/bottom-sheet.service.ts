import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  BottomSheetControl,
  SharedBottomSheetComponent,
} from '../components/shared/shared-bottom-sheet/shared-bottom-sheet.component';

export class BottomSheetOptions {
  activeSaveButton?: boolean = false;
  activeVisibleButton?: boolean = false;
  activeDeleteButton?: boolean = false;
  saveType?: BottomSheetControl.SAVE | BottomSheetControl.MODIFY;
  visibleType?: BottomSheetControl.VISIBLE | BottomSheetControl.NON_VISIBLE;
  data?: any = {};
}

export class sendBottomSheet{
  bottomSheetControl?: BottomSheetControl;
  bottomSheetOptions?: BottomSheetOptions;
}

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {

  bottomSheetSubject: Subject<sendBottomSheet> = new Subject();

  bottomSheetControl: BottomSheetControl = BottomSheetControl.UNSELECTED;

  constructor(private bottomSheet: MatBottomSheet) {}

  open(options: BottomSheetOptions): void {

    const bottomSheetRef = this.bottomSheet.open(SharedBottomSheetComponent, {
      disableClose: true,
      data: {
        ...options
      }
    });

    bottomSheetRef.afterOpened().subscribe({
      next: () => {
        /* 요기 */
        const result: any = {
          bottomSheetControl : BottomSheetControl.OPEN,
          bottomSheetOptions : options
        };

        this.sendBottomSheetControls(result);
      },
    });

    bottomSheetRef.afterDismissed().subscribe({
      next: (selectedControl: BottomSheetControl) => {
        console.log('selectedControl', selectedControl)
        this.sendBottomSheetControls(selectedControl);
        this.resetBottomSheetControl();
      },
    });
  }

  resetBottomSheetControl(): void {
    this.bottomSheetControl = BottomSheetControl.UNSELECTED;
  }

  bottomSheetObservable(): Observable<sendBottomSheet> {
    return this.bottomSheetSubject.asObservable();
  }

  sendBottomSheetControls(bottomSheetControl: any): void {
    this.bottomSheetSubject.next(bottomSheetControl);
  }
}
