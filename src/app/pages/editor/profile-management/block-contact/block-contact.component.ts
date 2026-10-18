import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  SharedConfirmDialogComponent,
  SharedConfirmDialogData
} from "../../../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {SharedInputComponent} from "../../../../components/shared/shared-input/shared-input.component";
import {Validators} from "@angular/forms";
import {PortfolioHistoryContact} from "../../../../repository/entities/portfolio-history-contact.entity";
import {ProfileManagementComponent} from "../profile-management.component";
import {LoadingService} from "../../../../service/loading.service";
import { PortfolioHistoryContactService } from 'src/app/repository/api/portfolio-history-contact.service';
import {FeedbackService} from "../../../../service/feedback.service";

@Component({
  selector: 'app-block-contact',
  templateUrl: './block-contact.component.html',
  styleUrls: ['./block-contact.component.scss']
})
export class BlockContactComponent implements OnInit, AfterViewInit {

  phoneNumberValidator = [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(20),
    Validators.pattern('[0-9-]*'),
  ];
  emailValidator = [Validators.required, Validators.email];
  disableSaveButton: boolean = false;

  @ViewChild('phoneNumberInput') phoneNumberInput!: SharedInputComponent;
  @ViewChild('emailInput') emailInput!: SharedInputComponent;

  portfolioHistoryContact?: PortfolioHistoryContact;
  portfolioHistoryId?: string;

  constructor(
    public dialog: MatDialog,
    private loadingService: LoadingService,
    private feedbackService: FeedbackService,
    private portfolioHistoryContactService: PortfolioHistoryContactService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if(ProfileManagementComponent.portfolioHistory){
      this.portfolioHistoryId = ProfileManagementComponent.portfolioHistory.id;
      this.getData();
    }

    setTimeout(() => {
      this.phoneNumberInput.changeValidator(this.phoneNumberValidator);
      this.emailInput.changeValidator(this.emailValidator);
    });
  }

  getData(){
    this.loadingService.loadingStart();
    this.portfolioHistoryContactService.create(this.portfolioHistoryId!).subscribe({
      next: (contact)=>{
        this.loadingService.loadingEnd();
        this.portfolioHistoryContact = contact;
        if(contact.tel) this.phoneNumberInput.setFormControlValue(contact.tel);
        if(contact.email) this.emailInput.setFormControlValue(contact.email);
      },
      error: (error)=>{
        console.log('contact create fail');
        this.loadingService.loadingEnd();
      },
    });
  }

  /** @description 취소 버튼 클릭 시 로직 */
  openCancelConfirm(cancelDialogContent: SharedConfirmDialogData): void {
    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: cancelDialogContent,
      panelClass: 'shared-confirm-dialog',
    });
    dialogRef.afterClosed().subscribe({
      next: (action: any) => {
        if (action?.action === 'confirm') {
          this.phoneNumberInput.formControl.setValue('');
          this.emailInput.formControl.setValue('');
          this.getData();
        }
      }
    });
  }


  getSaveData(): any {
    const tel = this.phoneNumberInput.getFormControlValue();
    const email = this.emailInput.getFormControlValue();

    return {
      tel: tel,
      email: email,
    };
  }

  save(): void {
    const getData = this.getSaveData();

    const saveData: PortfolioHistoryContact = {
      id: this.portfolioHistoryContact?.id,
      portfolioHistoryId: this.portfolioHistoryContact?.portfolioHistoryId,
      tel: getData.tel,
      email: getData.email,
    }

    this.loadingService.loadingStart();

    this.portfolioHistoryContactService
      .save(saveData)
      .subscribe({
        next: (portfolioContact) => {
          this.loadingService.loadingEnd();
          this.portfolioHistoryContact = portfolioContact;
          this.feedbackService.openFeedback('저장 되었습니다.')
        },
        error: () => {
          this.loadingService.loadingEnd();
          this.feedbackService.openFeedback('연락처 저장에 실패했습니다.');
        },
      });

  }

}
