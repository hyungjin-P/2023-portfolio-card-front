import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import Swiper, {Navigation, Pagination} from "swiper";
import {PortfolioArtWorkBlockPicture} from "../../../repository/entities/portfolio-artwork-block-picture.entity";

@Component({
  selector: 'app-shared-art-work-slider',
  templateUrl: './shared-art-work-slider.component.html',
  styleUrls: ['./shared-art-work-slider.component.scss']
})
export class SharedArtWorkSliderComponent implements OnInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiper!: Swiper;

  @Input() pictures?: PortfolioArtWorkBlockPicture[];

  swiperContents: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      // Optional parameters
      direction: 'horizontal',
      loop: false,
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  ngAfterContentInit(): void{
    if(this.pictures && this.pictures.length > 0){
      this.setSwiperOnPictures(this.pictures);
    }
  }

  private setSwiperOnPictures(pictures: PortfolioArtWorkBlockPicture[]) {
    pictures.map((picture)=>{
      this.swiperContents.push({
        id: picture.id,
        url: picture.url,
        sortNumber: picture.sortNumber,
      })
    });

    setTimeout(() => {
      this.swiper.update();
    });
  }
}
