import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../service/storage.service';
import {Author} from '../repository/entities/author.entity';
import {LoadingService} from '../service/loading.service';
import { GlobalService } from '../service/global.service';
import { HeaderElementType } from '../components/shared/shared-header/shared-header.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {

  HeaderElementType = HeaderElementType;

  /** @description 로그인 여부 */
  isLogin : boolean = false;

  /** @description 헤더에 로고 유무 여부 */
  isLogo : boolean = false;

  nowHeaderType: HeaderElementType = this.HeaderElementType.LOGO;

  constructor(
    private loadingService: LoadingService,
    private storageService: StorageService,
    private globalService: GlobalService,
    private router: Router,
  ) {
    /* 로그인 감지 */
    this.globalService
      .authorSubjectObservable()
      .subscribe({
        next: (author: Author) => {
          this.isLogin = !!author
        },
        error: () => {
        }
      });

    /* 헤더 타입 감지 */
    this.globalService
      .headerTypeSubjectObservable()
      .subscribe({
        next: (headerType) => {
          this.nowHeaderType = headerType;
        },
        error: () => {}
      })

  }

  ngOnInit(): void {
    this.isLogin = !!this.storageService.getAuthor();
  }

  async goToLogin(): Promise<void> {
    await this.router.navigateByUrl('/login');
  }

  goBack(): void {
    window.history.back();
  }

  clickClose(): void {
    this.router.navigateByUrl('/home').then();
  }

  closePreview(): void {
    this.router.navigateByUrl('/editor').then();
  }

}
