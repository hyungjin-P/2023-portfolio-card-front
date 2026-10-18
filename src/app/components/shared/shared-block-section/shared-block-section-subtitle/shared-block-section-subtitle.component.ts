import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SharedInputComponent} from "../../shared-input/shared-input.component";
import {FeedbackService} from "../../../../service/feedback.service";
import {Validators} from "@angular/forms";

@Component({
  selector: 'shared-block-section-subtitle',
  templateUrl: './shared-block-section-subtitle.component.html',
  styleUrls: ['./shared-block-section-subtitle.component.scss']
})
export class SharedBlockSectionSubtitleComponent implements OnInit, AfterViewInit {

  @ViewChild('subtitleInput') subtitleInput!: SharedInputComponent;

  @Input() subtitle: string = '';
  @Input() values: any[] | undefined = [
    {
      id: '1',
      value: '',
    }
  ];
  @Input() isLineActive: boolean = false;
  @Input() isSubtitleLabel: boolean = true;
  @Input() subtitlePlaceholder: string = '';
  @Input() valuePlaceholder: string = '';


  @Output() clickAddValueButtonEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickRemoveValueButtonEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickAddSubtitleButtonEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickRemoveSubtitleButtonEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateValueEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateSubtitleEmitter: EventEmitter<any> = new EventEmitter<any>();

  yearValidator = [
    Validators.required,
    Validators.maxLength(4),
    Validators.pattern('^[0-9-]*$'),
  ];

  valueValidator = [Validators.required];

  constructor(
    private feedbackService: FeedbackService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.values?.length === 0){
      this.values = this.values as any[];

      let value = {
        id: '1',
        value: '',
      }

      this.values.push(value)
    }

    if (this.subtitle !== ''){
      this.subtitleInput.setFormControlValue(this.subtitle);
    }else{
      setTimeout(() => {
        this.subtitleInput.changeValidator(this.yearValidator);
      });
    }
  }

  /** @description 연도 추가 이벤트 방출 */
  addYear(event: any): void {
    this.clickAddSubtitleButtonEmitter.emit(event)
  }

  /** @description 연도 삭제 이벤트 방출 */
  removeYear(event: any): void {
    this.clickRemoveSubtitleButtonEmitter.emit(event)
  }

  /** @description 연도의 내용 추가 */
  addYearContent(sharedYearInput: any): void {
    if (sharedYearInput.value) {
      this.values = this.values as any[];

      let values = {
        id: this.values.length + 1,
        value: '',
      }
      this.values = [...this.values, values];
      this.clickAddValueButtonEmitter.emit(this.values);
    } else {
      this.feedbackService.openFeedback('내용을 입력해주세요');
    }
  }

  /** @description 연도의 내용 삭제 */
  removeValue(value: any): void {
    this.values = this.values as any[];

    const tagIndex = this.values.indexOf(value);
    this.values.splice(tagIndex, 1);

    this.clickRemoveValueButtonEmitter.emit(value)
  }

  /** @description 연도 입력한 값 업데이트  */
  updateSubtitleInput(yearInput: any): void {
    this.updateSubtitleEmitter.emit(yearInput.value)
  }

  /** @description 연도별 내용 입력한 값 업데이트  */
  updateValueInput(event: any, content: any): void {
    content.value = event.value;
    this.updateValueEmitter.emit(this.values)
  }
}
