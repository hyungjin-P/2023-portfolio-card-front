import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { FeedbackService } from './service/feedback.service';
import { HeaderElementType } from './components/shared/shared-header/shared-header.component';
import {LoadingService} from "./service/loading.service";
import {StorageService} from "./service/storage.service";
import {GlobalService} from "./service/global.service";
import {Author} from "./repository/entities/author.entity";

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  subscription?: Subscription;

  constructor(
    private router: Router,
    private feedBackService: FeedbackService,
  ) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }

      if (browserRefresh) {}
    });
  }

  ngOnInit(): void {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', appHeight);
    appHeight();
  }
}
