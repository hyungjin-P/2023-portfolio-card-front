import {Component, Input, OnInit} from '@angular/core';
import {FeedbackService} from "../../../../service/feedback.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {Author} from "../../../../repository/entities/author.entity";
import {StorageService} from "../../../../service/storage.service";

@Component({
  selector: 'app-dialog-share-link',
  templateUrl: './dialog-share-link.component.html',
  styleUrls: ['./dialog-share-link.component.scss']
})
export class DialogShareLinkComponent implements OnInit {
  loginAuthor?: Author;
  link?: string;
  qrLink?: string;


  constructor(
    private storageService: StorageService,
    private feedbackService: FeedbackService,
    private clipboard: Clipboard,
  ) { }

  ngOnInit(): void {
    this.loginAuthor = this.storageService.getAuthor();
    this.link = `crackit-universe.com/${this.loginAuthor.authorLink}`;
    this.qrLink = `https://www.crackit-universe.com/${this.loginAuthor.authorLink}`;
  }

  copyLink() {
    if(this.link){
      this.clipboard.copy(this.link);
      this.feedbackService.openFeedback('링크가 복사되었습니다.');
    }
  }
}
