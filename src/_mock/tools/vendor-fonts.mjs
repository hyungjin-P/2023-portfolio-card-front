// 목업 전용 self-host 폰트 조립기. 원본이 Google Fonts CDN 에서 받던 글꼴을 npm 패키지 파일로 대신한다.
//   원본 요청: src/index.html (Roboto 300·400·500, Material Icons), src/assets/mixins/_font.scss:1 (Noto Sans KR 100~900, Poppins 700, Montserrat 500~800)
// 준비: 빈 스크래치 폴더에서
//   npm pack @fontsource-variable/noto-sans-kr @fontsource-variable/montserrat @fontsource/poppins @fontsource/roboto material-icons --json > pack.json
//   각 tgz 를 x/<tgz 이름>/ 에 풀기
// 실행: node src/_mock/tools/vendor-fonts.mjs <스크래치 폴더>  → src/_mock/assets/fonts/**
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = process.argv[2];
if (!SRC) throw new Error('usage: node vendor-fonts.mjs <npm pack 폴더>');
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'fonts');
const pack = JSON.parse(readFileSync(join(SRC, 'pack.json'), 'utf8'));
const pkgDir = (name) => {
  const p = pack.find((x) => x.name === name);
  return { dir: join(SRC, 'x', p.filename.replace(/\.tgz$/, ''), 'package'), meta: p };
};

// @font-face 블록 단위로 나눠 조건에 맞는 것만 남긴다
const blocks = (css) => css.match(/(\/\*[^*]*\*\/\s*)?@font-face\s*\{[^}]*\}/g) ?? [];
const urls = (block) => [...block.matchAll(/url\(\.\/files\/([^)]+)\)/g)].map((m) => m[1]);

function vendor({ name, folder, family, pick, cssFiles }) {
  const { dir, meta } = pkgDir(name);
  const out = join(OUT, folder);
  mkdirSync(join(out, 'files'), { recursive: true });
  const kept = [];
  for (const cssFile of cssFiles) {
    for (const b of blocks(readFileSync(join(dir, cssFile), 'utf8'))) {
      if (!pick(b)) continue;
      const files = urls(b).filter((f) => f.endsWith('.woff2'));
      files.forEach((f) => copyFileSync(join(dir, 'files', f), join(out, 'files', f)));
      // woff 폴백은 싣지 않는다(크롬 계열만 검증 대상) → src 에서 woff2 만 남김
      kept.push(
        b
          .replace(/font-family:\s*'[^']+'/, `font-family: '${family}'`)
          .replace(/src:[^;]+;/, (s) => `src: ${s.match(/url\(\.\/files\/[^)]+\.woff2\) format\('[^']+'\)/)[0]};`),
      );
    }
  }
  copyFileSync(join(dir, 'LICENSE'), join(out, 'LICENSE'));
  writeFileSync(join(out, `${folder}.css`), `/* ${meta.name}@${meta.version} — family 이름을 원본 CSS 와 같게 바꿈 */\n${kept.join('\n\n')}\n`);
  return { meta, files: readdirSync(join(out, 'files')).length, folder };
}

rmSync(OUT, { recursive: true, force: true });
const latin = (b) => /-latin-(ext-)?(wght|\d{3})-normal\.woff2/.test(b);
const done = [
  vendor({ name: '@fontsource-variable/noto-sans-kr', folder: 'noto-sans-kr', family: 'Noto Sans KR', pick: () => true, cssFiles: ['wght.css'] }),
  vendor({ name: '@fontsource-variable/montserrat', folder: 'montserrat', family: 'Montserrat', pick: latin, cssFiles: ['wght.css'] }),
  vendor({ name: '@fontsource/poppins', folder: 'poppins', family: 'Poppins', pick: latin, cssFiles: ['700.css'] }),
  vendor({ name: '@fontsource/roboto', folder: 'roboto', family: 'Roboto', pick: latin, cssFiles: ['300.css', '400.css', '500.css'] }),
];

// Material Icons: 기본(filled) 한 벌과 .material-icons 클래스만
{
  const { dir, meta } = pkgDir('material-icons');
  const out = join(OUT, 'material-icons');
  mkdirSync(out, { recursive: true });
  const css = readFileSync(join(dir, 'iconfont', 'material-icons.css'), 'utf8');
  const filled = css.slice(0, css.indexOf('@font-face', css.indexOf('.material-icons {')));
  copyFileSync(join(dir, 'iconfont', 'material-icons.woff2'), join(out, 'material-icons.woff2'));
  copyFileSync(join(dir, 'LICENSE'), join(out, 'LICENSE'));
  writeFileSync(
    join(out, 'material-icons.css'),
    `/* ${meta.name}@${meta.version} — filled 한 벌만 */\n` + filled.replace(/,\s*url\("\.\/material-icons\.woff"\) format\("woff"\)/, '').trim() + '\n',
  );
  done.push({ meta, files: 1, folder: 'material-icons' });
}

writeFileSync(
  join(OUT, 'fonts.css'),
  '/* 목업 전용 self-host 폰트 (원본: Google Fonts CDN). index.mock.html 이 이 파일 하나를 링크한다. */\n' +
    done.map((d) => `@import url("./${d.folder}/${d.folder}.css");`).join('\n') +
    '\n',
);
writeFileSync(
  join(OUT, 'README.md'),
  '# 목업 self-host 폰트\n\n`src/_mock/tools/vendor-fonts.mjs` 가 `npm pack` 결과에서 만든다. 원본 소스는 Google Fonts CDN 을 부른다(목업 CSP 가 차단).\n\n' +
    '| 패키지 | 버전 | 라이선스 | integrity | 파일 수 |\n|---|---|---|---|---|\n' +
    done
      .map((d) => {
        const lic = JSON.parse(readFileSync(join(pkgDir(d.meta.name).dir, 'package.json'), 'utf8')).license;
        return `| \`${d.meta.name}\` | ${d.meta.version} | ${lic} (\`${d.folder}/LICENSE\`) | \`${d.meta.integrity}\` | ${d.files} |`;
      })
      .join('\n') +
    '\n',
);
console.log(done.map((d) => `${d.meta.name}@${d.meta.version} → ${d.folder} (${d.files} files)`).join('\n'));
