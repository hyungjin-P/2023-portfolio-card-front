import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FeedbackService} from 'src/app/service/feedback.service';
import {AuthorService} from "../../../repository/api/author.service";
import { GlobalService } from '../../../service/global.service';
import {HeaderElementType} from "../../../components/shared/shared-header/shared-header.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  componentName :string = 'HomeComponent';
  authorHopeUrl: string = '';

  @ViewChild('createPortfolioInputWrap') createPortfolioInputWrap: ElementRef | undefined;
  @ViewChild('authorHopeUrlInput') authorHopeUrlTag: ElementRef | undefined;

  constructor(
    private router: Router,
    private feedbackService: FeedbackService,
    private renderer: Renderer2,
    private authorService: AuthorService,
    private globalService: GlobalService,
  ) {
    sessionStorage.removeItem('casualauthor');
    this.globalService.sendHeaderTypeSubject(HeaderElementType.LOGO);
  }

  ngOnInit(): void {
  }

  async createPortfolio(): Promise<void> {
    if (!this.authorHopeUrl) {
      this.feedbackService.openFeedback('사용하실 포트폴리오 이름를 입력해주세요.');
      this.focusAuthorHopeUrl();
      return;
    }

    // 공백 및 특수문자
    let regExp = /^[a-zA-Z0-9_-]*$/;

    if (!this.authorHopeUrl.match(regExp)) {
      this.feedbackService.openFeedback('아이디는 영문 및 숫자 그리고 _와 -만 사용할 수 있습니다.');
      this.focusAuthorHopeUrl();
      return;
    }

    await this.router.navigateByUrl(`sign-up/${this.authorHopeUrl}`);
  }

  focusAuthorHopeUrl(): void {
    if (this.authorHopeUrlTag) {
      this.authorHopeUrlTag.nativeElement.focus();
    }
  }

  async keyupEnter(event: any): Promise<void> {
    if (event.key === 'Enter') {
      await this.createPortfolio();
    }
  }
}
