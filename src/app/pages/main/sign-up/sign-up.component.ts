import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from 'src/app/service/feedback.service';
import {InputElementType, SharedInputComponent} from '../../../components/shared/shared-input/shared-input.component';
import { FormControl, Validators } from '@angular/forms';
import {
  SharedAuthorLinkFormComponent,
} from '../../../components/shared/shared-author-link-form/shared-author-link-form.component';
import { SharedCheckboxComponent } from '../../../components/shared/shared-checkbox/shared-checkbox.component';
import { JoinAuthorDto, AuthorService } from '../../../repository/api/author.service';
import { Author } from '../../../repository/entities/author.entity';
import { StorageService } from '../../../service/storage.service';
import { GlobalService } from '../../../service/global.service';
import {HeaderElementType} from "../../../components/shared/shared-header/shared-header.component";

export class ConfirmObj {
  authorLink?: FormControl;
  password?: FormControl;
  passwordConfirm?: FormControl;
  email?: FormControl;
  serviceTerm?: FormControl;
}

export let browserRefresh = false;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  portfolioUrl = '';
  authorLink: string = '';

  @ViewChild('passwordField') passwordField!: SharedInputComponent;
  @ViewChild('passwordConfirmField')
  passwordConfirmField!: SharedInputComponent;
  @ViewChild('emailField') emailField!: SharedInputComponent;
  @ViewChild('authorLinkField') authorLinkField!: SharedAuthorLinkFormComponent;
  @ViewChild('serviceTermField') serviceTermField!: SharedCheckboxComponent;

  passwordType = 'password';

  requiredValidator = [ Validators.required ];
  emailValidator = [ Validators.required, Validators.email ];
  passwordValidator = [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(20),
    Validators.pattern('^[a-zA-Z0-9]{6,}$'),
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private feedbackService: FeedbackService,
    private authorService: AuthorService,
    private storageService: StorageService,
    private globalService: GlobalService,
  ) {}

  ngOnInit(): void {
    const activatedUrlParam: any = this.activatedRoute.snapshot.params;
    if (activatedUrlParam?.authorHopeUrl) {
      this.authorLink = activatedUrlParam.authorHopeUrl;
    }
    this.globalService.sendHeaderTypeSubject(HeaderElementType.GOBACK);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.authorLink) {
        this.authorLinkField.sharedInput.nativeElement.focus();
      }

      this.passwordField.changeValidator(this.passwordValidator);
      this.passwordConfirmField.changeValidator(this.passwordValidator);
      this.emailField.changeValidator(this.emailValidator);
      this.authorLinkField.setFormControlValue(this.authorLink);
    });
  }

  passwordTypeToggle(passwordField : any) {
    passwordField.type === InputElementType.PASSWORD
      ? (passwordField.type = InputElementType.TEXT)
      : (passwordField.type = InputElementType.PASSWORD);
  }

   signUp(): void {
    if (!this.requireValidation()) {
      this.feedbackService.openFeedback('누락된 입력 값이 없는지 확인해주세요.');
      return;
    }

    const formControls = this.getFormControls();

    if (formControls.password?.value !== formControls.passwordConfirm?.value) {
      this.feedbackService.openFeedback('비밀번호 입력값이 일치하지 않습니다.');
      this.passwordConfirmField.sharedInput.nativeElement.focus();
      return;
    }

    const body: JoinAuthorDto = {
      authorLink: formControls.authorLink?.value,
      password: formControls.password?.value,
      email: formControls.email?.value,
      serviceTerm: formControls.serviceTerm?.value,
    };

    this.authorService
      .joinAuthor(body)
      .subscribe({
        next: (author: Author) => {
          if (author) {
            this.feedbackService.openFeedback('회원가입이 완료되었습니다.');
            this.storageService.setAuthor(author);
            this.globalService.setAuthor();
            this.router.navigateByUrl('editor').then(() => {})
          }
        },
        error: (e) => {
          if (e.error?.message) {
            this.feedbackService.openFeedback(e.error?.message);
          }
        }
      });
  }

  getFormControls(): ConfirmObj {
    const authorLink: FormControl = this.authorLinkField?.formControl
    const password: FormControl = this.passwordField?.formControl
    const passwordConfirm: FormControl =
      this.passwordConfirmField?.formControl
    const email: FormControl = this.emailField?.formControl
    const serviceTerm: FormControl = this.serviceTermField?.formControl

    return {
      authorLink,
      password,
      passwordConfirm,
      email,
      serviceTerm,
    };
  }

  getFormValidationStatus(): any {
    const authorLink: boolean = this.authorLinkField?.formControl?.valid;
    const password: boolean = this.passwordField?.formControl?.valid;
    const passwordConfirm: boolean =
      this.passwordConfirmField?.formControl?.valid;
    const email: boolean = this.emailField?.formControl?.valid;
    const serviceTerm: boolean = this.serviceTermField?.formControl?.valid;

    return {
      authorLink,
      password,
      passwordConfirm,
      email,
      serviceTerm,
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

  duplicateAuthorLinkCheck(): void {
    const authorLink: string = this.authorLinkField.getFormControlValue();

    this.authorService
      .isDuplicateAuthorLink(authorLink)
      .subscribe({
        next: (result) => {
          if (result) {
            this.feedbackService.openFeedback('이미 사용중인 아이디 입니다.');
          } else {
            this.feedbackService.openFeedback('사용할 수 있는 아이디 입니다.');
          }
        },
        error: (err) => {
          console.log('err', err);
        }
      })

  }


}
