import { CommonEntity } from './common/common.entity';
import { PortfolioMainVisual } from './portfolio-main-visual.entity';

/** @description 포트폴리오 메인 비주얼 테마 */
export class PortfolioMainVisualTheme extends CommonEntity {
  portfolioMainVisualId?: string;

  controllerClass?: string;

  shareButtonClass?: string;

  titleClass?: string;

  subTitleClass?: string;

  tagClass?: string;

  portfolioMainVisual?: PortfolioMainVisual;
}
