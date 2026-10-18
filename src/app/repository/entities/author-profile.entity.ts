import { CommonEntity } from './common/common.entity';
import { Author } from './author.entity';

/** @description 사용자 프로필 */
export class AuthorProfile extends CommonEntity {
  authorId?: string;

  profileImageUrl?: string;

  phoneNumber?: string;

  email?: string;

  author?: Author;
}
