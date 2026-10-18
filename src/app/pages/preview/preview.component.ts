import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CardFace} from './card-face-controller/card-face-controller.component';
import {GlobalService} from '../../service/global.service';
import {HeaderElementType} from '../../components/shared/shared-header/shared-header.component';
import {StorageService} from 'src/app/service/storage.service';
import {Author} from '../../repository/entities/author.entity';
import {LoadingService} from 'src/app/service/loading.service';
import {FeedbackService} from "../../service/feedback.service";
import {AuthorService} from "../../repository/api/author.service";
import {Portfolio} from "../../repository/entities/portfolio.entity";
import {PortfolioService} from "../../repository/api/portfolio.service";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {PortfolioArtworkService} from "../../repository/api/portfolio-artwork.service";
import {PortfolioArtWork} from "../../repository/entities/portfolio-artwork.entity";
import {PreviewArtworkComponent} from "./preview-artwork/preview-artwork.component";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, AfterViewInit {

  loginAuthor?: Author;

  /** 링크추적 */
  authorLink = '';
  /** 프리뷰 사용자 포트폴리오 */
  portfolio?: Portfolio;
  portfolioArtWork?: PortfolioArtWork;

  @ViewChild('previewArtWork') previewArtWork!: PreviewArtworkComponent;

  CardFace = CardFace;

  /** 현재 카드 면 (앞면, 뒷면)*/
  nowCardFace: CardFace = CardFace.Front;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private storageService: StorageService,
    private loadingService: LoadingService,
    private feedbackService: FeedbackService,
    private authorService: AuthorService,
    private portfolioService: PortfolioService,
    private portfolioArtworkService: PortfolioArtworkService,

  ) {
    this.globalService.sendHeaderTypeSubject(HeaderElementType.PREVIEW);

    this.loginAuthor = this.storageService.getAuthor();
    this.authorLink = this.activatedRoute.snapshot.url[0].path;
    // @ts-ignore
    // let timer = undefined;
    // window.addEventListener('resize', () => {
    //   // @ts-ignore
    //   clearTimeout(timer);
    //
    //   timer = setTimeout(() => {
    //     this.refresh(`preview/${this.loginAuthor?.id}`);
    //   }, 200);
    // });
  }

  async ngAfterViewInit(): Promise<void> {
    this.loadingService.loadingStart();

    this.authorService
      .getAuthorByAuthorLink(this.authorLink)
      .subscribe({
        next: (result) => {
          if (result) {
            this.portfolioService
              .createNewPortfolio({ authorId: result.id })
              .subscribe({
                next: async (portfolio: Portfolio) => {
                  this.portfolio = portfolio;
                  this.getArtWork();

                  this.loadingService.loadingEnd();
                },
                error: (err) => {
                  this.loadingService.loadingEnd();
                  this.feedbackService.openFeedback('주소에 해당하는 작가를 찾을 수 없습니다.\nURL을 확인해주세요.');
                }
              });
          } else {
            this.loadingService.loadingEnd();
            this.feedbackService.openFeedback('주소에 해당하는 작가를 찾을 수 없습니다.\nURL을 확인해주세요.');
          }
        },
        error: (err) => {
          console.log('err', err);
        }
      })
  }

  async ngOnInit(): Promise<void> {
  }

  getArtWork() {
    this.portfolioArtworkService.initArtWork(this.portfolio?.authorId).subscribe({
      next: (artwork) => {
        this.portfolioArtWork = artwork;
        this.previewArtWork.setArtWork(this.portfolioArtWork);
      },
      error: (error) => {
        console.log(error)
      },
    })
  }

  changeCardFace(cardFace: CardFace): void {
    this.nowCardFace = cardFace;
  }

  refresh(href: string): void {
    this.loadingService.loadingStart();
    this.router.navigateByUrl('/blank', {
      skipLocationChange: true,
    }).then(() => {
      setTimeout(() => {
        this.router.navigateByUrl(href).then(() => {
          this.loadingService.loadingEnd();
        });
      });
    });
  }
}
