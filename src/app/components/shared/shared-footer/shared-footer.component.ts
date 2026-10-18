import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../../service/feedback.service';
import {Router} from "@angular/router";

@Component({
  selector: 'shared-footer',
  templateUrl: './shared-footer.component.html',
  styleUrls: ['./shared-footer.component.scss']
})
export class SharedFooterComponent implements OnInit {

  constructor(
    private router: Router,
    private feedBackService: FeedbackService
  ) { }

  ngOnInit(): void {
  }

  openServicesTerms(): void{
    this.router.navigateByUrl('/service-terms').then();
  }

  openPrivacy(): void {
    this.router.navigateByUrl('/privacy').then();
  }

  openFeedback(): void {
    this.feedBackService.openFeedback('준비중입니다.');
  }

}
