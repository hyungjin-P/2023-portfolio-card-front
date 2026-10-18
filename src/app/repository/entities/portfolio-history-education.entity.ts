import {CommonEntity} from './common/common.entity';

/** @description 포트폴리오 작가이력 (프로필관리) 학력정보 */
export class PortfolioHistoryEducation extends CommonEntity {
  portfolioHistoryId?: string;

  title?: string;

  subtitles?: PortfolioHistoryEducationSubtitle[];

  isError = false;
}

/** @description 포트폴리오 작가이력 (프로필관리) 학력정보 > 연도 */
export class PortfolioHistoryEducationSubtitle extends CommonEntity {
  portfolioHistoryEducationId?: string;

  subtitle?: any;

  values?: PortfolioHistoryEducationSubtitleValue[];
}


/** @description 포트폴리오 작가이력 (프로필관리) 학력정보 > 연도 > 연도별 내용 */
export class PortfolioHistoryEducationSubtitleValue extends CommonEntity {
  portfolioHistoryEducationSubtitleId?: string;

  value?: any;
}
