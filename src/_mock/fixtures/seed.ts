// 목업 시드: 손으로 만든 가짜 작가 2명. 실사용자 데이터·실제 기관명을 쓰지 않는다(이름에 "가상·샘플·예시"를 붙임).
// 모양은 back 엔티티(portfolio-notes/portfolio-card-back/stage1-analysis.md 6절)를 따른다.
// ID 는 36자 UUID 형식 — 이력 saveData 의 `id.length > 5` 규칙(기존 행 수정 / 신규 생성)이 그대로 동작해야 한다.
import { Author } from '../../app/repository/entities/author.entity';
import { Portfolio } from '../../app/repository/entities/portfolio.entity';
import { PortfolioArtWork } from '../../app/repository/entities/portfolio-artwork.entity';
import { PortfolioHistory } from '../../app/repository/entities/portfolio-history.entity';
import { PortfolioMainVisual } from '../../app/repository/entities/portfolio-main-visual.entity';

const IMG = 'assets/mock/img';

/** 이력 4영역 공통 3계층. 부모 ID 키 이름이 영역마다 달라(portfolioHistoryAwardId 등) 인덱스 시그니처로 둔다 */
export interface HistoryValue { id: string; value: string; [key: string]: unknown }
export interface HistorySubtitle { id: string; subtitle: string; values: HistoryValue[]; [key: string]: unknown }
export interface HistorySection { id: string; portfolioHistoryId: string; title: string; subtitles: HistorySubtitle[]; [key: string]: unknown }

export const SECTION_KINDS = {
  education: 'portfolioHistoryEducations',
  exhibition: 'portfolioHistoryExhibitions',
  award: 'portfolioHistoryAwards',
  etc: 'portfolioHistoryEtc',
} as const;
export type SectionKind = keyof typeof SECTION_KINDS;
type SectionArrays = { [K in (typeof SECTION_KINDS)[SectionKind]]: HistorySection[] };

export type MockHistory = Omit<PortfolioHistory, (typeof SECTION_KINDS)[SectionKind]> & SectionArrays;

export interface MockSeed {
  authors: Author[];
  portfolios: Portfolio[];
  mainVisuals: PortfolioMainVisual[];
  artWorks: PortfolioArtWork[];
  histories: MockHistory[];
}

/** 고정 UUID: 앞자리로 종류를 구분한다 (a=작가, p=포트폴리오, m=대표화면, t=태그, w=작품, b=블록, c=사진, h=이력, …) */
const uid = (kind: string, n: number): string => `${kind.padEnd(8, '0')}-0000-4000-8000-${String(n).padStart(12, '0')}`;
const at = (day: number): Date => new Date(Date.UTC(2023, 11, day, 3, 0, 0));
const stamp = (day: number) => ({ createdAt: at(day), updatedAt: at(day) });

type Years = [string, string[]][];

/** 이력 4영역 공통 3계층(title → subtitles[연도] → values[내용]) */
function section(kind: string, historyId: string, parentKey: string, n: number, title: string, years: Years): HistorySection {
  const sid = uid(kind, n);
  return {
    id: sid,
    portfolioHistoryId: historyId,
    title,
    ...stamp(1 + n),
    subtitles: years.map(([year, values], i) => {
      const subId = uid(`${kind}s`, n * 10 + i);
      return {
        id: subId,
        [parentKey]: sid,
        subtitle: year,
        ...stamp(1 + n),
        values: values.map((value, j) => ({
          id: uid(`${kind}v`, n * 100 + i * 10 + j),
          [`${parentKey.replace(/Id$/, '')}SubtitleId`]: subId,
          value,
          ...stamp(1 + n),
        })),
      };
    }),
  };
}

function author(n: number, authorLink: string, name: string) {
  return {
    id: uid('a', n),
    provider: 'localhost',
    providerId: '',
    name,
    // 원본 back 은 로그인 응답에 비밀번호를 그대로 담는다(stage1 4절). 목업도 같은 모양을 흉내 낸다 — 더미 값
    password: 'sample1234',
    email: `${authorLink}@example.com`,
    isLock: true,
    isTemporaryAuthor: false,
    authorLink,
    serviceTerm: true,
    ...stamp(1),
  } as Author;
}

export function createSeed(): MockSeed {
  const a1 = author(1, 'sample-artist', '윤슬');
  const a2 = author(2, 'moonlit-studio', '달빛 공방');
  const p1 = { id: uid('p', 1), authorId: a1.id, title: '', description: '', ...stamp(1) };
  const p2 = { id: uid('p', 2), authorId: a2.id, title: '', description: '', ...stamp(1) };
  const h1 = uid('h', 1);
  const h2 = uid('h', 2);

  const pictures = (blockN: number, files: string[]) =>
    files.map((file, i) => ({
      id: uid('c', blockN * 10 + i),
      portfolioArtWorkBlockId: uid('b', blockN),
      url: `${IMG}/${file}.svg`,
      sortNumber: i + 1,
      ...stamp(3),
    }));
  const block = (n: number, artWorkId: string, sortNumber: number, blockType: string, title: string, description: string, files: string[]) => ({
    id: uid('b', n),
    portfolioArtWorkId: artWorkId,
    blockType,
    sortNumber,
    title,
    description,
    visibility: true,
    ...stamp(3),
    portfolioArtWorkPictures: pictures(n, files),
  });

  const history = (id: string, portfolioId: string) => ({
    id,
    portfolioId,
    // back 엔티티 기본값이 전부 true (portfolio-history.entity.ts:17-30)
    generalIsPublic: true,
    contactIsPublic: true,
    educationIsPublic: true,
    exhibitionIsPublic: true,
    awardIsPublic: true,
    etcIsPublic: true,
    snsIsPublic: true,
    ...stamp(2),
  });

  return {
    authors: [a1, a2],
    portfolios: [p1, p2],
    mainVisuals: [
      {
        id: uid('m', 1),
        portfolioId: p1.id,
        name: '포트폴리오',
        mainVisualUrl: `${IMG}/cover-dusk-mountains.svg`,
        nickName: '윤슬',
        subTitle: '빛과 물결 사이의 풍경을 그립니다.\n회화 · 드로잉 · 설치',
        ...stamp(2),
        portfolioMainVisualTags: ['회화', '풍경', '드로잉'].map((content, i) => ({ id: uid('t', 10 + i), portfolioMainVisualId: uid('m', 1), content, ...stamp(2) })),
        portfolioMainVisualThemes: [],
      },
      {
        id: uid('m', 2),
        portfolioId: p2.id,
        name: '포트폴리오',
        mainVisualUrl: `${IMG}/cover-moon-sea.svg`,
        nickName: '달빛 공방',
        subTitle: '밤의 풍경을 기록하는 일러스트레이터',
        ...stamp(2),
        portfolioMainVisualTags: ['일러스트', '야경'].map((content, i) => ({ id: uid('t', 20 + i), portfolioMainVisualId: uid('m', 2), content, ...stamp(2) })),
        portfolioMainVisualThemes: [],
      },
    ],
    artWorks: [
      {
        id: uid('w', 1),
        portfolioId: p1.id,
        title: '',
        description: '',
        ...stamp(3),
        portfolioArtWorkBlocks: [
          block(1, uid('w', 1), 0, 'image', '물결 연작', '여름 바다의 결을 반복되는 선으로 옮긴 연작입니다. 캔버스에 아크릴, 2023.', ['artwork-waves', 'artwork-ink-mountains']),
          block(2, uid('w', 1), 1, 'image', '오후 네 시의 정물', '창가에 남은 빛이 사물의 색을 바꾸는 순간을 그렸습니다.', ['artwork-still-life', 'artwork-color-field']),
          block(3, uid('w', 1), 2, 'text', '작가 노트', '작업은 늘 산책에서 시작합니다. 같은 길을 다른 시간에 걸으며 달라지는 색과 결을 기록하고, 작업실에서 그 기록을 겹쳐 하나의 화면으로 만듭니다.', []),
          block(4, uid('w', 1), 3, 'image', '도시의 밤과 정원', '네온과 식물, 기하학적 형태를 한 화면에 배치한 실험작입니다.', ['artwork-city-night', 'artwork-botanical', 'artwork-bauhaus']),
        ],
      },
      {
        id: uid('w', 2),
        portfolioId: p2.id,
        title: '',
        description: '',
        ...stamp(3),
        portfolioArtWorkBlocks: [
          block(5, uid('w', 2), 0, 'image', '야간 비행', '밤 도시와 사막의 해를 같은 팔레트로 그린 디지털 일러스트입니다.', ['artwork-desert-sun', 'artwork-city-night']),
          block(6, uid('w', 2), 1, 'text', '소개', '그림책과 앨범 커버 작업을 합니다. 문의는 연락처의 이메일로 부탁드립니다.', []),
        ],
      },
    ],
    histories: [
      {
        ...history(h1, p1.id),
        portfolioHistoryGenerals: [{ id: uid('g', 1), portfolioHistoryId: h1, generalImageUrl: `${IMG}/profile-palette.svg`, nickname: '윤슬', ...stamp(2) }],
        portfolioHistoryContacts: [{ id: uid('k', 1), portfolioHistoryId: h1, prefix: '', tel: '010-0000-0000', email: 'sample-artist@example.com', ...stamp(2) }],
        portfolioHistoryEducations: [
          section('e', h1, 'portfolioHistoryEducationId', 1, '', [['2019', ['가상예술대학교 회화과 졸업']]]),
          section('e', h1, 'portfolioHistoryEducationId', 2, '', [['2021', ['가상예술대학원 조형예술과 석사 졸업']]]),
        ],
        portfolioHistoryExhibitions: [
          section('x', h1, 'portfolioHistoryExhibitionId', 1, '개인전', [['2023', ['《물결의 문법》, 샘플갤러리']], ['2022', ['《오후 네 시의 정물》, 예시 아트스페이스']]]),
          section('x', h1, 'portfolioHistoryExhibitionId', 2, '단체전', [['2023', ['《여름의 색》, 가상미술관', '《작은 풍경들》, 목업 아트페어']]]),
        ],
        portfolioHistoryAwards: [section('r', h1, 'portfolioHistoryAwardId', 1, '', [['2022', ['가상신진작가상 우수상']], ['2020', ['샘플 드로잉 공모전 입선']]])],
        portfolioHistoryEtc: [section('o', h1, 'portfolioHistoryEtcId', 1, '레지던시', [['2023', ['예시 창작 레지던시 입주 작가 (3개월)']]])],
      },
      {
        ...history(h2, p2.id),
        portfolioHistoryGenerals: [{ id: uid('g', 2), portfolioHistoryId: h2, generalImageUrl: `${IMG}/profile-crescent.svg`, nickname: '달빛 공방', ...stamp(2) }],
        portfolioHistoryContacts: [{ id: uid('k', 2), portfolioHistoryId: h2, prefix: '', tel: '010-0000-0000', email: 'moonlit-studio@example.com', ...stamp(2) }],
        portfolioHistoryEducations: [section('e', h2, 'portfolioHistoryEducationId', 3, '', [['2018', ['샘플디자인학교 일러스트레이션 전공 졸업']]])],
        portfolioHistoryExhibitions: [section('x', h2, 'portfolioHistoryExhibitionId', 3, '그룹전', [['2023', ['《밤의 지도》, 예시 갤러리']]])],
        portfolioHistoryAwards: [],
        portfolioHistoryEtc: [],
      },
    ],
  };
}
