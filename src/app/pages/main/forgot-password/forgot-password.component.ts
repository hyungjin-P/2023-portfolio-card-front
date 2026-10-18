import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  SharedNoticeDialogComponent, SharedNoticeDialogData
} from "../../../components/shared/shared-notice-dialog/shared-notice-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {SharedInputComponent} from "../../../components/shared/shared-input/shared-input.component";
import {FormControl, Validators} from "@angular/forms";
import {ConfirmObj} from "../sign-up/sign-up.component";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {

  @ViewChild('forgotPasswordField') forgotPasswordField!: SharedInputComponent;

  buttonStatus : boolean = true;
  emailValidator = [ Validators.required, Validators.email ];


  constructor(
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.forgotPasswordField.changeValidator(this.emailValidator);
    });
  }

  waitMessage(): void {
    this.openNoticeDialog()
  }

  openNoticeDialog(): void {
    const dialogData: SharedNoticeDialogData = {
      title: '임시비밀번호 이메일 발송완료',
      message: '가입하신 계정에 등록된 이메일로 \n' +
        '임시 비밀번호를 발송하였습니다. \n' +
        '재로그인 하신 후,  \n' +
        '꼭 비밀번호 재설정을 진행해 주세요.',
      closeButtonText: '확인',
      isCheckIcon: true,
    };

    const dialogRef = this.dialog.open(SharedNoticeDialogComponent, {
      data: dialogData,
      panelClass: 'shared-notice-dialog',
    });

    dialogRef
      .afterClosed()
      .subscribe();
  }

  toggleButtonStatus():void{
    this.buttonStatus = !this.requireValidation();
  }

  /**
   * @todo 아이디 존재하는지 확인 후 반환하는 기능 추가
   * */
  getFormControls(): ConfirmObj {
    const email: FormControl = this.forgotPasswordField?.formControl

    return {
      email,
    };
  }

  getFormValidationStatus(): any {
    const email: boolean = this.forgotPasswordField?.formControl?.valid;

    return {
      email,
    };
  }

  requireValidation(): boolean {
    const formStatus: {[key: string]: boolean} = this.getFormValidationStatus();
    let objectCount = 0;
    let matchedCount = 0;

    Object.keys(formStatus).forEach((key) => {
      objectCount++;

      if (formStatus[key]) {
        matchedCount++;
      }
    });

    return objectCount === matchedCount;
  }

}
