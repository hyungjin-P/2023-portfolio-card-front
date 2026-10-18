import {Component, OnInit} from '@angular/core';
import {BottomSheetControl,} from '../../../components/shared/shared-bottom-sheet/shared-bottom-sheet.component';
import {BottomSheetOptions, BottomSheetService} from '../../../service/bottom-sheet.service';

@Component({
  selector: 'app-bottom-sheet-tes',
  templateUrl: './bottom-sheet-tes.component.html',
  styleUrls: ['./bottom-sheet-tes.component.scss']
})
export class BottomSheetTesComponent implements OnInit {

  constructor(
    private bottomSheetService: BottomSheetService,
  ) {
    this.bottomSheetService.bottomSheetObservable().subscribe({
      next: (result: any) => {
        console.log('selected bottom sheet control : ', result);
        this.toggleBottomSheetOptions(result);
      }
    });
  }

  bottomSheetOptions: BottomSheetOptions = {
    activeSaveButton: true,
    activeVisibleButton: true,
    activeDeleteButton: true,
    saveType: BottomSheetControl.SAVE,
    visibleType: BottomSheetControl.NON_VISIBLE,
  }

  ngOnInit(): void {
  }

  openBottomSheet(chooseBottomSheetName: string): void {
    const bottomSheetOptions: BottomSheetOptions = {
      data: chooseBottomSheetName,
      ...this.bottomSheetOptions
    };

    this.bottomSheetService.open(bottomSheetOptions);
  }

  toggleBottomSheetOptions(bottomSheetControl: BottomSheetControl): void {
    if (bottomSheetControl === BottomSheetControl.SAVE)
      this.bottomSheetOptions.saveType = BottomSheetControl.MODIFY
    if (bottomSheetControl === BottomSheetControl.VISIBLE)
      this.bottomSheetOptions.visibleType = BottomSheetControl.NON_VISIBLE
    if (bottomSheetControl === BottomSheetControl.NON_VISIBLE)
      this.bottomSheetOptions.visibleType = BottomSheetControl.VISIBLE
  }

}
