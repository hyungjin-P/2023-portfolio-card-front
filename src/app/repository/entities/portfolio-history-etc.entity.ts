import {CommonEntity} from './common/common.entity';

/** @description 포트폴리오 작가이력 (프로필관리) > 기타이력 */
export class PortfolioHistoryEtc extends CommonEntity {

  portfolioHistoryId?: string;

  title?: string;

  subtitles?: PortfolioHistoryEtcSubtitle[];
}

/** @description 포트폴리오 작가이력 (프로필관리) > 기타이력 */
export class PortfolioHistoryEtcSubtitle extends CommonEntity {

  portfolioHistoryEtcId?: string;

  subtitle?: string;

  values?: PortfolioHistoryEtcSubtitleValue[];
}

/** @description 포트폴리오 작가이력 (프로필관리) > 기타이력 > 내용 */
export class PortfolioHistoryEtcSubtitleValue extends CommonEntity {

  portfolioHistoryEtcSubtitleId?: string;

  value?: string;
}
