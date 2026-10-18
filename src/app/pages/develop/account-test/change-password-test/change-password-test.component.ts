import {Component, OnInit, ViewChild} from '@angular/core';
import {
  InputElementType,
  SharedInputComponent
} from "../../../../components/shared/shared-input/shared-input.component";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-change-password-test',
  templateUrl: './change-password-test.component.html',
  styleUrls: ['./change-password-test.component.scss']
})
export class ChangePasswordTestComponent implements OnInit {
  @ViewChild('originalPasswordField') originalPasswordField! : SharedInputComponent
  @ViewChild('changePasswordField') changePasswordField! : SharedInputComponent
  @ViewChild('changePasswordConfirmField') changePasswordConfirmField! : SharedInputComponent

  passwordType = 'password';
  requiredValidator = [Validators.required];

  passwordTypeToggle(passwordField : any) {
    passwordField.type === InputElementType.PASSWORD
      ? (passwordField.type = InputElementType.TEXT)
      : (passwordField.type = InputElementType.PASSWORD);
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.originalPasswordField.changeValidator(this.requiredValidator);
      this.changePasswordField.changeValidator(this.requiredValidator);
      this.changePasswordConfirmField.changeValidator(this.requiredValidator);
    });
  }


}
