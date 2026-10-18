import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/service/loading.service';

@Component({
  selector: 'app-shared-loading-test',
  templateUrl: './shared-loading-test.component.html',
  styleUrls: ['./shared-loading-test.component.scss']
})
export class SharedLoadingTestComponent implements OnInit {

  constructor(
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
  }

  loadingStart(): void {
    this.loadingService.loadingStart();

    setTimeout(() => {
      this.loadingService.loadingEnd();
    }, 10000);

  }


}
