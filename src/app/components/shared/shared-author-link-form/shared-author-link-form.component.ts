import {
  Component, ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output, ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { SharedInputErrorStateMatcher } from '../shared-input/shared-input.component';

export class SharedAuthorLinkFormErrorStateMatcher implements ErrorStateMatcher {
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
  selector: 'shared-author-link-form',
  templateUrl: './shared-author-link-form.component.html',
  styleUrls: ['./shared-author-link-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SharedAuthorLinkFormComponent implements OnInit {
  /**
   * @description 에러 체크 패턴, 사용하는 컴포넌트에서 @ViewChild()로 넣을 것
   * @example Validators.required, Validators.email
   * */
  @Input() inputFormValidatorOptions: any[] = [];

  /** @description 필수 체크 메세지 */
  @Input() requiredMessage: string = '아이디를 입력해주세요.';

  /** @description 인풋 아래 힌트  */
  @Input() hintMessage: string = '';

  @Input() placeholderMessage: string = 'link';

  @Input() labelText: string = '아이디를 입력해주세요.';

  @Input() prefixLabel: string = 'crackit-universe.com/';

  @Input() textContent?: string = '';

  regExp = /^[a-zA-Z0-9_-]*$/;

  formControl: FormControl = new FormControl(this.textContent, [
    Validators.required,
    Validators.min(6),
    Validators.pattern(this.regExp),
  ]);

  matcher = new SharedInputErrorStateMatcher();

  @Output() inputFieldKeyupEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Output() suffixButtonClick: EventEmitter<any> =
    new EventEmitter<any>();

  @ViewChild('sharedInput') sharedInput!: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  inputFieldKeyup(event: any): void {
    this.inputFieldKeyupEmitter.emit(event);
  }

  suffixButtonClickEvent(event: any): void {
    this.suffixButtonClick.emit(event);
  }

  getFormControlValue(): any {
    return this.formControl.value;
  }

  setFormControlValue(value: any): void {
    this.formControl.setValue(value);
  }
}
