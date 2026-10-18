import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { LoadingService } from '../../../service/loading.service';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'shared-loading',
  templateUrl: './shared-loading.component.html',
  styleUrls: ['./shared-loading.component.scss'],
})
export class SharedLoadingComponent implements OnInit, AfterViewInit {
  isLoading = false;

  @Output() loadingStart = new EventEmitter<boolean>();

  @Output() loadingEnd = new EventEmitter<boolean>();

  lottieOptions: AnimationOptions = {
    path: '/assets/lottie/lottie_spinner.json',
    autoplay: true,
    loop: true,
  };

  anim?: AnimationItem;

  @ViewChild('loadingLottie') loadingLottie!: LottieComponent;

  constructor(private loadingService: LoadingService) {
    this.loadingService.getLoadingObserver().subscribe({
      next: (isLoading) => {
        this.isLoading = isLoading;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  loadingStartEvent(): void {
    this.loadingStart.emit();
  }

  loadingEndEvent(): void {
    this.loadingEnd.emit();
  }

  handleAnimation(anim: AnimationItem): void {
    this.anim = anim;
  }
}
