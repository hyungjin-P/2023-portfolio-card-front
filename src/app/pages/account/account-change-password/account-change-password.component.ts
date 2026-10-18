import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {InputElementType, SharedInputComponent} from "../../../components/shared/shared-input/shared-input.component";
import {Validators} from "@angular/forms";
import {
  SharedConfirmDialogComponent,
} from "../../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'account-change-password',
  templateUrl: './account-change-password.component.html',
  styleUrls: ['./account-change-password.component.scss']
})
export class AccountChangePasswordComponent implements OnInit, AfterViewInit {

  @ViewChild('originalPasswordField') originalPasswordField!: SharedInputComponent
  @ViewChild('changePasswordField') changePasswordField!: SharedInputComponent
  @ViewChild('changePasswordConfirmField') changePasswordConfirmField!: SharedInputComponent

  @Output() cancelChangePassword: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveChangePassword: EventEmitter<any> = new EventEmitter<any>();

  passwordType = InputElementType.PASSWORD;
  requiredValidator = [Validators.required];
  disableSaveButton: boolean = false;

  passwordTypeToggle(passwordField: any) {
    passwordField.type === InputElementType.PASSWORD
      ? (passwordField.type = InputElementType.TEXT)
      : (passwordField.type = InputElementType.PASSWORD);
  }

  constructor(
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.originalPasswordField.changeValidator(this.requiredValidator);
      this.changePasswordField.changeValidator(this.requiredValidator);
      this.changePasswordConfirmField.changeValidator(this.requiredValidator);
    });
  }

  /** @description block 작성 내용 취소시  dialog */
  openCancelConfirm(event: any): void {
    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: event,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef.afterClosed().subscribe({
      next: (action: any) => {
        if (action.action === 'confirm') {
          this.initValue();
        }
      }
    });
  }

  /** @description block 작성 내용 초기화 */
  initValue(): void {
    this.originalPasswordField.formControl.setValue('');
    this.changePasswordField.formControl.setValue('');
    this.changePasswordConfirmField.formControl.setValue('');
  }

  clickSaveButton(event: any): void {
    this.saveChangePassword.emit(event);
  }


}
