import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-guide-artwork-image-upload',
  templateUrl: './guide-artwork-image-upload.component.html',
  styleUrls: ['./guide-artwork-image-upload.component.scss',
    '../../../../../assets/common/scss/guide-template.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class GuideArtworkImageUploadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
