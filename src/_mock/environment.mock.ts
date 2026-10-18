// --configuration=mock 에서 src/environments/environment.ts 를 대체한다.
// 원본과 같은 키, 값은 전부 더미다. 실제 API 호스트·암호화 키는 넣지 않는다.
export const environment = {
  // develop 라우트(pages.module.ts:161 `!environment.production`)를 빼고 enableProdMode 를 켠다
  production: true,
  prefixProvider: 'localhost',
  // MockApiInterceptor 가 이 접두어로 시작하는 요청을 가로챈다. 놓친 요청도 dev 서버(localhost)로만 간다.
  serverAddress: '/mock-api',
  cryptoPlainText: 'mock-session-passphrase',
};
