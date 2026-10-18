import { CommonEntity } from './common/common.entity';
import { PortfolioMainVisual } from './portfolio-main-visual.entity';

/** @description 포트폴리오 메인 비주얼 태그 */
export class PortfolioMainVisualTag extends CommonEntity {
  portfolioMainVisualId?: string;

  content?: string;

  portfolioMainVisual?: PortfolioMainVisual;
}
