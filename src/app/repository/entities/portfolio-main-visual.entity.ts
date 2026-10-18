import { CommonEntity } from './common/common.entity';
import { Portfolio } from './portfolio.entity';
import { PortfolioMainVisualTag } from './portfolio-main-visual-tag.entity';
import { PortfolioMainVisualTheme } from './portfolio-main-visual-theme.entity';

/** @description 포트폴리오 메인 비주얼 */
export class PortfolioMainVisual extends CommonEntity {
  portfolioId?: string;

  name?: string;

  mainVisualUrl?: string;

  nickName?: string;

  subTitle?: string;

  portfolio?: Portfolio;

  portfolioMainVisualTags?: PortfolioMainVisualTag[];

  portfolioMainVisualThemes?: PortfolioMainVisualTheme[];
}
