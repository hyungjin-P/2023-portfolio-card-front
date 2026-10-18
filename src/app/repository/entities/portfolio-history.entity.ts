import {CommonEntity} from './common/common.entity';
import {PortfolioHistoryGeneral} from "./portfolio-history-general.entity";
import {PortfolioHistoryContact} from "./portfolio-history-contact.entity";
import {PortfolioHistoryEducation} from "./portfolio-history-education.entity";
import {PortfolioHistoryExhibition} from "./portfolio-history-exhibition.entity";
import {PortfolioHistoryAward} from "./portfolio-history-award.entity";
import {PortfolioHistoryEtc} from "./portfolio-history-etc.entity";

/** @description 포트폴리오 작가이력 (프로필관리) */
export class PortfolioHistory extends CommonEntity {

  portfolioId?: string;

  generalIsPublic?: boolean = true;
  contactIsPublic?: boolean;
  educationIsPublic?: boolean;
  exhibitionIsPublic?: boolean;
  awardIsPublic?: boolean;
  etcIsPublic?: boolean;
  snsIsPublic?: boolean;

  title?: string;

  description?: string;

  portfolioHistoryGenerals?: PortfolioHistoryGeneral[];
  portfolioHistoryContacts?: PortfolioHistoryContact[];
  portfolioHistoryEducations?: PortfolioHistoryEducation[];
  portfolioHistoryExhibitions?: PortfolioHistoryExhibition[];
  portfolioHistoryAwards?: PortfolioHistoryAward[];
  portfolioHistoryEtc?: PortfolioHistoryEtc[];
}
