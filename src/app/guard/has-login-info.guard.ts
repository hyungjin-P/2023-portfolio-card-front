import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { FeedbackService } from '../service/feedback.service';
import { StorageService } from '../service/storage.service';
import { Author } from '../repository/entities/author.entity';


/** @description 로그인 한 유저가 접근시 차단 */
@Injectable({
  providedIn: 'root',
})
export class HasLoginInfoGuard implements CanActivate {
  constructor(
    private feedBackService: FeedbackService,
    private storageService: StorageService,
    private router: Router,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const loginAuthor: Author = this.storageService.getAuthor();

    if (loginAuthor) {
      this.feedBackService.openFeedback('잘못된 접근입니다.');
      this.router.navigateByUrl('editor').then();

      return false;
    }

    return true;
  }
}
