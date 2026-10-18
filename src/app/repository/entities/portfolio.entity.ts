import { CommonEntity } from './common/common.entity';
import { Author } from './author.entity';
import { PortfolioMainVisual } from './portfolio-main-visual.entity';

/** @description 사용자 포트폴리오 */
export class Portfolio extends CommonEntity {
  authorId?: string;

  title?: string;

  description?: string;

  author?: Author;

  portfolioMainVisuals?: PortfolioMainVisual[];
}
