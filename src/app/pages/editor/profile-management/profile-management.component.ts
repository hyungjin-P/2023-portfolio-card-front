import {Component, OnInit} from '@angular/core';
import {BlockDefaultInformationComponent} from "./block-default-information/block-default-information.component";
import {BlockContactComponent} from "./block-contact/block-contact.component";
import {FeedbackService} from "../../../service/feedback.service";
import {BlockSnsLinkComponent} from "./block-sns-link/block-sns-link.component";
import {BlockEducationComponent} from "./block-education/block-education.component";
import {BlockExhibitionComponent} from "./block-exhibition/block-exhibition.component";
import {BlockAwardsComponent} from "./block-awards/block-awards.component";
import {BlockEtcComponent} from "./block-etc/block-etc.component";
import {PortfolioHistoryService} from "../../../repository/api/portfolio-history.service";
import {StorageService} from "../../../service/storage.service";
import {Author} from "../../../repository/entities/author.entity";
import {LoadingService} from "../../../service/loading.service";
import {PortfolioService} from "../../../repository/api/portfolio.service";
import {PortfolioHistory} from "../../../repository/entities/portfolio-history.entity";

export class ProfileManagementBlocks {
  title: string;
  isActive: boolean;
  isPublic: boolean;
  isPublicButton: boolean;
  innerComponent: any;

  constructor(title: string, isActive: boolean, isPublic: boolean, isPublicButton: boolean, innerComponent: any) {
    this.title = title;
    this.isPublic = isPublic;
    this.isPublicButton = isPublicButton;
    this.isActive = isActive;
    this.innerComponent = innerComponent;
  }
}

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss']
})
export class ProfileManagementComponent implements OnInit {

  public static portfolioHistory: PortfolioHistory;

  profileManagementBlocks: ProfileManagementBlocks[] = [];

  loginAuthor?: Author;

  constructor(
    private storageService: StorageService,
    private loadingService: LoadingService,
    private feedbackService: FeedbackService,
    private portfolioService: PortfolioService,
    private historyService: PortfolioHistoryService,

  ) {
    this.loginAuthor = this.storageService.getAuthor();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if(this.loginAuthor){
     this.loadingService.loadingStart();

     this.portfolioService.createNewPortfolio({authorId: this.loginAuthor.id})
       .subscribe({
         next:(portfolio)=>{
           if(portfolio.id){
             this.historyService.create(portfolio.id).subscribe({
               next:(history)=>{
                 this.loadingService.loadingEnd();
                 ProfileManagementComponent.portfolioHistory = history;
                 this.setPortfolioManagement(history);
               },
               error:(error)=>{
                 console.log('portfolio find error : ', error);
                 this.feedbackService.openFeedback('이력 최초 생성에 실패했습니다.');
                 this.loadingService.loadingEnd();
               },
             })
           }
         },
         error:(error)=>{
           this.feedbackService.openFeedback('포트폴리오 생성에 실패했습니다.');
           this.loadingService.loadingEnd();
         },
       });
    }
  }

  private setPortfolioManagement(history: PortfolioHistory) {
    if (history){
      this.profileManagementBlocks = [
        {
          title: '기본정보',
          isActive: true,
          isPublic: history.generalIsPublic!,
          isPublicButton: false,
          innerComponent: BlockDefaultInformationComponent
        },
        {
          title: '연락처',
          isActive: false,
          isPublic: history.contactIsPublic!,
          isPublicButton: true,
          innerComponent: BlockContactComponent
        },
        {
          title: '학력 사항',
          isActive: false,
          isPublic: history.educationIsPublic!,
          isPublicButton: true,
          innerComponent: BlockEducationComponent
        },
        {
          title: '전시 경력',
          isActive: false,
          isPublic: history.exhibitionIsPublic!,
          isPublicButton: true,
          innerComponent: BlockExhibitionComponent
        },
        {
          title: '수상 이력',
          isActive: false,
          isPublic: history.awardIsPublic!,
          isPublicButton: true,
          innerComponent: BlockAwardsComponent
        },
        {
          title: '기타 이력',
          isActive: false,
          isPublic: history.etcIsPublic!,
          isPublicButton: true,
          innerComponent: BlockEtcComponent
        },
        // sns 링크 연결 및 비주얼 변경 가능할 때까지 잠시 중단
        // {
        //   title: 'SNS 및 링크',
        //   isActive: false,
        //   isPublic: history.snsIsPublic!,
        //   isPublicButton: true,
        //   innerComponent: BlockSnsLinkComponent
        // },
      ];
    }
  }

  clickOpenButton(block: ProfileManagementBlocks): void {
    block.isActive = !block.isActive;
  }

  clickPublicButton(block: ProfileManagementBlocks): void {
    block.isPublic = !block.isPublic;

    if (block.isPublic)
      this.feedbackService.openFeedback('블록이 공개 되었습니다.');

    if (!block.isPublic)
      this.feedbackService.openFeedback('블록이 비공개 되었습니다.');
  }


}
