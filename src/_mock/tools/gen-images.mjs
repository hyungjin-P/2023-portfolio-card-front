// 목업 fixture 용 가짜 이미지 생성기. 실제 사진·작품·브랜드 자산을 쓰지 않으려고 SVG 일러스트를 직접 그린다.
// 사람 얼굴은 그리지 않는다(풍경·정물·추상). 난수는 시드 고정이라 다시 돌려도 같은 파일이 나온다.
// 실행: node src/_mock/tools/gen-images.mjs  → src/_mock/assets/img/*.svg
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'img');

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;
const svg = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<defs>${defs}</defs>${body}</svg>\n`;
const lin = (id, stops, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">` +
  stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('') +
  `</linearGradient>`;

// 능선: 좌→우로 흔들리는 폴리라인을 바닥까지 닫는다
function ridge(r, w, h, baseY, amp, step, color, opacity = 1) {
  let d = `M0 ${h} L0 ${f(baseY)}`;
  let y = baseY;
  for (let x = 0; x <= w + step; x += step) {
    y += (r() - 0.5) * amp;
    y = Math.min(Math.max(y, baseY - amp * 2.2), baseY + amp * 1.2);
    d += ` L${f(x)} ${f(y)}`;
  }
  return `<path d="${d} L${w} ${h}Z" fill="${color}" opacity="${opacity}"/>`;
}

const scenes = {
  // 대표 커버 A: 해 질 녘 겹친 산
  'cover-dusk-mountains': () => {
    const [w, h] = [1080, 1620];
    const r = rng(11);
    const birds = Array.from({ length: 7 }, () => {
      const x = 180 + r() * 700, y = 260 + r() * 260, s = 10 + r() * 14;
      return `<path d="M${f(x - s)} ${f(y)} q${f(s / 2)} ${f(-s / 2)} ${f(s)} 0 q${f(s / 2)} ${f(-s / 2)} ${f(s)} 0" stroke="#3b2c4a" stroke-width="3" fill="none" opacity="0.6"/>`;
    }).join('');
    return svg(w, h,
      lin('sky', [[0, '#2d3a6b'], [0.45, '#c56b8a'], [0.75, '#f3a86b'], [1, '#f9d48b']]),
      `<rect width="${w}" height="${h}" fill="url(#sky)"/><circle cx="700" cy="860" r="150" fill="#ffe7b0" opacity="0.92"/>` +
        birds +
        ridge(r, w, h, 900, 70, 40, '#a35a7a', 0.75) +
        ridge(r, w, h, 1040, 80, 36, '#6e3f6b', 0.85) +
        ridge(r, w, h, 1220, 90, 30, '#432a55') +
        ridge(r, w, h, 1400, 60, 24, '#24183a'));
  },
  // 대표 커버 B: 달과 바다
  'cover-moon-sea': () => {
    const [w, h] = [1080, 1620];
    const r = rng(23);
    const stars = Array.from({ length: 70 }, () =>
      `<circle cx="${f(r() * w)}" cy="${f(r() * 820)}" r="${f(0.8 + r() * 2.2)}" fill="#fff" opacity="${f(0.3 + r() * 0.6)}"/>`).join('');
    const glints = Array.from({ length: 26 }, (_, i) => {
      const y = 1000 + i * 22, half = 30 + i * 9 + r() * 30;
      return `<rect x="${f(540 - half)}" y="${y}" width="${f(half * 2)}" height="5" rx="2.5" fill="#f6edc8" opacity="${f(0.7 - i * 0.022)}"/>`;
    }).join('');
    const waves = Array.from({ length: 14 }, (_, i) => {
      const y = 1000 + i * 45;
      let d = `M0 ${y}`;
      for (let x = 0; x <= w; x += 60) d += ` q30 ${f(-8 - r() * 8)} 60 0`;
      return `<path d="${d}" stroke="#9fb8d9" stroke-width="2" fill="none" opacity="${f(0.15 + i * 0.02)}"/>`;
    }).join('');
    return svg(w, h,
      lin('night', [[0, '#0b1433'], [0.55, '#1f3562'], [1, '#2e5a7d']]) + lin('sea', [[0, '#173250'], [1, '#08121f']]) +
        `<radialGradient id="halo"><stop offset="0.55" stop-color="#f6edc8" stop-opacity="0.22"/><stop offset="1" stop-color="#f6edc8" stop-opacity="0"/></radialGradient>`,
      `<rect width="${w}" height="${h}" fill="url(#night)"/>${stars}` +
        // 달 위에 반투명 원을 겹치면 회색 얼룩처럼 보여 보름달 + 달무리로 그린다
        `<circle cx="540" cy="620" r="300" fill="url(#halo)"/><circle cx="540" cy="620" r="170" fill="#f6edc8"/>` +
        `<rect y="1000" width="${w}" height="${h - 1000}" fill="url(#sea)"/>${glints}${waves}`);
  },
  // 작품: 바우하우스풍 기하 구성
  'artwork-bauhaus': () => {
    const [w, h] = [1200, 1200];
    const r = rng(5);
    const pal = ['#e63946', '#f4a261', '#2a9d8f', '#264653', '#e9c46a', '#f1faee'];
    let body = `<rect width="${w}" height="${h}" fill="#f4efe6"/>`;
    for (let gy = 0; gy < 4; gy++)
      for (let gx = 0; gx < 4; gx++) {
        const x = 60 + gx * 270, y = 60 + gy * 270, c = pal[Math.floor(r() * pal.length)], k = Math.floor(r() * 4);
        if (k === 0) body += `<circle cx="${x + 120}" cy="${y + 120}" r="110" fill="${c}"/>`;
        else if (k === 1) body += `<rect x="${x + 10}" y="${y + 10}" width="220" height="220" fill="${c}"/>`;
        else if (k === 2) body += `<path d="M${x + 10} ${y + 230} A220 220 0 0 1 ${x + 230} ${y + 10} L${x + 230} ${y + 230}Z" fill="${c}"/>`;
        else body += `<path d="M${x + 10} ${y + 230} L${x + 120} ${y + 20} L${x + 230} ${y + 230}Z" fill="${c}"/>`;
      }
    return svg(w, h, '', body);
  },
  // 작품: 번진 색면
  'artwork-color-field': () => {
    const [w, h] = [1200, 1500];
    return svg(w, h,
      `<filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="18"/></filter>`,
      `<rect width="${w}" height="${h}" fill="#7a2e2a"/>` +
        `<g filter="url(#soft)"><rect x="120" y="140" width="960" height="560" rx="30" fill="#e07a3f" opacity="0.9"/>` +
        `<rect x="140" y="790" width="920" height="210" rx="24" fill="#3f1d1b" opacity="0.85"/>` +
        `<rect x="120" y="1080" width="960" height="300" rx="30" fill="#c9503a" opacity="0.9"/></g>`);
  },
  // 작품: 정물(꽃병·과일)
  'artwork-still-life': () => {
    const [w, h] = [1500, 1050];
    const fruit = [[880, 760, 70, '#e76f51'], [1010, 775, 58, '#f4a261'], [950, 690, 52, '#e9c46a'], [1120, 780, 48, '#9c6644']]
      .map(([x, y, rr, c]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${c}"/><circle cx="${x - rr * 0.35}" cy="${y - rr * 0.35}" r="${rr * 0.25}" fill="#fff" opacity="0.35"/>`).join('');
    return svg(w, h, lin('wall', [[0, '#d8cbb3'], [1, '#bfae91']]) + lin('vase', [[0, '#3d5a80'], [1, '#293241']], 1, 0),
      `<rect width="${w}" height="${h}" fill="url(#wall)"/><rect y="780" width="${w}" height="270" fill="#8d6e53"/>` +
        `<ellipse cx="560" cy="835" rx="210" ry="26" fill="#000" opacity="0.18"/>` +
        `<path d="M480 300 q-40 60 -20 120 q-110 120 -60 300 q30 100 160 110 q130 -10 160 -110 q50 -180 -60 -300 q20 -60 -20 -120Z" fill="url(#vase)"/>` +
        `<path d="M560 300 C 520 200 460 150 420 110 M560 300 C 600 190 660 150 720 120 M560 300 C 560 200 570 140 560 80" stroke="#4a6b3a" stroke-width="8" fill="none"/>` +
        `<circle cx="420" cy="105" r="40" fill="#f2cc8f"/><circle cx="720" cy="115" r="46" fill="#e07a5f"/><circle cx="560" cy="72" r="36" fill="#f4f1de"/>` +
        fruit);
  },
  // 작품: 수묵 산수
  'artwork-ink-mountains': () => {
    const [w, h] = [1500, 1000];
    const r = rng(41);
    return svg(w, h, lin('fog', [[0, '#ffffff', 0], [1, '#f2f0ea', 0.9]]),
      `<rect width="${w}" height="${h}" fill="#f2f0ea"/>` +
        ridge(r, w, h, 420, 90, 30, '#9a9a96', 0.55) + `<rect y="380" width="${w}" height="220" fill="url(#fog)"/>` +
        ridge(r, w, h, 600, 110, 26, '#5f5f5b', 0.75) + `<rect y="560" width="${w}" height="200" fill="url(#fog)"/>` +
        ridge(r, w, h, 820, 70, 22, '#2b2b29', 0.9) +
        `<rect x="1330" y="120" width="70" height="70" fill="#b23a30"/><rect x="1342" y="132" width="46" height="46" fill="none" stroke="#f2f0ea" stroke-width="4"/>`);
  },
  // 작품: 잎 패턴
  'artwork-botanical': () => {
    const [w, h] = [1200, 1500];
    const r = rng(77);
    const leaves = Array.from({ length: 46 }, () => {
      const x = r() * w, y = r() * h, rot = r() * 360, s = 0.6 + r() * 0.9;
      const c = ['#2d6a4f', '#40916c', '#52b788', '#95d5b2', '#1b4332'][Math.floor(r() * 5)];
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(s)})"><path d="M0 -90 C 55 -50 55 50 0 90 C -55 50 -55 -50 0 -90Z" fill="${c}"/><path d="M0 -85 L0 85" stroke="#d8f3dc" stroke-width="3" opacity="0.6"/></g>`;
    }).join('');
    return svg(w, h, '', `<rect width="${w}" height="${h}" fill="#f1ede4"/>${leaves}`);
  },
  // 작품: 물결
  'artwork-waves': () => {
    const [w, h] = [1500, 1000];
    const lines = Array.from({ length: 18 }, (_, i) => {
      const y = 120 + i * 48;
      let d = `M-20 ${y}`;
      for (let x = -20; x <= w + 80; x += 100) d += ` c25 -40 75 -40 100 0`;
      return `<path d="${d}" stroke="${i % 3 === 0 ? '#f1faee' : '#a8dadc'}" stroke-width="${i % 3 === 0 ? 6 : 3}" fill="none" opacity="0.9"/>`;
    }).join('');
    return svg(w, h, lin('deep', [[0, '#1d3557'], [1, '#457b9d']]),
      `<rect width="${w}" height="${h}" fill="url(#deep)"/><circle cx="1220" cy="190" r="90" fill="#e63946"/>${lines}`);
  },
  // 작품: 밤의 도시
  'artwork-city-night': () => {
    const [w, h] = [1500, 1000];
    const r = rng(99);
    let x = 0, body = '';
    while (x < w) {
      const bw = 70 + r() * 110, bh = 220 + r() * 520, y = h - bh;
      body += `<rect x="${f(x)}" y="${f(y)}" width="${f(bw)}" height="${f(bh)}" fill="#14213d"/>`;
      for (let wy = y + 24; wy < h - 20; wy += 34)
        for (let wx = x + 14; wx < x + bw - 18; wx += 26)
          if (r() > 0.55) body += `<rect x="${f(wx)}" y="${f(wy)}" width="12" height="16" fill="#fca311" opacity="${f(0.5 + r() * 0.5)}"/>`;
      x += bw + 6;
    }
    return svg(w, h, lin('dusk', [[0, '#3a0ca3'], [1, '#f72585']]), `<rect width="${w}" height="${h}" fill="url(#dusk)"/><circle cx="260" cy="190" r="70" fill="#fff3b0" opacity="0.9"/>${body}`);
  },
  // 작품: 사막과 해
  'artwork-desert-sun': () => {
    const [w, h] = [1200, 1200];
    return svg(w, h, lin('heat', [[0, '#ffb703'], [1, '#fb8500']]),
      `<rect width="${w}" height="${h}" fill="url(#heat)"/><circle cx="600" cy="520" r="230" fill="#fff1c1"/>` +
        `<path d="M0 760 C 300 640 520 860 800 760 S 1100 700 1200 740 L1200 1200 L0 1200Z" fill="#e85d04"/>` +
        `<path d="M0 900 C 260 820 560 1000 860 900 S 1120 860 1200 880 L1200 1200 L0 1200Z" fill="#9d0208"/>` +
        `<path d="M0 1040 C 320 980 640 1110 1200 1020 L1200 1200 L0 1200Z" fill="#370617"/>`);
  },
  // 프로필(얼굴 없음): 팔레트와 붓
  'profile-palette': () => {
    const [w, h] = [600, 600];
    const dots = [['#e63946', 220, 250], ['#f4a261', 300, 210], ['#2a9d8f', 380, 250], ['#e9c46a', 400, 340]]
      .map(([c, x, y]) => `<circle cx="${x}" cy="${y}" r="34" fill="${c}"/>`).join('');
    return svg(w, h, lin('pbg', [[0, '#cdb4db'], [1, '#a2d2ff']], 1, 1),
      `<rect width="${w}" height="${h}" fill="url(#pbg)"/>` +
        `<path d="M300 150 C 470 150 520 280 470 380 C 440 440 380 400 350 440 C 320 480 360 520 300 520 C 160 520 110 400 130 300 C 150 200 220 150 300 150Z" fill="#f8f1e5"/>` +
        `<circle cx="215" cy="380" r="34" fill="url(#pbg)"/>${dots}` +
        `<rect x="420" y="120" width="26" height="250" rx="12" fill="#6d4c41" transform="rotate(35 433 245)"/>`);
  },
  // 프로필(얼굴 없음): 초승달 모노그램
  'profile-crescent': () => {
    const [w, h] = [600, 600];
    return svg(w, h, lin('cbg', [[0, '#0b1433'], [1, '#2e5a7d']]),
      `<rect width="${w}" height="${h}" fill="url(#cbg)"/><circle cx="300" cy="300" r="170" fill="#f6edc8"/><circle cx="370" cy="250" r="150" fill="#16264a"/>` +
        `<circle cx="160" cy="140" r="4" fill="#fff"/><circle cx="460" cy="470" r="3" fill="#fff"/><circle cx="420" cy="110" r="2.5" fill="#fff"/>`);
  },
};

mkdirSync(OUT, { recursive: true });
for (const [name, draw] of Object.entries(scenes)) {
  const out = draw();
  writeFileSync(join(OUT, `${name}.svg`), out);
  console.log(`${name}.svg  ${(out.length / 1024).toFixed(1)} KB`);
}
