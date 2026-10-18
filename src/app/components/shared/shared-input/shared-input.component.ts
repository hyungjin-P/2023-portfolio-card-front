import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, ValidatorFn} from '@angular/forms';

export enum InputElementType {
  TEXT = 'text',
  NUMBER = 'number',
  TEL = 'tel',
  READONLY = 'readonly',
  DISABLED = 'disabled',
  REQUIRED = 'required',
  PASSWORD = 'password',
}

export class SharedInputErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'shared-input',
  templateUrl: './shared-input.component.html',
  styleUrls: ['./shared-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SharedInputComponent implements OnInit {

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

  /** @description 이메일 경고 메세지  */
  @Input() emailMessage: string = '';

  /** @description 커스텀 클래스  */
  @Input() formFieldClass: string = 'full-width';

  @Input() eyeIcon = false;

  eyeOpened = false;

  @Output() isEyeOpened: EventEmitter<any> = new EventEmitter<any>();

  @Input() textContent?: any;

  @Input() validators: ValidatorFn[] = [];

  @Input() formControl: FormControl = new FormControl(this.textContent, this.validators);

  matcher = new SharedInputErrorStateMatcher();

  @Output() inputFieldKeyupEmitter: EventEmitter<any> = new EventEmitter<any>();

  /** @description label */
  @Input() label: string = 'label';

  @Input() guideVisible = false;

  @Input() textLengthVisible = false;

  @Input() maxTextLength: number = 200;

  @Input() nowTextLength: number = 0;

  @Input() inputValue: string = '';

  @Input() isYearLabel = false;

  @ViewChild('sharedInput') sharedInput!: ElementRef;

  @Output() clickAddYearButtonEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickRemoveYearButtonEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
  ) {
  }

  ngAfterViewInit(): void {
    if(this.textContent && this.textContent.length > 0){
      this.setFormControlValue(this.textContent);
    }
  }

  ngOnInit(): void {
  }

  inputFieldKeyup(): void {
    const sendData = {
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

  toggleEyeOpened(): void {
    this.eyeOpened = !this.eyeOpened;

    this.isEyeOpened.emit({
      eyeOpened: this.eyeOpened
    });
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

  getInput(data: any): void {
    data?.focus();
  }

  clickAddYearButton(event: any): void {
    this.clickAddYearButtonEmitter.emit(event)
  }

  clickRemoveYearButton(event: any): void {
    this.clickRemoveYearButtonEmitter.emit(event)
  }

  ngAfterContentInit(): void {
  }

}
