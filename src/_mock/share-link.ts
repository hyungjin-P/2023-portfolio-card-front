import { DialogShareLinkComponent } from '../app/components/template/dialog/dialog-share-link/dialog-share-link.component';

// 원본은 공유 링크에 서비스 도메인을 하드코딩했다(environment 로 바꿀 수 없음).
//   TS: dialog-share-link.component.ts:26-27 / 템플릿 텍스트: home.component.html:19, account.component.html:12,
//   shared-author-link-form.component.ts:55(prefixLabel 기본값)
// 목업에서는 원본을 고치지 않고 표기만 지금 접속한 호스트(localhost:4210 등)로 바꾼다. 도메인 문자열은 적지 않고 "앞머리 호스트"를 바꾼다.
const LEADING_HOST = /^(\s*)(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?=\/)/i;

// 이 셀렉터 안의 텍스트 노드만 고친다. 사용자가 입력한 내용(작품 설명 등)은 건드리지 않는다.
const SHARE_TEXT_SELECTORS = [
  '.create-portfolio-input-wrap > span',
  '.shared-author-link-form .prefix-label',
  '.account-block-content .portfolio-url',
  '.dialog-share-link-link',
].join(',');

function toCurrentHost(text: string): string {
  return text.replace(LEADING_HOST, (_match, space: string) => space + location.host);
}

function rewriteShareTexts(): void {
  document.querySelectorAll(SHARE_TEXT_SELECTORS).forEach((el) => {
    el.childNodes.forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent) return;
      const next = toCurrentHost(node.textContent);
      if (next !== node.textContent) node.textContent = next;
    });
  });
}

export function patchShareLink(): void {
  // Ivy 는 컴포넌트가 처음 그려질 때 prototype 의 ngOnInit 을 훅으로 등록한다 → 부트스트랩 전에 감싼다
  const originalNgOnInit = DialogShareLinkComponent.prototype.ngOnInit;
  DialogShareLinkComponent.prototype.ngOnInit = function (this: DialogShareLinkComponent): void {
    originalNgOnInit.call(this);
    if (this.link) this.link = toCurrentHost(this.link);
    // QR 에 담기는 주소도 목업 프리뷰로 열리게 origin 을 바꾼다
    if (this.qrLink) this.qrLink = this.qrLink.replace(/^https?:\/\/[^/]+/, location.origin);
  };

  new MutationObserver(rewriteShareTexts).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });
}
