import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate, Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { GlobalService } from '../service/global.service';
import { StorageService } from '../service/storage.service';
import { FeedbackService } from '../service/feedback.service';
import { Author } from '../repository/entities/author.entity';

/** @description 로그인 안 한 유저가 접근시 차단 */
@Injectable({
  providedIn: 'root',
})
export class LoginAuthGuard implements CanActivate {
  constructor(
    private feedBackService: FeedbackService,
    private globalService: GlobalService,
    private storageService: StorageService,
    private router: Router,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const loginAuthor: Author = this.storageService.getAuthor();

    if (!loginAuthor) {
      await this.storageService.removeAuthor();
      this.feedBackService.openFeedback('로그인 후 이용해주세요.');
      this.router.navigateByUrl('').then();

      return false;
    }

    return true;
  }
}
