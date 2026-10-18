import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { defer, Observable, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

import { environment } from '../environments/environment';

import * as db from './mock-db';
import { HistorySection, SectionKind } from './fixtures/seed';
import { toImageDataUrl } from './upload';

declare global {
  interface Window {
    /** Stage 3 캡처 스크립트가 화면별 호출 API 를 집계하려고 읽는다(목업 응답은 네트워크에 나타나지 않는다) */
    __mockApiLog?: string[];
  }
}

interface Ctx {
  params: URLSearchParams;
  body: unknown;
}
type Handler = (ctx: Ctx) => unknown;

const LATENCY_MS = 120;

// body 는 화면 코드가 보낸 DTO 그대로다. 핸들러가 기대하는 모양으로만 읽는다.
const bodyAs = <T>(ctx: Ctx): T => (ctx.body ?? {}) as T;

/** 요청·응답 모두 깊은 복사본: 화면 객체와 목업 DB 가 참조를 공유하지 않게(실제 서버처럼) */
const snapshot = (value: unknown): unknown => (value === undefined || value === null ? null : JSON.parse(JSON.stringify(value)));

async function uploads(ctx: Ctx, field: 'file' | 'files') {
  const form = ctx.body instanceof FormData ? ctx.body : new FormData();
  const authorId = String(form.get('authorId') ?? '');
  const files = form.getAll(field).filter((v): v is File => v instanceof Blob);
  if (files.length === 0) throw new db.MockHttpError(500, '업로드할 파일이 없습니다.');
  return Promise.all(
    files.map(async (file) => db.saveFile(authorId, { url: await toImageDataUrl(file), name: file.name, type: file.type, size: file.size })),
  );
}

function sectionRoutes(kind: SectionKind): Record<string, Handler> {
  const base = `portfolio-history-${kind}`;
  return {
    [`GET ${base}/getData`]: ({ params }) => db.getSections(kind, params.get('historyId')),
    [`POST ${base}/saveData`]: (ctx) => db.saveSections(kind, ctx.params.get('historyId'), bodyAs<HistorySection[]>(ctx)),
    [`DELETE ${base}/delete`]: ({ params }) => db.deleteSection(kind, params.get('id')),
    [`DELETE ${base}/deleteSubtitle`]: ({ params }) => db.deleteSubtitle(kind, params.get('id')),
    [`DELETE ${base}/deleteValue`]: ({ params }) => db.deleteValue(kind, params.get('id')),
  };
}

/** 운영 화면(develop 제외)이 실제로 부르는 경로만 둔다. 나머지는 미등록 → 404 + 콘솔 경고 */
const ROUTES: Record<string, Handler> = {
  'GET author/isDuplicateAuthorLink': ({ params }) => db.isDuplicateAuthorLink(params.get('authorLink')),
  'POST author/joinAuthor': (ctx) => db.joinAuthor(bodyAs(ctx)),
  'POST author/loginAuthor': (ctx) => db.loginAuthor(bodyAs(ctx)),
  'GET author/getAuthorByAuthorLink': ({ params }) => db.getAuthorByAuthorLink(params.get('authorLink')),

  'POST portfolio/createNewPortfolio': (ctx) => db.createNewPortfolio(bodyAs<{ authorId?: string }>(ctx).authorId),
  'GET portfolio-main-visual/findOne': ({ params }) => db.findMainVisual(params.get('portfolioId')),
  'POST portfolio-main-visual/saveAndInItem': (ctx) => db.saveMainVisual(bodyAs(ctx)),

  'POST file/uploadFileOne': async (ctx) => (await uploads(ctx, 'file'))[0],
  'POST file/uploadFile': (ctx) => uploads(ctx, 'files'),

  'GET portfolio-art-work/init': ({ params }) => db.initArtWork(params.get('authorId')),
  'POST portfolio-art-work-block/save': (ctx) => db.saveBlock(bodyAs(ctx)),
  'DELETE portfolio-art-work-block/delete': ({ params }) => db.deleteBlock(params.get('id')),
  'POST portfolio-art-work-picture/create': (ctx) => db.createPicture(bodyAs(ctx)),
  'DELETE portfolio-art-work-picture/delete': ({ params }) => db.deletePicture(params.get('id')),

  'POST portfolio-history/create': ({ params }) => db.createHistory(params.get('portfolioId')),
  'GET portfolio-history/getAllHistoryByPortfolioId': ({ params }) => db.getAllHistory(params.get('portfolioId')),
  'POST portfolio-history-general/create': ({ params }) => db.createGeneral(params.get('portfolioHistoryId')),
  'POST portfolio-history-general/save': (ctx) => db.saveGeneral(bodyAs(ctx)),
  'POST portfolio-history-contact/create': ({ params }) => db.createContact(params.get('portfolioHistoryId')),
  'POST portfolio-history-contact/save': (ctx) => db.saveContact(bodyAs(ctx)),
  ...sectionRoutes('education'),
  ...sectionRoutes('exhibition'),
  ...sectionRoutes('award'),
  ...sectionRoutes('etc'),
};

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const prefix = `${environment.serverAddress}/`;
    if (!req.url.startsWith(prefix)) return next.handle(req);

    const url = new URL(req.urlWithParams, location.origin);
    const route = `${req.method} ${url.pathname.slice(prefix.length)}`;
    (window.__mockApiLog ??= []).push(route);

    const handler = ROUTES[route];
    if (!handler) {
      console.warn(`[mock-api] 미등록 경로: ${route}`);
      return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: req.url, error: { message: `mock: ${route}` } }));
    }

    const body = req.body instanceof FormData ? req.body : snapshot(req.body);
    return defer(async () => handler({ params: url.searchParams, body })).pipe(
      delay(LATENCY_MS),
      map((body) => new HttpResponse({ status: 200, url: req.url, body: snapshot(body) })),
      catchError((e: unknown) =>
        throwError(() =>
          e instanceof db.MockHttpError
            ? new HttpErrorResponse({ status: e.status, url: req.url, error: { message: e.message } })
            : new HttpErrorResponse({ status: 500, url: req.url, error: { message: String(e) } }),
        ),
      ),
    );
  }
}
