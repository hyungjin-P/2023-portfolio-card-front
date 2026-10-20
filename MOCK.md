# 목업 모드 실행 안내 (`portfolio/mock` 브랜치 — 공개본에서는 `main`)

back API·외부 서비스 없이 이 front 를 로컬에서 단독으로 켜는 방법이다. 원본 코드는 그대로 두고 `src/_mock/` 에 목업 층을 덧붙였다. `--configuration=mock` 을 주지 않으면 원본 경로가 그대로 빌드된다.

## 런타임

| 항목 | 값 | 근거 |
|---|---|---|
| Node | **16.20.2** (`.nvmrc`) | `app.yaml:1` `runtime: nodejs16` + Angular 14.3 engines `^14.15 \|\| >=16.10` |
| npm | 8.19.4 (Node 16.20.2 동봉) | |
| Angular | core 14.3.0 · CLI 14.2.13 | `package-lock.json` (원본 lock 없음 → 2023-12-28 이전 범위로 재해석) |

## 설치·기동

Node 16.20.2 를 PATH 앞에 둔 셸에서 실행한다(nvm 이 있으면 `nvm use`).

```powershell
# PowerShell 예시 — 포터블 Node 위치는 환경에 맞게
$env:Path = "D:\code\_tools\node-v16.20.2-win-x64;$env:Path"
node -v                                   # v16.20.2
npm ci
npx ng serve --configuration=mock         # http://localhost:4210
```

```bash
# Git Bash 예시
export PATH="/d/code/_tools/node-v16.20.2-win-x64:$PATH"
npm ci
npx ng serve --configuration=mock
```

- 포트는 `angular.json` `serve.configurations.mock.port` 의 **4210** 이다. 바꾸려면 `--port <번호>`.
- 정적 빌드: `npx ng build --configuration=mock` → `dist/flexible-portfolio-card-mock/` (SPA 라 모든 경로를 `index.html` 로 돌려주는 서버가 필요).
- **실행 금지**: `npm run s3-upload-dev`·`cloudfront-invalidation-dev`·`deploy-dev`·`deploy-prod`, `ng deploy` — 원본의 실제 배포 대상(S3·CloudFront·Firebase)으로 나간다.

## 둘러보기

| 경로 | 내용 |
|---|---|
| `/home` | 희망 URL 입력 → 가입 |
| `/login` | 시드 계정 `sample-artist` / `sample1234`, `moonlit-studio` / `sample1234` |
| `/editor` | 대표화면 · 작품관리 · 프로필관리 3탭 (로그인 필요) |
| `/sample-artist`, `/moonlit-studio` | 공개 카드 프리뷰(앞면·뒷면·작품) |

- 데이터는 **메모리**에 있다. 새로고침하면 시드로 돌아간다. 로그인 정보는 원본대로 sessionStorage 에 남으므로, 새로고침 후에는 가입했던 계정이 사라진 채 로그인 상태만 남을 수 있다 → 로그아웃 후 시드 계정을 쓴다.
- 콘솔에 CSP 위반 경고(Google Fonts `@import`, blob 워커)가 남는 것은 의도한 동작이다(아래 표).

## 원본 대비 변경

| 파일 | 변경 |
|---|---|
| `src/_mock/**` | 신규. 목업 코드·fixture·자산·폰트·생성 도구 전부 |
| `angular.json` | `build.configurations.mock`·`serve.configurations.mock` **추가만** (production·development 그대로) |
| `.nvmrc` | 신규 `16.20.2` |
| `package-lock.json` | 신규 추적(`.gitignore` 의 `package-lock.json` 한 줄 삭제) |
| `MOCK.md` | 이 문서 |
| 그 밖의 `src/**` | **수정 없음** — `git diff <원본 스냅샷>..main -- src ':!src/_mock'` 가 비어 있다 |

플래그 off production 빌드의 청크 파일명·바이트가 목업 층 전 기준선과 같다(검증 기록: `portfolio-notes/portfolio-card-front/stage2-mock.md`).

## 목업으로 대체한 기능

| 원본 의존성 | 원본 위치 | 목업 |
|---|---|---|
| back API (`environment.serverAddress` + 61경로) | `src/app/repository/api/*.service.ts` | `MockApiInterceptor`(`src/_mock/mock-api.interceptor.ts`) 가 `METHOD 경로`를 메모리 DB(`mock-db.ts`, 시드 `fixtures/seed.ts`)로 처리. 지연 120ms. 호출 기록 `window.__mockApiLog`. 운영 화면이 안 부르는 경로는 404 + `[mock-api] 미등록 경로` 경고 |
| 로그인·가입(평문 비교, 응답에 비밀번호 포함) | back `author.service.ts` | 같은 규칙을 메모리에서 흉내(더미 비밀번호) |
| S3 이미지 URL | back `file.service.ts` | 시드 이미지는 스크립트로 그린 SVG(`src/_mock/assets/img`, `tools/gen-images.mjs`). 업로드는 `data:` URL 로 응답 |
| Google Tag Manager | `src/index.html` (head·body) | mock index(`src/_mock/index.mock.html`)에서 제거 |
| Google Fonts (Roboto·Material Icons) | `src/index.html` | `<link>` 제거, `npm pack` 한 @fontsource·material-icons 를 self-host(`src/_mock/assets/fonts`, 라이선스 포함) |
| Google Fonts (Noto Sans KR·Poppins·Montserrat) `@import url()` | `src/assets/mixins/_font.scss:1` | SCSS 는 파일 교체가 안 돼 CSP `style-src` 로 전송 전 차단 + 같은 이름 `@font-face` self-host |
| 이미지 압축 Web Worker 의 jsdelivr `importScripts` | `browser-image-compression` 2.0.2 (`useWebWorker: true`) | CSP `worker-src 'self'` 로 blob 워커 생성 차단 → 라이브러리가 메인 스레드 압축으로 폴백 |
| 공유 링크 도메인(하드코딩) | `dialog-share-link.component.ts:26-27`, `home.component.html:19`, `account.component.html:12`, `shared-author-link-form.component.ts:55` | 표기·복사·QR 을 지금 접속한 호스트(`localhost:4210`)로 바꿈(`src/_mock/share-link.ts`: ngOnInit 래핑 + 지정 셀렉터 텍스트만 치환) |
| sessionStorage AES 키 `cryptoPlainText` | `src/environments/environment*.ts` | mock environment 의 더미 문자열 |
| `pages/develop/*` 개발용 라우트 | `pages.module.ts:161` | mock environment `production: true` 로 등록 안 됨 |

## 미완성 화면 (원본 동작 그대로 둠)

원본이 서버 호출 없이 완료 문구만 띄우거나 저장하지 않는 화면이다. 목업도 손대지 않았다.

| 화면 | 원본 동작 |
|---|---|
| 비밀번호 찾기 `/forgot-password` | "임시비밀번호 이메일 발송완료" 다이얼로그만 뜬다 |
| 비밀번호 변경 (`/account`) | `console.log` 후 "변경이 완료되었습니다" |
| 회원 탈퇴 (`/account`) | sessionStorage 만 지운다(서버 호출 없음) |
| SNS 및 링크 블록 | 주석 처리돼 화면에 없다 |
| 공개/비공개 토글 (작품 블록·이력 영역) | 화면 상태만 바뀌고 저장하지 않는다 |
| 작품 블록 드래그 정렬 | 화면 순서만 바뀌고 저장하지 않는다 |

## 알려진 제약

- 프리뷰에서 다른 작가 주소로 바로 옮기면(`/a` → `/b`) 같은 컴포넌트가 재사용돼 내용이 바뀌지 않는다(원본 동작). 새로고침하거나 다른 화면을 거친다.
- 푸터·처리방침의 회사 정보(대표자명·사업자등록번호·전화·이메일)는 공개본에서 `***` 형태로, 가입 화면 이메일 placeholder 는 `example.com` 주소로 바꿨다(README "공개본에서 바꾼 것"). 목업 층은 이 텍스트를 바꾸지 않는다.
