import {CommonEntity} from './common/common.entity';

/** @description 포트폴리오 작가이력 (프로필관리) 기본정보 */
export class PortfolioHistoryGeneral extends CommonEntity {

  portfolioHistoryId?: string;

  generalImageUrl?: string;

  nickname?: string;
}
