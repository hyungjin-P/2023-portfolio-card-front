import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'shared-accordion-block-notice',
  templateUrl: './shared-accordion-block-notice.component.html',
  styleUrls: ['./shared-accordion-block-notice.component.scss']
})
export class SharedAccordionBlockNoticeComponent implements OnInit {

  @Input() innerText : string = '이곳은 해당 블록의 가벼운 안내사항을 기입하는 공간입니다.'
  constructor() { }

  ngOnInit(): void {
  }

}
