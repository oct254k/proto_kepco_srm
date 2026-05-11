import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const menuFile = path.join(repoRoot, 'src/lib/menu.ts');
const accessFile = path.join(repoRoot, 'src/lib/access.ts');
const appRoot = path.join(repoRoot, 'src/app');

const EXPECTED = {
  B: {
    defaultPath: '/b/dashboard/',
    items: [
      { type: 'single', label: '대시보드', href: '/b/dashboard/' },
      { type: 'single', label: '견적', href: '/b/quote-requests/' },
      { type: 'single', label: '발주', href: '/b/orders/' },
      {
        type: 'group',
        label: '입찰',
        href: '/b/bids/',
        items: [
          { label: '입찰계획·공고 조회', href: '/b/bids/' },
          { label: '입찰심사', href: '/b/bid-review/' },
        ],
      },
      { type: 'single', label: '마이페이지', href: '/b/mypage/' },
    ],
  },
  V: {
    defaultPath: '/v/dashboard/',
    items: [
      { type: 'single', label: '대시보드', href: '/v/dashboard/' },
      { type: 'single', label: '견적', href: '/v/quotes/' },
      {
        type: 'group',
        label: '입찰참여',
        href: '/v/bid-pipeline/',
        items: [
          { label: '입찰 파이프라인', href: '/v/bid-pipeline/' },
          { label: '입찰·투찰 현황', href: '/v/bid-history/' },
        ],
      },
      { type: 'single', label: '계약·보증', href: '/v/contracts/' },
      { type: 'single', label: '마이페이지', href: '/v/company/' },
    ],
  },
  C: {
    defaultPath: '/c/dashboard/',
    items: [
      { type: 'single', label: '대시보드', href: '/c/dashboard/' },
      {
        type: 'group',
        label: '발주관리',
        href: '/c/orders/',
        items: [
          { label: '발주계약요청·계획', href: '/c/orders/' },
          { label: '견적요청 관리', href: '/c/quote-requests/' },
        ],
      },
      { type: 'single', label: '입찰관리', href: '/c/bids/' },
      { type: 'single', label: '참여업체평가', href: '/c/evaluations/' },
      { type: 'single', label: '낙찰관리', href: '/c/awards/' },
      { type: 'single', label: '계약관리', href: '/c/contracts/' },
      { type: 'single', label: '마이페이지', href: '/c/mypage/' },
    ],
  },
  A: {
    defaultPath: '/a/system/',
    items: [
      { type: 'single', label: '사용자관리', href: '/a/users/' },
      { type: 'single', label: '협력업체관리', href: '/a/vendors/' },
      { type: 'single', label: '기준정보(품목)', href: '/a/items/' },
      { type: 'single', label: '시스템환경', href: '/a/system/' },
    ],
  },
};

function extractLiteralBlock(source, declaration, opener, closer) {
  const start = source.indexOf(declaration);
  if (start === -1) throw new Error(`Cannot find declaration: ${declaration}`);
  const openIndex = source.indexOf(opener, start);
  if (openIndex === -1) throw new Error(`Cannot find opener for ${declaration}`);
  let depth = 0;
  let inString = false;
  let stringQuote = '';
  let escaped = false;

  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === stringQuote) {
        inString = false;
        stringQuote = '';
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringQuote = ch;
      continue;
    }

    if (ch === opener) depth += 1;
    if (ch === closer) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openIndex, i + 1);
      }
    }
  }

  throw new Error(`Unclosed literal for ${declaration}`);
}

function evaluateLiteral(literalSource) {
  return Function(`"use strict"; return (${literalSource});`)();
}

function normalizeHref(href) {
  return href.endsWith('/') ? href : `${href}/`;
}

function collectPageRoutes(rootDir) {
  const routes = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name === 'page.tsx') {
        const relativeDir = path.relative(rootDir, path.dirname(fullPath));
        const route = relativeDir === '.' ? '/' : `/${relativeDir.split(path.sep).join('/')}/`;
        routes.push(route);
      }
    }
  }
  walk(rootDir);
  return routes.sort();
}

function ensure(condition, message, errors) {
  if (!condition) errors.push(message);
}

const menuSource = fs.readFileSync(menuFile, 'utf8');
const accessSource = fs.readFileSync(accessFile, 'utf8');
const menus = {
  B: evaluateLiteral(extractLiteralBlock(menuSource, 'export const roleBMenu', '[', ']')),
  V: evaluateLiteral(extractLiteralBlock(menuSource, 'export const roleVMenu', '[', ']')),
  C: evaluateLiteral(extractLiteralBlock(menuSource, 'export const roleCMenu', '[', ']')),
  A: evaluateLiteral(extractLiteralBlock(menuSource, 'export const roleAMenu', '[', ']')),
};
const defaultPaths = evaluateLiteral(extractLiteralBlock(accessSource, 'const DEFAULT_PATHS', '{', '}'));
const pathRoleMap = evaluateLiteral(extractLiteralBlock(accessSource, 'const PATH_ROLE_MAP', '[', ']'));
const pageRoutes = collectPageRoutes(appRoot);
const pageRouteSet = new Set(pageRoutes.map(normalizeHref));
const errors = [];
const passes = [];
const requiredRoleMenus = {
  B: 'export const roleBMenu',
  V: 'export const roleVMenu',
  C: 'export const roleCMenu',
  A: 'export const roleAMenu',
};

for (const declaration of Object.values(requiredRoleMenus)) {
  ensure(menuSource.includes(declaration), `menu.ts: ${declaration} 선언이 필요합니다.`, errors);
  if (menuSource.includes(declaration)) {
    passes.push(`menu.ts: ${declaration} 선언 확인`);
  }
}

for (const [role, spec] of Object.entries(EXPECTED)) {
  const actualItems = menus[role];
  ensure(Array.isArray(actualItems), `${role}: MENUS 정의가 없습니다.`, errors);
  if (!Array.isArray(actualItems)) continue;

  const simplifiedActualItems = actualItems.map((item) => (
    item.type === 'group'
      ? {
          type: item.type,
          label: item.label,
          href: item.href,
          items: item.items.map((leaf) => ({ label: leaf.label, href: leaf.href })),
        }
      : {
          type: item.type,
          label: item.label,
          href: item.href,
        }
  ));
  const simplifiedExpectedItems = spec.items.map((item) => (
    item.type === 'group'
      ? {
          type: item.type,
          label: item.label,
          href: item.href,
          items: item.items.map((leaf) => ({ label: leaf.label, href: leaf.href })),
        }
      : {
          type: item.type,
          label: item.label,
          href: item.href,
        }
  ));

  ensure(JSON.stringify(simplifiedActualItems) === JSON.stringify(simplifiedExpectedItems), `${role}: 메뉴 정의가 기준값과 다릅니다.`, errors);
  if (JSON.stringify(simplifiedActualItems) === JSON.stringify(simplifiedExpectedItems)) {
    passes.push(`${role}: single/group 메뉴 구조가 기준과 일치`);
  }

  ensure(defaultPaths[role] === spec.defaultPath, `${role}: 기본 경로가 ${spec.defaultPath} 이어야 합니다.`, errors);
  if (defaultPaths[role] === spec.defaultPath) {
    passes.push(`${role}: 기본 경로 ${spec.defaultPath} 확인`);
  }

  for (const item of actualItems) {
    ensure(pageRouteSet.has(normalizeHref(item.href)), `${role}: 메뉴 경로 ${item.href} 에 대응하는 page.tsx 가 없습니다.`, errors);
    const requiredPaths = item.type === 'group'
      ? [item.href, ...item.items.map((leaf) => leaf.href)]
      : [item.href];

    if (item.type === 'single') {
      ensure(!('items' in item), `${role}: single 메뉴 ${item.label} 에 items 가 있으면 안 됩니다.`, errors);
    } else {
      ensure(item.items.length >= 2, `${role}: group 메뉴 ${item.label} 는 2개 이상의 2Depth 항목이 필요합니다.`, errors);
    }

    for (const href of requiredPaths) {
      ensure(pageRouteSet.has(normalizeHref(href)), `${role}: 경로 ${href} 에 대응하는 page.tsx 가 없습니다.`, errors);
      const matchedRole = pathRoleMap.find(({ prefix }) => normalizeHref(href).startsWith(prefix))?.role ?? null;
      ensure(matchedRole === role, `${role}: ${item.href} 접근 역할이 ${role} 과 다릅니다.`, errors);
    }
  }

  const menuRouteSet = new Set(
    actualItems.flatMap((item) => (
      item.type === 'group'
        ? [item.href, ...item.items.map((leaf) => leaf.href)]
        : [item.href]
    )).map(normalizeHref),
  );
  const orphanRoutes = pageRoutes.filter((route) => route.startsWith(`/${role.toLowerCase()}/`) && !menuRouteSet.has(normalizeHref(route)));
  ensure(orphanRoutes.length === 0, `${role}: 메뉴에 연결되지 않은 라우트가 있습니다: ${orphanRoutes.join(', ')}`, errors);
  if (orphanRoutes.length === 0) {
    passes.push(`${role}: 메뉴에 연결되지 않은 역할 라우트 없음`);
  }
}

console.log('메뉴 구조 검증 결과');
console.log('====================');
for (const line of passes) console.log(`PASS  ${line}`);
for (const line of errors) console.log(`FAIL  ${line}`);
console.log('');
console.log(`검사 대상 라우트: ${pageRoutes.length}개`);
console.log(`PASS: ${passes.length}`);
console.log(`FAIL: ${errors.length}`);

if (errors.length > 0) process.exit(1);
