import {Component, OnInit} from '@angular/core';
import {FeedbackService} from "../../../service/feedback.service";
import {Clipboard} from '@angular/cdk/clipboard';
import {GlobalService} from "../../../service/global.service";
import {AuthorService} from "../../../repository/api/author.service";
import {Author} from "../../../repository/entities/author.entity";
import {StorageService} from "../../../service/storage.service";

@Component({
  selector: 'app-account-test',
  templateUrl: './account-test.component.html',
  styleUrls: ['./account-test.component.scss']
})
export class AccountTestComponent implements OnInit {
  loginAuthor? : Author;
  isBlockActive : boolean = false;

  constructor(
    private clipboard: Clipboard,
    private globalService: GlobalService,
    private storageService: StorageService,
    private authorService: AuthorService,
    private feedbackService: FeedbackService,
  ) {}

  ngOnInit(): void {
    this.loginAuthor = this.storageService.getAuthor();
    console.log('this.loginAuthor', this.loginAuthor)
  }
  toggleBlock(): void {
    this.isBlockActive = !this.isBlockActive;
  }

  copyUrl(url : string) {
    this.feedbackService.openFeedback('주소가 복사되었습니다.');
    this.clipboard.copy(url);
  }

}
