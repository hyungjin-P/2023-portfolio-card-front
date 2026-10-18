import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dynamic-dialog-template',
  templateUrl: './dynamic-dialog-template.component.html',
  styleUrls: [
    './dynamic-dialog-template.component.scss',
    '../../../../assets/common/scss/guide-template.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DynamicDialogTemplateComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
