import {CommonEntity} from './common/common.entity';
import {PortfolioArtWorkBlockPicture} from "./portfolio-artwork-block-picture.entity";

/** @description 포트폴리오 작품관리 블록 */
export class PortfolioArtWorkBlock extends CommonEntity {

  portfolioArtWorkId?: string;

  blockType?: string;

  sortNumber?: number;

  title?: string;

  description?: string;

  visibility?: boolean;

  portfolioArtWorkPictures?: PortfolioArtWorkBlockPicture[];

}
