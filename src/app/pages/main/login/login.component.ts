import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {InputElementType, SharedInputComponent} from '../../../components/shared/shared-input/shared-input.component';
import { FormControl, Validators } from '@angular/forms';
import { AuthorService } from 'src/app/repository/api/author.service';
import { Router } from '@angular/router';
import { Author } from '../../../repository/entities/author.entity';
import { StorageService } from '../../../service/storage.service';
import { FeedbackService } from '../../../service/feedback.service';
import { GlobalService } from '../../../service/global.service';
import {HeaderElementType} from "../../../components/shared/shared-header/shared-header.component";
import {LoadingService} from "../../../service/loading.service";

export class LoginFormControls {
  authorLink?: FormControl;
  password?: FormControl;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  passwordType = 'password';
  buttonStatus : boolean = false;
  requiredValidator = [Validators.required];

  @ViewChild('authorLinkField') authorLinkField!: SharedInputComponent;
  @ViewChild('passwordField') passwordField!: SharedInputComponent;

  constructor(
    private authorService: AuthorService,
    private feedbackService: FeedbackService,
    private router: Router,
    private storageService: StorageService,
    private globalService: GlobalService,
    private loadingService: LoadingService,
  ) {
    this.globalService.sendHeaderTypeSubject(HeaderElementType.GOBACK);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.authorLinkField.changeValidator(this.requiredValidator);
      this.passwordField.changeValidator(this.requiredValidator);
    });
  }

  passwordTypeToggle(passwordField : any): void {
    passwordField.type === InputElementType.PASSWORD
      ? (passwordField.type = InputElementType.TEXT)
      : (passwordField.type = InputElementType.PASSWORD);
  }

  login(): void {
    const loginForm = this.getFormControls();

    const authorLink = loginForm.authorLink?.value;
    const password = loginForm.password?.value;
    const body = {
      authorLink,
      password,
    };

    this.loadingService.loadingStart();

    this.authorService.loginAuthor(body).subscribe({
      next: (author: Author) => {
        if (author) {
          this.loadingService.loadingEnd();
          this.storageService.setAuthor(author);
          this.globalService.setAuthor();

          this.router.navigateByUrl('/editor').then(() => {
            this.feedbackService.openFeedback('로그인 되었습니다.');
          });
        }
      },
      error: (e) => {
        console.log('login failed : ', e);
        if (e?.message) {
          this.loadingService.loadingEnd();
          this.feedbackService.openFeedback('로그인을 실패했습니다.');
        }
      },
    });
  }

  toggleButtonStatus():void{
    this.buttonStatus = !this.requireValidation();
  }

  getFormControls(): LoginFormControls {
    return {
      authorLink: this.authorLinkField.formControl,
      password: this.passwordField.formControl,
    };
  }

  formValidateStatus(): any {
    const authorLink: boolean = this.authorLinkField?.formControl.valid;
    const password: boolean = this.passwordField?.formControl.valid;

    return {
      authorLink,
      password,
    };
  }

  requireValidation(): boolean {
    const formStatus: any = this.formValidateStatus();

    return !!(formStatus?.authorLink && formStatus?.password);
  }

  async goToSignUp(): Promise<void> {
    await this.router.navigateByUrl('/sign-up');
  }
}
