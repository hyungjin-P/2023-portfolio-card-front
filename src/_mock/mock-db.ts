// 메모리 목업 DB. back 서비스의 동작을 화면이 보는 만큼만 흉내 낸다(근거 행은 각 함수 주석).
// 새로고침(page.goto 포함)하면 시드로 돌아간다. 로그인 정보는 원본대로 sessionStorage 에 남는다.
import { Author } from '../app/repository/entities/author.entity';
import { FileEntity } from '../app/repository/entities/file.entity';
import { Portfolio } from '../app/repository/entities/portfolio.entity';
import { PortfolioArtWork } from '../app/repository/entities/portfolio-artwork.entity';
import { PortfolioArtWorkBlock } from '../app/repository/entities/portfolio-artwork-block.entity';
import { PortfolioArtWorkBlockPicture } from '../app/repository/entities/portfolio-artwork-block-picture.entity';
import { PortfolioHistoryContact } from '../app/repository/entities/portfolio-history-contact.entity';
import { PortfolioHistoryGeneral } from '../app/repository/entities/portfolio-history-general.entity';
import { PortfolioMainVisual } from '../app/repository/entities/portfolio-main-visual.entity';
import { PortfolioMainVisualTag } from '../app/repository/entities/portfolio-main-visual-tag.entity';
import { JoinAuthorDto, LoginAuthorDto } from '../app/repository/api/author.service';
import { PortfolioMainVisualSaveInItemDto } from '../app/repository/api/portfolio-main-visual.service';

import { createSeed, HistorySection, HistorySubtitle, HistoryValue, MockHistory, SECTION_KINDS, SectionKind } from './fixtures/seed';

/** back 의 HttpException(status, {message}) 에 해당한다 */
export class MockHttpError {
  constructor(public status: number, public message: string) {}
}

const db = createSeed();

const newId = (): string =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
const now = () => ({ createdAt: new Date(), updatedAt: new Date() });
/** back·front 공통 암묵 계약: 임시 ID('1','2'…)는 신규, UUID(36자)는 기존 행 (award.service.ts:58 등) */
const isSaved = (id: unknown): id is string => typeof id === 'string' && id.length > 5;
const byUpdatedDesc = (a: { updatedAt?: Date }, b: { updatedAt?: Date }) => +(b.updatedAt ?? 0) - +(a.updatedAt ?? 0);

function must<T>(value: T | undefined, message: string): T {
  if (value === undefined) throw new MockHttpError(500, message);
  return value;
}

// ── author (back author.service.ts) ─────────────────────────────

export function isDuplicateAuthorLink(authorLink: string | null): boolean {
  return db.authors.some((a) => a.authorLink === authorLink);
}

/** 같은 링크의 정회원이 있으면 500, 아니면 새 행을 만든다(임시 작가 행을 고치지 않는다 — back 과 같음) */
export function joinAuthor(dto: JoinAuthorDto): Author {
  if (db.authors.some((a) => !a.isTemporaryAuthor && a.authorLink === dto.authorLink)) {
    throw new MockHttpError(500, '이미 등록된 사용자가 존재합니다.');
  }
  const author = {
    id: newId(),
    provider: null,
    providerId: null,
    name: null,
    password: dto.password,
    email: dto.email,
    isLock: true,
    isTemporaryAuthor: false,
    authorLink: dto.authorLink,
    serviceTerm: dto.serviceTerm,
    ...now(),
    deletedAt: null,
  } as unknown as Author;
  db.authors.push(author);
  return author;
}

/** 링크·비밀번호(평문 비교)가 맞는 정회원 1명. 원본처럼 비밀번호가 응답에 들어 있다 */
export function loginAuthor(dto: LoginAuthorDto): Author {
  const found = db.authors.filter((a) => a.authorLink === dto.authorLink && a.password === dto.password && !a.isTemporaryAuthor);
  if (found.length === 0) throw new MockHttpError(500, '사용자가 없습니다.');
  return found[0];
}

export function getAuthorByAuthorLink(authorLink: string | null): Author | null {
  const author = db.authors.find((a) => a.authorLink === authorLink);
  return author ? { ...author, portfolios: db.portfolios.filter((p) => p.authorId === author.id) } : null;
}

// ── portfolio (back portfolio.service.ts createNewPortfolio, art-work.service.ts initArtwork) ──

/** 작가의 첫 포트폴리오, 없으면 만든다 */
export function createNewPortfolio(authorId: string | undefined): Portfolio {
  const found = db.portfolios.find((p) => p.authorId === authorId);
  if (found) return found;
  const portfolio: Portfolio = { id: newId(), authorId, ...now() };
  db.portfolios.push(portfolio);
  return portfolio;
}

function recentPortfolio(authorId: string | null): Portfolio {
  const list = db.portfolios.filter((p) => p.authorId === authorId).sort(byUpdatedDesc);
  if (list[0]) return list[0];
  const portfolio: Portfolio = { id: newId(), authorId: authorId ?? undefined, title: '', description: '', ...now() };
  db.portfolios.push(portfolio);
  return portfolio;
}

// ── main visual (back main-visual.service.ts findOne·saveMainVisualAndInItem) ──

export function findMainVisual(portfolioId: string | null): PortfolioMainVisual | null {
  const list = db.mainVisuals.filter((m) => m.portfolioId === portfolioId).sort(byUpdatedDesc);
  if (!list[0]) return null;
  const themes = list[0].portfolioMainVisualThemes ?? [];
  return { ...list[0], portfolioMainVisualThemes: themes.slice(0, 1) };
}

/** mainVisualId 가 있으면 갱신하고 태그를 통째로 바꾼다. 응답은 대표화면 + 저장한 태그 */
export function saveMainVisual(dto: PortfolioMainVisualSaveInItemDto): PortfolioMainVisual {
  const existing = dto.mainVisualId ? db.mainVisuals.find((m) => m.id === dto.mainVisualId) : undefined;
  const mainVisual: PortfolioMainVisual = existing ?? { id: newId(), createdAt: new Date(), portfolioMainVisualThemes: [] };
  Object.assign(mainVisual, {
    portfolioId: dto.portfolioId,
    name: dto.name,
    mainVisualUrl: dto.mainVisualUrl,
    nickName: dto.nickName,
    subTitle: dto.subTitle,
    updatedAt: new Date(),
  });
  const tags: PortfolioMainVisualTag[] = (dto.portfolioMainVisualTags ?? []).map((t) => ({
    id: t.id ?? newId(),
    portfolioMainVisualId: mainVisual.id,
    content: t.content,
    ...now(),
  }));
  mainVisual.portfolioMainVisualTags = tags;
  if (!existing) db.mainVisuals.push(mainVisual);
  const { portfolioMainVisualThemes: _themes, ...saved } = mainVisual;
  return saved;
}

// ── art work (back art-work.service.ts·art-work-block.service.ts·art-work-picture.service.ts) ──

/** 최근 포트폴리오(없으면 생성)의 작품(없으면 생성). 블록은 sortNumber 오름차순 + 사진 포함 */
export function initArtWork(authorId: string | null): PortfolioArtWork {
  const portfolio = recentPortfolio(authorId);
  let artWork = db.artWorks.find((w) => w.portfolioId === portfolio.id);
  if (!artWork) {
    artWork = { id: newId(), portfolioId: portfolio.id, ...now(), portfolioArtWorkBlocks: [] };
    db.artWorks.push(artWork);
  }
  const blocks = [...(artWork.portfolioArtWorkBlocks ?? [])].sort((a, b) => (a.sortNumber ?? 0) - (b.sortNumber ?? 0));
  return { ...artWork, portfolioArtWorkBlocks: blocks };
}

function findBlock(id: string | undefined): { artWork: PortfolioArtWork; block: PortfolioArtWorkBlock } | undefined {
  for (const artWork of db.artWorks) {
    const block = artWork.portfolioArtWorkBlocks?.find((b) => b.id === id);
    if (block) return { artWork, block };
  }
  return undefined;
}

type BlockBody = PortfolioArtWorkBlock & { isOpened?: boolean; options?: unknown };

/**
 * front 는 생성(create)과 수정(save) 모두 /save 로 보낸다(portfolio-artwork-block.service.ts:39).
 * id 가 있으면 컬럼만 갱신, 없으면 새 블록(기본 blockType image·visibility true). 응답에 사진 배열은 없다(back 과 같음).
 */
export function saveBlock(body: BlockBody): PortfolioArtWorkBlock {
  const found = body.id ? findBlock(body.id) : undefined;
  if (found) {
    const { block } = found;
    for (const key of ['blockType', 'sortNumber', 'title', 'description', 'visibility'] as const) {
      if (body[key] !== undefined) Object.assign(block, { [key]: body[key] });
    }
    block.updatedAt = new Date();
    const { portfolioArtWorkPictures: _pictures, ...saved } = block;
    return saved;
  }
  const artWork = must(db.artWorks.find((w) => w.id === body.portfolioArtWorkId), '포트폴리오 작품 블럭 생성 실패');
  const block: PortfolioArtWorkBlock = {
    id: newId(),
    portfolioArtWorkId: artWork.id,
    blockType: body.blockType ?? 'image',
    sortNumber: body.sortNumber ?? 0,
    title: undefined,
    description: undefined,
    visibility: true,
    ...now(),
  };
  artWork.portfolioArtWorkBlocks = [...(artWork.portfolioArtWorkBlocks ?? []), { ...block, portfolioArtWorkPictures: [] }];
  return block;
}

export function deleteBlock(id: string | null): null {
  const found = findBlock(id ?? undefined);
  if (found) found.artWork.portfolioArtWorkBlocks = found.artWork.portfolioArtWorkBlocks?.filter((b) => b !== found.block);
  return null;
}

export function createPicture(body: { portfolioArtWorkBlockId?: string; url?: string; sortNumber?: number }): PortfolioArtWorkBlockPicture {
  const { block } = must(findBlock(body.portfolioArtWorkBlockId), '작품 블록이 없습니다.');
  const picture: PortfolioArtWorkBlockPicture = {
    id: newId(),
    portfolioArtWorkBlockId: block.id,
    url: body.url,
    sortNumber: body.sortNumber,
    ...now(),
  };
  block.portfolioArtWorkPictures = [...(block.portfolioArtWorkPictures ?? []), picture];
  return picture;
}

export function deletePicture(id: string | null): null {
  for (const artWork of db.artWorks) {
    for (const block of artWork.portfolioArtWorkBlocks ?? []) {
      block.portfolioArtWorkPictures = block.portfolioArtWorkPictures?.filter((p) => p.id !== id);
    }
  }
  return null;
}

export function saveFile(authorId: string, file: { url: string; name: string; type: string; size: number }): FileEntity {
  return { id: newId(), authorId, url: file.url, mimeType: file.type, size: file.size, createdAt: new Date() };
}

// ── history (back portfolio-history*.service.ts) ─────────────────

function historyOf(id: string | null): MockHistory {
  return must(db.histories.find((h) => h.id === id), '이력 정보가 없습니다.');
}

/** 포트폴리오의 이력 행(관계 없이), 없으면 만든다. 공개 플래그 기본 true */
export function createHistory(portfolioId: string | null): Omit<MockHistory, (typeof SECTION_KINDS)[SectionKind] | 'portfolioHistoryGenerals' | 'portfolioHistoryContacts'> {
  let history = db.histories.find((h) => h.portfolioId === portfolioId);
  if (!history) {
    history = {
      id: newId(),
      portfolioId: portfolioId ?? undefined,
      generalIsPublic: true,
      contactIsPublic: true,
      educationIsPublic: true,
      exhibitionIsPublic: true,
      awardIsPublic: true,
      etcIsPublic: true,
      snsIsPublic: true,
      ...now(),
      portfolioHistoryGenerals: [],
      portfolioHistoryContacts: [],
      portfolioHistoryEducations: [],
      portfolioHistoryExhibitions: [],
      portfolioHistoryAwards: [],
      portfolioHistoryEtc: [],
    };
    db.histories.push(history);
  }
  const {
    portfolioHistoryGenerals: _g,
    portfolioHistoryContacts: _c,
    portfolioHistoryEducations: _e,
    portfolioHistoryExhibitions: _x,
    portfolioHistoryAwards: _a,
    portfolioHistoryEtc: _o,
    ...row
  } = history;
  return row;
}

export function getAllHistory(portfolioId: string | null): MockHistory | null {
  return db.histories.find((h) => h.portfolioId === portfolioId) ?? null;
}

/** 기본정보·연락처: 이력당 1행 get-or-create */
export function createGeneral(historyId: string | null): PortfolioHistoryGeneral {
  const history = historyOf(historyId);
  const list = (history.portfolioHistoryGenerals ??= []);
  if (!list[0]) list.push({ id: newId(), portfolioHistoryId: history.id, ...now() });
  return list[0];
}

export function saveGeneral(body: PortfolioHistoryGeneral): PortfolioHistoryGeneral {
  const general = createGeneral(body.portfolioHistoryId ?? null);
  Object.assign(general, { nickname: body.nickname, generalImageUrl: body.generalImageUrl, updatedAt: new Date() });
  return general;
}

export function createContact(historyId: string | null): PortfolioHistoryContact {
  const history = historyOf(historyId);
  const list = (history.portfolioHistoryContacts ??= []);
  if (!list[0]) list.push({ id: newId(), portfolioHistoryId: history.id, ...now() });
  return list[0];
}

export function saveContact(body: PortfolioHistoryContact): PortfolioHistoryContact {
  const contact = createContact(body.portfolioHistoryId ?? null);
  Object.assign(contact, { tel: body.tel, email: body.email, updatedAt: new Date() });
  return contact;
}

// 이력 4영역(학력·전시·수상·기타) — 3계층 구조가 같다

const parentKey = (kind: SectionKind) => `portfolioHistory${kind[0].toUpperCase()}${kind.slice(1)}Id`;
const subtitleParentKey = (kind: SectionKind) => parentKey(kind).replace(/Id$/, 'SubtitleId');

export function getSections(kind: SectionKind, historyId: string | null): HistorySection[] {
  return historyOf(historyId)[SECTION_KINDS[kind]];
}

/**
 * 블록 배열을 통째로 받아 ID 길이로 수정/생성을 가른다. 지운 항목은 별도 delete 호출로 처리된다(saveData 는 지우지 않는다).
 * 학력은 subtitles[0].values[0] 한 줄만 저장한다(back education.service.ts saveData).
 */
export function saveSections(kind: SectionKind, historyId: string | null, blocks: HistorySection[]): HistorySection[] {
  const sections = getSections(kind, historyId);
  const portfolioHistoryId = must(historyOf(historyId).id, '이력 정보가 없습니다.');
  for (const block of Array.isArray(blocks) ? blocks : []) {
    let section = isSaved(block.id) ? sections.find((s) => s.id === block.id) : undefined;
    if (!section) {
      section = { id: newId(), portfolioHistoryId, title: kind === 'education' ? '' : block.title, ...now(), subtitles: [] };
      sections.push(section);
    } else if (kind !== 'education') {
      section.title = block.title;
    }
    const incoming = kind === 'education' ? (block.subtitles ?? []).slice(0, 1) : block.subtitles ?? [];
    for (const sub of incoming) {
      let subtitle: HistorySubtitle | undefined = isSaved(sub.id) ? section.subtitles.find((s) => s.id === sub.id) : undefined;
      if (!subtitle) {
        subtitle = { id: newId(), [parentKey(kind)]: section.id, subtitle: sub.subtitle, ...now(), values: [] };
        section.subtitles.push(subtitle);
      } else {
        subtitle.subtitle = sub.subtitle;
      }
      const values = kind === 'education' ? (sub.values ?? []).slice(0, 1) : sub.values ?? [];
      for (const val of values) {
        const value: HistoryValue | undefined = isSaved(val.id) ? subtitle.values.find((v) => v.id === val.id) : undefined;
        if (value) value.value = val.value;
        else subtitle.values.push({ id: newId(), [subtitleParentKey(kind)]: subtitle.id, value: val.value, ...now() });
      }
    }
  }
  return sections;
}

export function deleteSection(kind: SectionKind, id: string | null): null {
  for (const history of db.histories) {
    history[SECTION_KINDS[kind]] = history[SECTION_KINDS[kind]].filter((s) => s.id !== id);
  }
  return null;
}

export function deleteSubtitle(kind: SectionKind, id: string | null): null {
  for (const history of db.histories) {
    for (const section of history[SECTION_KINDS[kind]]) section.subtitles = section.subtitles.filter((s) => s.id !== id);
  }
  return null;
}

export function deleteValue(kind: SectionKind, id: string | null): null {
  for (const history of db.histories) {
    for (const section of history[SECTION_KINDS[kind]]) {
      for (const subtitle of section.subtitles) subtitle.values = subtitle.values.filter((v) => v.id !== id);
    }
  }
  return null;
}
