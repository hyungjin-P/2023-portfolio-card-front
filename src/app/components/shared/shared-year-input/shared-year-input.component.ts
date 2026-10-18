import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FormControl, ValidatorFn} from "@angular/forms";
import {InputElementType, SharedInputErrorStateMatcher} from "../shared-input/shared-input.component";

@Component({
  selector: 'shared-year-input',
  templateUrl: './shared-year-input.component.html',
  styleUrls: ['./shared-year-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SharedYearInputComponent implements OnInit {
  /**
   * @description input type
   * @example 'text' | 'readonly' | 'disabled' | 'required' | 'password'
   * */
  @Input() type: InputElementType | string = InputElementType.TEXT;

  /** @description placeholder */
  @Input() customClass: string = '';

  /** @description placeholder */
  @Input() placeholder: string = '내용을 입력해주세요';

  /**
   * @description 에러 체크 패턴, 사용하는 컴포넌트에서 @ViewChild()로 넣을 것
   * @example Validators.required, Validators.email
   * */
  @Input() inputFormValidatorOptions: any[] = [];

  /** @description 필수 체크 메세지 */
  @Input() requiredMessage: string = 'message';

  /** @description 인풋 아래 힌트  */
  @Input() hintMessage: string = '';

  /** @description 커스텀 클래스  */
  @Input() formFieldClass: string = 'full-width';

  @Input() textContent?: any;

  @Input() validators: ValidatorFn[] = [];

  @Input() formControl: FormControl = new FormControl(this.textContent, this.validators);

  matcher = new SharedInputErrorStateMatcher();

  @Output() inputFieldKeyupEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Output() clickAddButtonEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Output() clickRemoveButtonEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Input() maxTextLength: number = 200;

  @Input() nowTextLength: number = 0;

  @Input() inputValue: string = '';

  @ViewChild('sharedYearInput') sharedYearInput!: ElementRef;

  @Input() isFirstInput : boolean = false;

  @Input() index: number = 0;

  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.inputValue !== ''){
      this.setFormControlValue(this.inputValue);
    }
  }

  inputFieldKeyup(event: any): void {
    const sendData = {
      event,
      value: this.formControl.value,
    };

    if (this.formControl?.value?.length > this.maxTextLength) {
      const str: string = this.formControl?.value;
      const sliced = str.slice(0, this.formControl?.value?.length - 1);
      this.formControl.setValue(sliced);
    }

    this.nowTextLength = this.formControl?.value?.length;
    this.inputFieldKeyupEmitter.emit(sendData);
  }

  changeValidator(validatorOption: ValidatorFn[], value?: any): void {
    this.formControl = new FormControl(this.textContent, [
      ...validatorOption
    ]);
    if (value) {
      this.setFormControlValue(value);
    }
  }

  setFormControl(formControl: any): void {
    this.formControl = formControl;
  }

  getFormControlValue(): any {
    return this.formControl.value;
  }

  setFormControlValue(value: any): void {
    this.formControl.setValue(value);
    this.nowTextLength = value.length;
  }

  addFormValidator(validator: ValidatorFn): void {
    this.formControl.addValidators([validator])
  }

  clickAddButton(sharedYearInput : any):void{
    this.clickAddButtonEmitter.emit(sharedYearInput)
  }

  clickRemoveButton(sharedYearInput : any):void{
    this.clickRemoveButtonEmitter.emit(sharedYearInput)
  }

}
