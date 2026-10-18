import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from '../environments/environment';

import { MockAppModule } from './mock-app.module';
import { patchShareLink } from './share-link';

if (environment.production) {
  enableProdMode();
}

// 공유 링크 표기를 localhost 로 바꾼다. 컴포넌트가 처음 그려지기 전에 걸어야 한다(share-link.ts)
patchShareLink();

platformBrowserDynamic()
  .bootstrapModule(MockAppModule)
  .catch((err) => console.error(err));
