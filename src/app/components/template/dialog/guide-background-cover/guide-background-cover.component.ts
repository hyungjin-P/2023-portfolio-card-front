import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-guide-background-cover',
  templateUrl: './guide-background-cover.component.html',
  styleUrls: ['./guide-background-cover.component.scss',
    '../../../../../assets/common/scss/guide-template.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class GuideBackgroundCoverComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
