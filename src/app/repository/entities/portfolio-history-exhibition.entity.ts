import {CommonEntity} from './common/common.entity';

/** @description 포트폴리오 작가이력 (프로필관리) 전시이력 */
export class PortfolioHistoryExhibition extends CommonEntity {

  portfolioHistoryId?: string;

  title?: string;

  subtitles?: PortfolioHistoryExhibitionSubtitle[];
}

/** @description 포트폴리오 작가이력 (프로필관리) 전시이력 > 연도 */
export class PortfolioHistoryExhibitionSubtitle extends CommonEntity {

  portfolioHistoryExhibitionId?: string;

  subtitle?: string;

  values?: PortfolioHistoryExhibitionSubtitleValue[];
}

/** @description 포트폴리오 작가이력 (프로필관리) 전시이력 > 연도 > 연도별 내용 */
export class PortfolioHistoryExhibitionSubtitleValue extends CommonEntity {

  portfolioHistoryExhibitionSubtitleId?: string;

  value?: string;
}
