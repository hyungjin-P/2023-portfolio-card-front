import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'shared-button-add-block-section',
  templateUrl: './shared-button-add-block-section.component.html',
  styleUrls: ['./shared-button-add-block-section.component.scss']
})
export class SharedButtonAddBlockSectionComponent implements OnInit {
  /** @description button disabled */
  @Input() disabled: boolean = false;

  /** @description button text */
  @Input() buttonText: string = '섹션 추가';

  @Output() clickAddBlockSectionButtonEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  clickAddBlockSectionButton(): void {
    this.clickAddBlockSectionButtonEmitter.emit('AddBlockSectionButton clicked');
  }
}
