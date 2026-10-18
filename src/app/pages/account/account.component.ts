import {Component, OnInit} from '@angular/core';
import {
  SharedConfirmDialogComponent,
  SharedConfirmDialogData
} from "../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FeedbackService} from "../../service/feedback.service";
import {GlobalService} from "../../service/global.service";
import {StorageService} from "../../service/storage.service";
import {InputElementType} from "../../components/shared/shared-input/shared-input.component";
import {Clipboard} from "@angular/cdk/clipboard";
import {Author} from "../../repository/entities/author.entity";
import {Validators} from "@angular/forms";
import {
  SharedNoticeDialogComponent,
  SharedNoticeDialogData
} from "../../components/shared/shared-notice-dialog/shared-notice-dialog.component";
import {HeaderElementType} from "../../components/shared/shared-header/shared-header.component";
import {AccountChangePasswordComponent} from "./account-change-password/account-change-password.component";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit{

  passwordType = 'password';
  isBlockActive : boolean = false;
  requiredValidator = [Validators.required];
  loginAuthor? : Author;
  accountChangePasswordComponent : any = AccountChangePasswordComponent;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private feedbackService: FeedbackService,
    private globalService: GlobalService,
    private storageService: StorageService,
    private clipboard: Clipboard,

  ) {
    this.globalService.sendHeaderTypeSubject(HeaderElementType.GOBACK);
  }

  ngOnInit(): void {
    this.loginAuthor = this.storageService.getAuthor();
  }

  ngAfterViewInit(): void {

  }


  logout(): void {
    this.openConfirmDialog();
  }

  signOut(): void {
    this.openSingOutDialog();
  }

  openConfirmDialog(): void {
    const dialogData: SharedConfirmDialogData = {
      title: '로그아웃',
      message: '로그아웃을 하시겠어요?',
      confirmButtonText: '로그아웃',
      closeButtonText: '취소'
    };

    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('confirm dialog cancel : ', result);
        if (result?.action === 'confirm') {
          this.storageService.removeAuthor().then(() => {
            this.globalService.removeAuthor();
            this.feedbackService.openFeedback('로그아웃 완료');
          });

          this.router.navigateByUrl('/home').then();
        } else {
        }
      });
  }


  openSingOutDialog(): void {
    const dialogData: SharedConfirmDialogData = {
      title: '크래킷 서비스 회원 탈퇴',
      message: '본 서비스는 베타버전으로 아티스트들이\n포트폴리오를 사용하실 수 있도록\n피드백을 받아 더 좋은 서비스로 보답드리도록\n업데이트 될 예정입니다.\n그래도 탈퇴하시겠어요?',
      confirmButtonText: '탈퇴하기',
      closeButtonText: '아니요'
    };

    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: dialogData,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('confirm dialog cancel : ', result);
        if (result?.action === 'confirm') {
          this.globalService.removeAuthor();
          this.storageService.removeAuthor().then(() => {
            this.router.navigateByUrl('/home').then();
            this.feedbackService.openFeedback('회원탈퇴 완료');
          });
        } else {
        }
      });
  }

  passwordTypeToggle(passwordField : any) {
    passwordField.type === InputElementType.PASSWORD
      ? (passwordField.type = InputElementType.TEXT)
      : (passwordField.type = InputElementType.PASSWORD);
  }

  clickOpenButton(): void {
    this.isBlockActive = !this.isBlockActive;
  }

  copyUrl(url : any) {
    this.feedbackService.openFeedback('링크가 복사되었습니다.');
    this.clipboard.copy(url);
  }

  openCancelConfirm(cancelDialogContent: SharedConfirmDialogData): void {
    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: cancelDialogContent,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef.afterClosed().subscribe();
  }

  cancelChangePassword():void{
    console.log('cancel')
  }
  saveChangePassword():void{
    console.log('save')
    this.openNoticeDialog()
  }

  openNoticeDialog(): void {
    const dialogData: SharedNoticeDialogData = {
      title: '비밀번호 변경이 완료되었습니다.',
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


}
