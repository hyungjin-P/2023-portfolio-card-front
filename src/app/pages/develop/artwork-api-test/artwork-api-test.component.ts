import { Component, OnInit } from '@angular/core';
import { PortfolioArtworkService } from '../../../repository/api/portfolio-artwork.service';

@Component({
  selector: 'app-artwork-api-test',
  templateUrl: './artwork-api-test.component.html',
  styleUrls: ['./artwork-api-test.component.scss']
})
export class ArtworkApiTestComponent implements OnInit {

  authorId: string = '580bd217-be1d-4d11-bc41-2f0f73358cac';

  constructor(
    private artworkService: PortfolioArtworkService
  ) { }

  ngOnInit(): void {
  }

  findArtWork(): void {
    this.artworkService
      .initArtWork(this.authorId)
      .subscribe({
        next: (artwork) => {
          console.log('artwork : ', artwork);
        }
      })
  }

}
