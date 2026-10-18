import {Component, Input, OnInit} from '@angular/core';
import {PortfolioHistory} from "../../../repository/entities/portfolio-history.entity";
import {PortfolioHistoryService} from "../../../repository/api/portfolio-history.service";
import {LoadingService} from "../../../service/loading.service";
import {FeedbackService} from "../../../service/feedback.service";
import {PortfolioHistoryGeneral} from "../../../repository/entities/portfolio-history-general.entity";
import {PortfolioHistoryContact} from "../../../repository/entities/portfolio-history-contact.entity";

export class BackBlocks{
  name: string;
  type: string;
  innerHistory: HistoryTitle[];

  constructor(name: string, subTitle: string, type: string, innerHistory: HistoryTitle[]) {
    this.name = name;
    this.type = type;
    this.innerHistory = innerHistory;
  }
}

class HistoryTitle{
  title: string;
  subtitles: HistorySubtitle[];
  constructor(title: string, years: HistorySubtitle[]) {
    this.title = title;
    this.subtitles = years;
  }
}
class HistorySubtitle{
  subtitle: string;
  values: HistoryValue[];
  constructor(year: string, values: HistoryValue[]) {
    this.subtitle = year;
    this.values = values;
  }
}
class HistoryValue{
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}

@Component({
  selector: 'portfolio-preview-back',
  templateUrl: './preview-back.component.html',
  styleUrls: ['./preview-back.component.scss']
})
export class PreviewBackComponent implements OnInit {
  @Input() portfolioId: string = '';

  portfolioHistory?: PortfolioHistory;
  portfolioHistoryGeneral?: PortfolioHistoryGeneral;
  portfolioHistoryContact?: PortfolioHistoryContact;

  previewBackBlocks: BackBlocks[] = [];

  constructor(
    private loadingService: LoadingService,
    private feedbackService: FeedbackService,
    private portfolioHistoryService: PortfolioHistoryService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.portfolioId){
      this.loadingService.loadingStart();
      this.portfolioHistoryService.getAllHistoryByPortfolioId(this.portfolioId).subscribe({
        next: (portfolioHistory)=>{
          this.loadingService.loadingEnd();
          this.portfolioHistory = portfolioHistory;
          if (portfolioHistory?.portfolioHistoryGenerals) {
            this.portfolioHistoryGeneral = portfolioHistory?.portfolioHistoryGenerals[0];
          }
          if (portfolioHistory?.portfolioHistoryContacts){
            this.portfolioHistoryContact = portfolioHistory?.portfolioHistoryContacts[0];
            this.setContactValuesOnBlocks();
          }
          if (portfolioHistory?.portfolioHistoryEducations && portfolioHistory.educationIsPublic){
            this.pushPreviewBackBlock('Education', portfolioHistory.portfolioHistoryEducations);
          }
          if (portfolioHistory?.portfolioHistoryExhibitions && portfolioHistory.exhibitionIsPublic){
            this.pushPreviewBackBlock('Exhibition career', portfolioHistory.portfolioHistoryExhibitions);
          }
          if (portfolioHistory?.portfolioHistoryAwards && portfolioHistory.awardIsPublic){
            this.pushPreviewBackBlock('Awards', portfolioHistory.portfolioHistoryAwards);
          }
          if (portfolioHistory?.portfolioHistoryEtc && portfolioHistory.etcIsPublic){
            this.pushPreviewBackBlock('Etc', portfolioHistory.portfolioHistoryEtc);
          }
        },
        error: ()=>{
          this.loadingService.loadingEnd();
          this.feedbackService.openFeedback('정보를 불러오는데 실패하였습니다.');
        },
      });
    }
  }

  private setContactValuesOnBlocks(){
    this.previewBackBlocks.push({
      name: 'Contact',
      type: 'contact',
      innerHistory: [{
        title: '',
        subtitles: [
          {
            subtitle: 'tel',
            values: [
              {
                value: this.portfolioHistoryContact?.tel!
              }
            ]
          },
          {
            subtitle: 'email',
            values:[
              {
                value: this.portfolioHistoryContact?.email!
              }
            ]
          }
        ]
      }],
    });
  }

  private pushPreviewBackBlock(name: string, innerHistory: any[]){
    this.previewBackBlocks.push({
      name: name,
      type: name,
      innerHistory: innerHistory,
    })
  }
}

