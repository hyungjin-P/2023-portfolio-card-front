import { Component, OnInit } from '@angular/core';
import {GlobalService} from "../../service/global.service";
import { StorageService } from '../../service/storage.service';
import { Author } from '../../repository/entities/author.entity';
import { PortfolioService } from '../../repository/api/portfolio.service';
import {HeaderElementType} from "../../components/shared/shared-header/shared-header.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  loginAuthor: Author = this.storageService.getAuthor();

  constructor(
    private storageService: StorageService,
    private globalService: GlobalService,
    private portfolioService: PortfolioService,
    private router: Router,
  ) {
    this.globalService.sendHeaderTypeSubject(HeaderElementType.LOGO);
  }

  ngOnInit(): void {}

  goPreview(): void {
    // const moveUrl = `preview/${this.loginAuthor.id}`;
    const moveUrl = `${this.loginAuthor.authorLink}`;
    this.router.navigateByUrl(moveUrl).then();
  }

}
