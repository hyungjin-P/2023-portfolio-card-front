import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'shared-block-label',
  templateUrl: './shared-block-label.component.html',
  styleUrls: ['./shared-block-label.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SharedBlockLabelComponent implements OnInit {

  /** @description label */
  @Input() label: string = 'label';

  @Input() guideVisible = false;

  @Input() textLengthVisible = false;

  @Input() maxTextLength: number = 200;

  @Input() nowTextLength: number = 0;

  @Output() labelClick: EventEmitter<any> = new EventEmitter();

  @Output() guideClick: EventEmitter<any> = new EventEmitter();

  constructor(

  ) { }

  ngOnInit(): void {
  }

  labelClickEvent(): void {
    this.labelClick.emit();
  }

  guideClickEvent(): void {
    this.guideClick.emit();
  }




}
