import {CommonEntity} from './common/common.entity';

/** @description 포트폴리오 작가이력 (프로필관리) 수상내역 */
export class PortfolioHistoryAward extends CommonEntity {

  portfolioHistoryId?: string;

  title?: string;

  subtitles?: PortfolioHistoryAwardSubtitle[];

}

/** @description 포트폴리오 작가이력 (프로필관리) 수상내역 > 연도 */
export class PortfolioHistoryAwardSubtitle extends CommonEntity {

  portfolioHistoryAwardId?: string;

  subtitle?: string;

  values?: PortfolioHistoryAwardSubtitleValue[];
}

/** @description 포트폴리오 작가이력 (프로필관리) 수상내역 > 연도 > 연도별 내용 */
export class PortfolioHistoryAwardSubtitleValue extends CommonEntity {

  portfolioHistoryAwardSubtitleId?: string;

  value?: string;
}
