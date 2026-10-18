import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Swiper } from 'swiper';

register();

@Component({
  selector: 'preview-tags',
  templateUrl: './preview-tags.component.html',
  styleUrls: ['./preview-tags.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PreviewTagsComponent implements OnInit, AfterViewInit {

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiper!: Swiper;

  @Input() tags: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      slidesPerView: 'auto',
      freeMode: {
        enabled: true,
      },
      mousewheel: {
        invert: true,
      },
    });
  }

}
