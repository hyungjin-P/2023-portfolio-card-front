import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/service/feedback.service';
import { AuthorCreateDto, AuthorService } from 'src/app/repository/api/author.service';
import { Author } from '../../../repository/entities/author.entity';

/** @description 온보드 뷰 테스트 */
@Component({
  selector: 'app-on-boarding-ex01',
  templateUrl: './on-boarding-ex01.component.html',
  styleUrls: ['./on-boarding-ex01.component.scss'],
})
export class OnBoardingEx01Component implements OnInit {
  constructor(
    private feedbackService: FeedbackService,
    private authorService: AuthorService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.openSnackBar();
  }

  openSnackBar(): void {
    this.feedbackService.openFeedback('테스트 테스트 테스트 테스트 테스트', {
      duration: 1000000,
    });

    const newAuthor: AuthorCreateDto = {
      provider: 'asdasd',
      providerId: 'asdasdasd',
      name: 'test',
      password: 'REDACTED_TEST_PASSWORD_2',
      email: 'asdasd',
    }

    this.authorService.create(newAuthor).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }
}
