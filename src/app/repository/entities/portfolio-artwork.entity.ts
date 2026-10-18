import { CommonEntity } from './common/common.entity';
import { PortfolioArtWorkBlock } from './portfolio-artwork-block.entity';

/** @description 포트폴리오 작품관리 */
export class PortfolioArtWork extends CommonEntity {

  portfolioId?: string;

  title?: string;

  description?: string;

  portfolioArtWorkBlocks?: PortfolioArtWorkBlock[];

}
