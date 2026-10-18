import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'shared-year-input-label',
  templateUrl: './shared-year-input-label.component.html',
  styleUrls: ['./shared-year-input-label.component.scss']
})
export class SharedYearInputLabelComponent implements OnInit {

  /** @description label */
  @Input() label: string = 'label';

  @Input() guideVisible = false;

  @Input() textLengthVisible = false;

  @Input() maxTextLength: number = 4;

  @Input() nowTextLength: number = 0;

  @Output() labelClick: EventEmitter<any> = new EventEmitter();

  @Output() clickAddYearButtonEmitter: EventEmitter<any> = new EventEmitter();

  @Output() clickRemoveYearButtonEmitter: EventEmitter<any> = new EventEmitter();

  constructor(

  ) { }

  ngOnInit(): void {
  }

  labelClickEvent(): void {
    this.labelClick.emit();
  }

  clickAddYearButton(event: any): void {
    this.clickAddYearButtonEmitter.emit(event);
  }
  clickRemoveYearButton(event: any): void {
    this.clickRemoveYearButtonEmitter.emit(event);
  }

}
