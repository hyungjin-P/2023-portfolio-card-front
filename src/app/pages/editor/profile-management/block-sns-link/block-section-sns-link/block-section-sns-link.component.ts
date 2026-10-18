import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SharedInputComponent} from "../../../../../components/shared/shared-input/shared-input.component";
import {Validators} from "@angular/forms";

@Component({
  selector: 'block-section-sns-link',
  templateUrl: './block-section-sns-link.component.html',
  styleUrls: ['./block-section-sns-link.component.scss']
})
export class BlockSectionSnsLinkComponent implements OnInit, AfterViewInit{
  @ViewChild('linkInput') linkInput!: SharedInputComponent;
  @ViewChild('linkTitleInput') linkTitleInput!: SharedInputComponent;

  @Input() isDividerActive: boolean = false;

  @Output() clickRemoveBlockSectionButtonEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateLinkInputEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateLinkTitleInputEmitter: EventEmitter<any> = new EventEmitter<any>();

  requiredValidator = [Validators.required];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.linkInput.changeValidator(this.requiredValidator);
      this.linkTitleInput.changeValidator(this.requiredValidator);
    });
  }

  clickRemoveBlockSectionButton(event: any): void {
    this.clickRemoveBlockSectionButtonEmitter.emit(event);
  }

  /** @description 타이틀 업데이트 */
  updateLink(content: any): void {
    this.updateLinkInputEmitter.emit(content);
  }

  /** @description block-section-year 연도 업데이트 */
  updateLinkTitle(content: any): void {
    this.updateLinkTitleInputEmitter.emit(content)
  }

  /** @description input value 초기화 */
  initValue(): void {
    this.linkInput.formControl.setValue('');
    this.linkTitleInput.formControl.setValue('');
  }

}
