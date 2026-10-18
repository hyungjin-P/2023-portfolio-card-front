import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OnBoardingEx01Component } from './develop/on-boarding-ex01/on-boarding-ex01.component';
import { environment } from '../../environments/environment';
import { ComponentsModule } from '../components/components.module';
import { TestComponent } from './develop/test/test.component';
import { SignUpComponent } from './main/sign-up/sign-up.component';
import { LoginComponent } from './main/login/login.component';
import { ForgotPasswordComponent } from './main/forgot-password/forgot-password.component';
import { EditorComponent } from './editor/editor.component';
import { HomeComponent } from './main/home/home.component';
import { AutoSizeInputModule } from 'ngx-autosize-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { PagesComponent } from './pages.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { AuthorServiceTestComponent } from './develop/author-service-test/author-service-test.component';
import { ConfirmModalTestComponent } from './develop/confirm-modal-test/confirm-modal-test.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ArtWorkManagementComponent } from './editor/art-work-management/art-work-management.component';
import { MainViewManagementComponent } from './editor/main-view-management/main-view-management.component';
import { ProfileManagementComponent } from './editor/profile-management/profile-management.component';
import { MatIconModule } from '@angular/material/icon';
import { LoginAuthGuard } from '../guard/login-auth.guard';
import { SharedLoadingTestComponent } from './develop/shared-loading-test/shared-loading-test.component';
import { GuideDialogTestComponent } from './develop/guide-dialog-test/guide-dialog-test.component';
import { BottomSheetTesComponent } from './develop/bottom-sheet-tes/bottom-sheet-tes.component';
import { HeaderTestComponent } from './develop/header-test/header-test.component';
import { AccountComponent } from './account/account.component';
import { AccountTestComponent } from './develop/account-test/account-test.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ChangePasswordTestComponent } from './develop/account-test/change-password-test/change-password-test.component';
import { AccountChangePasswordComponent } from './account/account-change-password/account-change-password.component';
import { HasLoginInfoGuard } from '../guard/has-login-info.guard';
import { DialogDynamicInnerContentComponent } from './develop/dialog-dynamic-inner-content/dialog-dynamic-inner-content.component';
import { DynamicDialogTemplateComponent } from './develop/dynamic-dialog-template/dynamic-dialog-template.component';
import { PreviewComponent } from './preview/preview.component';
import { PreviewModule } from './preview/preview.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BlockDefaultInformationComponent } from './editor/profile-management/block-default-information/block-default-information.component';
import { DefaultInformationProfileChangeComponent } from './editor/profile-management/block-default-information/default-information-profile-change/default-information-profile-change.component';
import { ArtworkModule } from '../components/page-parts/artwork/artwork.module';
import { BlockContactComponent } from './editor/profile-management/block-contact/block-contact.component';
import { BlockSnsLinkComponent } from './editor/profile-management/block-sns-link/block-sns-link.component';
import { BlockSectionSnsLinkComponent } from './editor/profile-management/block-sns-link/block-section-sns-link/block-section-sns-link.component';
import { BlankComponent } from './blank/blank.component';
import { BlockEducationComponent } from './editor/profile-management/block-education/block-education.component';
import { BlockSectionEducationComponent } from './editor/profile-management/block-education/block-section-education/block-section-education.component';
import { BlockExhibitionComponent } from './editor/profile-management/block-exhibition/block-exhibition.component';
import { BlockAwardsComponent } from './editor/profile-management/block-awards/block-awards.component';
import { BlockEtcComponent } from './editor/profile-management/block-etc/block-etc.component';
import { ArtworkApiTestComponent } from './develop/artwork-api-test/artwork-api-test.component';
import {ServiceTermsComponent} from "./service-terms/service-terms.component";
import {PrivacyComponent} from "./privacy/privacy.component";

/** @description Production View */
let routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      /* 홈*/
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [HasLoginInfoGuard],
      },

      /* 회원가입 */
      {
        path: 'sign-up',
        component: SignUpComponent,
        canActivate: [HasLoginInfoGuard],
      },
      {
        path: 'sign-up/:authorHopeUrl',
        component: SignUpComponent,
        canActivate: [HasLoginInfoGuard],
      },

      /* 로그인 */
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [HasLoginInfoGuard],
      },

      /* 비밀번호 찾기 */
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [HasLoginInfoGuard],
      },

      /* 내 계정 */
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [LoginAuthGuard],
      },

      /* 에디터 */
      {
        path: 'editor',
        canActivate: [LoginAuthGuard],
        component: EditorComponent,
        children: [
          { path: '', redirectTo: 'main-view-management', pathMatch: 'full' },

          /* 에디터 > 대표화면 관리 */
          {
            path: 'main-view-management',
            component: MainViewManagementComponent,
          },

          /* 에디터 > 작품 관리 */
          {
            path: 'art-work-management',
            component: ArtWorkManagementComponent,
          },

          /* 에디터 > 프로필 관리 */
          { path: 'profile-management', component: ProfileManagementComponent },
        ],
      },

      /* 빈 페이지, 경유 용도 */
      {
        path: 'blank',
        component: BlankComponent,
      },

      {
        path: 'service-terms',
        component: ServiceTermsComponent,
      },

      {
        path: 'privacy',
        component: PrivacyComponent,
      },

      /* 링크 확인 이후 사용자 검색 시 프리뷰 표시 */
      {
        path: '**',
        component: PreviewComponent
      }
    ],
  },

  // {path: '**', component: PreviewComponent }
];

/** @description 개발용뷰 */
if (!environment.production) {
  const devRoutes: Routes = [
    {
      path: 'example/ex01',
      component: OnBoardingEx01Component,
    },
    { path: 'example/ex02', component: TestComponent },
    {
      path: 'example/shared-loading-test',
      component: SharedLoadingTestComponent,
    },
    {
      path: 'example/confirm-modal-test',
      component: ConfirmModalTestComponent,
    },
    { path: 'example/author-service-test', component: AuthorServiceTestComponent },
    { path: 'example/guide-dialog-test', component: GuideDialogTestComponent },
    { path: 'example/bottom-sheet-test', component: BottomSheetTesComponent },
    { path: 'example/header-test', component: HeaderTestComponent },
    { path: 'example/account-test', component: AccountTestComponent },
    { path: 'example/artwork-test', component: ArtworkApiTestComponent },
    {
      path: 'example/dynamic-dialog-content',
      component: DialogDynamicInnerContentComponent,
    },
  ];

  routes[0]?.children?.push(...devRoutes);
}

@NgModule({
  declarations: [
    OnBoardingEx01Component,
    TestComponent,
    SignUpComponent,
    LoginComponent,
    ForgotPasswordComponent,
    EditorComponent,
    HomeComponent,
    PagesComponent,
    PrivacyComponent,
    ServiceTermsComponent,
    ConfirmModalTestComponent,
    AuthorServiceTestComponent,
    ArtWorkManagementComponent,
    MainViewManagementComponent,
    ProfileManagementComponent,
    SharedLoadingTestComponent,
    GuideDialogTestComponent,
    BottomSheetTesComponent,
    HeaderTestComponent,
    AccountComponent,
    AccountTestComponent,
    ChangePasswordTestComponent,
    AccountChangePasswordComponent,
    DialogDynamicInnerContentComponent,
    DynamicDialogTemplateComponent,
    BlockDefaultInformationComponent,
    DefaultInformationProfileChangeComponent,
    BlockContactComponent,
    BlockSnsLinkComponent,
    BlockSectionSnsLinkComponent,
    BlankComponent,
    BlockEducationComponent,
    BlockSectionEducationComponent,
    BlockExhibitionComponent,
    BlockAwardsComponent,
    BlockEtcComponent,
    ArtworkApiTestComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    AutoSizeInputModule,
    FormsModule,
    OverlayscrollbarsModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    ClipboardModule,
    PreviewModule,
    DragDropModule,
    ArtworkModule,
  ],
})
export class PagesModule {}
