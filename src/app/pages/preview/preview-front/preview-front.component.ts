import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { Author } from '../../../repository/entities/author.entity';
import { StorageService } from '../../../service/storage.service';
import { PortfolioMainVisualService } from '../../../repository/api/portfolio-main-visual.service';
import { PortfolioMainVisual } from '../../../repository/entities/portfolio-main-visual.entity';
import { Portfolio } from '../../../repository/entities/portfolio.entity';
import { PortfolioMainVisualTag } from '../../../repository/entities/portfolio-main-visual-tag.entity';
import {
  SharedNoticeDialogComponent,
  SharedNoticeDialogData
} from "../../../components/shared/shared-notice-dialog/shared-notice-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {
  DialogShareLinkComponent
} from "../../../components/template/dialog/dialog-share-link/dialog-share-link.component";

@Component({
  selector: 'portfolio-preview-front',
  templateUrl: './preview-front.component.html',
  styleUrls: ['./preview-front.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PreviewFrontComponent implements OnInit {
  @Input() portfolioId: string = '';

  loginAuthor?: Author;
  portfolioMainVisual?: PortfolioMainVisual;
  backgroundSrc?: string = '';
  tags: PortfolioMainVisualTag[] = [];

  constructor(
    private storageService: StorageService,
    private portfolioMainVisualService: PortfolioMainVisualService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.loginAuthor = this.storageService.getAuthor();

    if (this.portfolioId) {
      this.portfolioMainVisualService
        .findOne(this.portfolioId)
        .subscribe((portfolioMainVisual) => {
          this.portfolioMainVisual = portfolioMainVisual;
          if (this.portfolioMainVisual?.portfolioMainVisualTags) {
            this.tags = [ ...this.portfolioMainVisual?.portfolioMainVisualTags ] ;
          }
          this.backgroundSrc = portfolioMainVisual?.mainVisualUrl;
        });
    }
  }

  getBackgroundStyle(): string {
    let resultStyle = '';

    if (this.backgroundSrc) {
      resultStyle = `url(${this.backgroundSrc})`;
    }

    return resultStyle;
  }

  /** @description 링크 공유 dialog 열기 */
  clickButtonExternalLink(): void {
    const dialogData: SharedNoticeDialogData = {
      closeButtonText: '닫기',
      innerContent: DialogShareLinkComponent
    };


    const dialogRef = this.dialog.open(SharedNoticeDialogComponent, {
      data: dialogData,
      panelClass: 'shared-notice-dialog',
    });

    dialogRef.afterClosed().subscribe();
  }

}
