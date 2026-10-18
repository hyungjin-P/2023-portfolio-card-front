import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, ValidatorFn} from '@angular/forms';
import {ErrorStateMatcher} from "@angular/material/core";

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
  selector: 'shared-textarea',
  templateUrl: './shared-textarea.component.html',
  styleUrls: ['./shared-textarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SharedTextareaComponent implements OnInit {

  /** @description customClass input */
  @Input() customClass: string = '';

  /** @description customClass form field */
  @Input() formFieldClass: string = 'full-width';

  /** @description placeholder */
  @Input() placeholder: string = '내용을 입력해주세요';

  @Input() validators: ValidatorFn[] = [];

  @Input() textContent?: any;

  @Input() formControl: FormControl = new FormControl(this.textContent, this.validators);

  @Input() rows = 4;

  matcher = new SharedInputErrorStateMatcher();

  @Output() inputFieldKeyupEmitter: EventEmitter<any> = new EventEmitter<any>();


  /** @description 인풋 아래 힌트  */
  @Input() hintMessage: string = '';

  /** @description 필수 체크 메세지 */
  @Input() requiredMessage: string = 'message';

  /** @description label */
  @Input() label: string = 'label';

  @Input() guideVisible = false;

  @Input() textLengthVisible = false;

  @Input() maxTextLength: number = 200;

  @Input() nowTextLength: number = 0;

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit(): void{
    if(this.textContent && this.textContent.length > 0){
      this.setFormControlValue(this.textContent);
    }
  }

  inputFieldKeyup(event: any): void {
    const sendData = {
      event,
      value: this.formControl.value,
    };
    this.nowTextLength = this.formControl.value.length;
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

  getTextarea(data: any): void {
    data?.focus();
  }

}
