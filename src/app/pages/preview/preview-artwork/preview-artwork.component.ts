import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
import {LoadingService} from "../../../service/loading.service";
import {PortfolioArtworkService} from "../../../repository/api/portfolio-artwork.service";
import {PortfolioArtWork} from "../../../repository/entities/portfolio-artwork.entity";

@Component({
  selector: 'preview-artwork',
  templateUrl: './preview-artwork.component.html',
  styleUrls: ['./preview-artwork.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PreviewArtworkComponent implements OnInit, AfterViewInit {

  portfolioWrapper = '.portfolio-wrapper'

  portfolioArtWork?: PortfolioArtWork;

  @ViewChild('artworkPanelRef') artworkPanelRef!: ElementRef;
  artworkPanel?: CupertinoPane;

  artworkPanelSettings: CupertinoSettings = {
    parentElement: this.portfolioWrapper,
    cssClass: 'artwork-panel',
    buttonDestroy: false,
    freeMode: false,
    animationType: 'ease',
    animationDuration: 600,
    lowerThanBottom: false,
    upperThanTop: false,
    initialBreak: 'middle',
    topperOverflow: true,
    touchAngle: 30,
    dragBy: ['.pane .draggable'],
    breaks: {
      top: {
        enabled: true,
        height: window.innerHeight,
      },
      middle: {
        enabled: true,
        height: window.innerWidth > 499 ? 90 : 50,
      },
      bottom: { enabled: false },
    },
  };

  constructor() { }

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    // 패널 정리
    const panelElement = this.artworkPanelRef?.nativeElement;

    this.artworkPanel = new CupertinoPane(
      panelElement,
      this.artworkPanelSettings,
    );

    this.artworkPanel.on('onDidDismiss', (event: any) => {
      this.showPane();
    });

    await this.showPane();
  }

  async showPane(): Promise<void> {

    if (!this.artworkPanel) {
      console.error('showing cupertinoPane failed!');
      return;
    }
    await this.artworkPanel.present({ animate: true });
  }

  async destroyPane(): Promise<void> {
    if (!this.artworkPanel) {
      return;
    }

    if (this.artworkPanel.isPanePresented()) {
      await this.artworkPanel.destroy({ animate: true });
    }
  }

  async hidePane(): Promise<void> {
    if (!this.artworkPanel) {
      return;
    }

    await this.artworkPanel.moveToBreak('middle');
  }

  setArtWork(artwork: PortfolioArtWork){
    this.portfolioArtWork = artwork;
  }

}
