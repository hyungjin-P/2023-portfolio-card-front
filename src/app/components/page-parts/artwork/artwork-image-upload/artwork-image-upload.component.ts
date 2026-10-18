import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter, Input,
  OnInit, Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {register} from 'swiper/element/bundle';
import {Swiper, SwiperOptions} from 'swiper';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {
  SharedNoticeDialogComponent,
  SharedNoticeDialogData
} from "../../../shared/shared-notice-dialog/shared-notice-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {
  GuideArtworkImageUploadComponent
} from "../../../template/dialog/guide-artwork-image-upload/guide-artwork-image-upload.component";
import {FeedbackService} from "../../../../service/feedback.service";
import {PortfolioArtWorkBlockPicture} from "../../../../repository/entities/portfolio-artwork-block-picture.entity";
import {FileEntity} from "../../../../repository/entities/file.entity";

register();

@Component({
  selector: 'editor-artwork-image-upload',
  templateUrl: './artwork-image-upload.component.html',
  styleUrls: ['./artwork-image-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArtworkImageUploadComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('swiperScrollbar') swiperScrollbar!: ElementRef;

  @Input() pictures?: PortfolioArtWorkBlockPicture[];

  @Output() fileChange: EventEmitter<any> = new EventEmitter<FileList>();
  @Output() deleteItem: EventEmitter<any> = new EventEmitter<string>();

  artWorks: any[] = [];
  swiper!: Swiper;

  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
  ) {
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.artWorks, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      slidesPerView: 'auto',
      freeMode: {
        enabled: true,
        sticky: false,
      },
      scrollbar: {
        el: this.swiperScrollbar.nativeElement,
        draggable: true,
      },
      mousewheel: {
        invert: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });


  }

  ngAfterContentInit(): void{
    if(this.pictures && this.pictures.length > 0){
      this.setFilesItemOnPicture(this.pictures);
    }
  }

  next(): void {
    this.swiper.slideNext();
  }

  fileChangeEvent(imageFile: any): void {
    const files: FileList = imageFile.files;

    if (!imageFile && imageFile?.length === 0) {
      return;
    }

    if(imageFile?.length + this.artWorks.length > 10){
      this.feedbackService.openFeedback('최대 10장까지 저장할 수 있습니다. 다시 선택해주세요.');
      return;
    }

    this.fileChange.emit(files);
  }

  setFilesItemOnFile(files: FileEntity[]): void {
    if (this.artWorks.length < 10) {
      files.map((picture)=>{
        this.artWorks.push({
          id: picture.originalUrl,
          url: picture.url,
        });
      });

      setTimeout(() => {
        this.swiper.update();
      });
    }
  }

  setFilesItemOnPicture(portfolioArtWorkBlockPictures: PortfolioArtWorkBlockPicture[]): void {
    if (this.artWorks.length < 10) {
      this.artWorks = [];
      portfolioArtWorkBlockPictures.map((picture)=>{
        this.artWorks.push({
          id: picture.id,
          portfolioArtWorkBlockId: picture.portfolioArtWorkBlockId,
          sortNumber: picture.sortNumber,
          url: picture.url,
          createdAt: picture.createdAt,
          deletedAt: picture.deletedAt,
          updatedAt: picture.updatedAt,
        });
      });

      setTimeout(() => {
        this.swiper.update();
      });
    }
  }

  deleteItemEvent(artwork :any): void {
    this.artWorks.pop();

    setTimeout(() => {
      this.swiper.update();
    });

    this.deleteItem.emit(artwork.id);
  }

  getArtworks(): any[] {
    return this.artWorks;
  }

  openGuide(): void {
    const dialogData: SharedNoticeDialogData = {
      innerContent: GuideArtworkImageUploadComponent,
    };

    const dialogRef = this.dialog.open(SharedNoticeDialogComponent, {
      data: dialogData,
      panelClass: 'shared-notice-dialog',
    });

    dialogRef.afterClosed().subscribe();
  }

}
