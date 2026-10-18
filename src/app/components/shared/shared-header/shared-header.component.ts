import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GlobalService} from '../../../service/global.service';
import {MatDialog} from "@angular/material/dialog";
import {FeedbackService} from "../../../service/feedback.service";
import {Router} from "@angular/router";

export enum HeaderElementType {
  LOGO = 'logo',
  GOBACK = 'goback',
  PREVIEW = 'preview',
}

@Component({
  selector: 'shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
})
export class SharedHeaderComponent implements OnInit {

  HeaderElementType = HeaderElementType;

  @Input() isLogin: boolean = false;
  @Input() isLogo: boolean = false;
  @Input() headerType : HeaderElementType = HeaderElementType.LOGO;

  @Output() loginButtonClicked = new EventEmitter();
  @Output() profileButtonClicked = new EventEmitter();
  @Output() closeButtonClicked = new EventEmitter();
  @Output() goBackButtonClicked = new EventEmitter();
  @Output() closePreviewButtonClicked = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private feedbackService: FeedbackService,
    private globalService: GlobalService,
  ) {
    this.globalService
      .headerTypeSubjectObservable()
      .subscribe({
        next: (value) => {
          this.headerType = value;
        }
      })
    this.globalService
      .isLoginSubjectObservable()
      .subscribe({
        next: (value) => {
          this.isLogin = value;
        }
      })
  }

  ngOnInit(): void {
  }

  loginButtonClickedEvent(event: any): void {
    this.loginButtonClicked.emit(event);
  }

  goBackButtonClickedEvent(event: any): void {
    this.goBackButtonClicked.emit(event);
  }

  closePreviewButtonClickedEvent(event: any): void {
    this.closePreviewButtonClicked.emit(event);
  }

  profileButtonClickedEvent(event: any): void {
    this.profileButtonClicked.emit(event);
    this.goToAccount()
  }

  goToAccount(): void {
    this.router.navigateByUrl('/account').then();
  }

  setIsLogin(status: boolean): boolean {
    this.isLogin = status;
    return this.isLogin;
  }

  setIsLogo(status: boolean): boolean {
    this.isLogo = status;
    return this.isLogo;
  }

  toggleIsLogin(): void {
    this.isLogin = !this.isLogin;
  }

}
