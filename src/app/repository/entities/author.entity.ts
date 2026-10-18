import {CommonEntity} from './common/common.entity';
import { Portfolio } from './portfolio.entity';
import { AuthorProfile } from './author-profile.entity';

/** @description 사용자 정보 */
export class Author extends CommonEntity {
  /**
   * @description 서비스 제공자
   * @example crackit.com
   * */
  provider?: string;

  /**
   * @description 서비스 제공자 id (해당 provider가 제공)
   * @example sample-user@example.com or REDACTED_PROVIDER_ID_EXAMPLE
   * */
  providerId?: string;

  /**
   * @description 가입 명
   * */
  name?: string;

  /** @description 비밀번호 */
  password?: string;

  /** @description 이메일 */
  email?: string;

  /** @description 계정 잠금 기본, false*/
  isLock?: boolean;

  /** @description 임시 사용자 :: 기본: true*/
  isTemporaryAuthor?: boolean;

  // /** @description 유저 프로필  */
  // authorProfiles: AuthorProfile[];

  /** @description 포트폴리오  */
  portfolios?: Portfolio[];

  authorLink?: string;
}
