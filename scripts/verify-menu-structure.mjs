import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const menuFile = path.join(repoRoot, 'src/lib/menu.ts');
const accessFile = path.join(repoRoot, 'src/lib/access.ts');
const appRoot = path.join(repoRoot, 'src/app');

const EXPECTED = {
  B: {
    defaultPath: '/b/dashboard/',
    groups: [
      { label: '대시보드', href: '/b/dashboard/', items: [{ label: '대시보드', href: '/b/dashboard/' }] },
      { label: '견적', href: '/b/quote-requests/', items: [{ label: '견적요청 관리', href: '/b/quote-requests/' }] },
      { label: '발주', href: '/b/orders/', items: [{ label: '발주계약요청', href: '/b/orders/' }] },
      {
        label: '입찰',
        href: '/b/bids/',
        items: [
          { label: '입찰계획·공고 조회', href: '/b/bids/' },
          { label: '입찰심사', href: '/b/bid-review/' },
        ],
      },
      { label: '마이페이지', href: '/b/mypage/', items: [{ label: '마이페이지', href: '/b/mypage/' }] },
    ],
  },
  V: {
    defaultPath: '/v/dashboard/',
    groups: [
      { label: '대시보드', href: '/v/dashboard/', items: [{ label: '대시보드', href: '/v/dashboard/' }] },
      { label: '견적', href: '/v/quotes/', items: [{ label: '견적작성·현황', href: '/v/quotes/' }] },
      {
        label: '입찰참여',
        href: '/v/bid-pipeline/',
        items: [
          { label: '입찰 파이프라인', href: '/v/bid-pipeline/' },
          { label: '입찰·투찰 현황', href: '/v/bid-history/' },
        ],
      },
      { label: '계약·보증', href: '/v/contracts/', items: [{ label: '계약·보증 관리', href: '/v/contracts/' }] },
      { label: '마이페이지', href: '/v/company/', items: [{ label: '기업정보', href: '/v/company/' }] },
    ],
  },
  C: {
    defaultPath: '/c/dashboard/',
    groups: [
      { label: '대시보드', href: '/c/dashboard/', items: [{ label: '대시보드', href: '/c/dashboard/' }] },
      {
        label: '발주관리',
        href: '/c/orders/',
        items: [
          { label: '발주계약요청·계획', href: '/c/orders/' },
          { label: '견적요청 관리', href: '/c/quote-requests/' },
        ],
      },
      { label: '입찰관리', href: '/c/bids/', items: [{ label: '입찰계획·공고', href: '/c/bids/' }] },
      { label: '참여업체평가', href: '/c/evaluations/', items: [{ label: '평가·심사관리', href: '/c/evaluations/' }] },
      { label: '낙찰관리', href: '/c/awards/', items: [{ label: '낙찰관리', href: '/c/awards/' }] },
      { label: '계약관리', href: '/c/contracts/', items: [{ label: '계약관리', href: '/c/contracts/' }] },
      { label: '마이페이지', href: '/c/mypage/', items: [{ label: '마이페이지', href: '/c/mypage/' }] },
    ],
  },
  A: {
    defaultPath: '/a/system/',
    groups: [
      { label: '사용자관리', href: '/a/users/', items: [{ label: '사용자·협력업체 관리', href: '/a/users/' }] },
      { label: '협력업체관리', href: '/a/vendors/', items: [{ label: '협력업체 승인관리', href: '/a/vendors/' }] },
      { label: '기준정보(품목)', href: '/a/items/', items: [{ label: '품목 기준정보', href: '/a/items/' }] },
      { label: '시스템환경', href: '/a/system/', items: [{ label: '시스템 환경설정', href: '/a/system/' }] },
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
const menus = evaluateLiteral(extractLiteralBlock(menuSource, 'export const MENUS', '{', '}'));
const defaultPaths = evaluateLiteral(extractLiteralBlock(accessSource, 'const DEFAULT_PATHS', '{', '}'));
const pathRoleMap = evaluateLiteral(extractLiteralBlock(accessSource, 'const PATH_ROLE_MAP', '[', ']'));
const pageRoutes = collectPageRoutes(appRoot);
const pageRouteSet = new Set(pageRoutes.map(normalizeHref));
const errors = [];
const passes = [];

for (const [role, spec] of Object.entries(EXPECTED)) {
  const actualGroups = menus[role];
  ensure(Array.isArray(actualGroups), `${role}: MENUS 정의가 없습니다.`, errors);
  if (!Array.isArray(actualGroups)) continue;

  const simplifiedActualGroups = actualGroups.map((group) => ({
    label: group.label,
    href: group.href,
    items: group.items.map((item) => ({ label: item.label, href: item.href })),
  }));
  const simplifiedExpectedGroups = spec.groups.map((group) => ({
    label: group.label,
    href: group.href,
    items: group.items.map((item) => ({ label: item.label, href: item.href })),
  }));

  ensure(JSON.stringify(simplifiedActualGroups) === JSON.stringify(simplifiedExpectedGroups), `${role}: 메뉴 정의가 기준값과 다릅니다.`, errors);
  if (JSON.stringify(simplifiedActualGroups) === JSON.stringify(simplifiedExpectedGroups)) {
    passes.push(`${role}: 메뉴 라벨/링크/서브메뉴가 기준과 일치`);
  }

  ensure(defaultPaths[role] === spec.defaultPath, `${role}: 기본 경로가 ${spec.defaultPath} 이어야 합니다.`, errors);
  if (defaultPaths[role] === spec.defaultPath) {
    passes.push(`${role}: 기본 경로 ${spec.defaultPath} 확인`);
  }

  for (const group of actualGroups) {
    ensure(pageRouteSet.has(normalizeHref(group.href)), `${role}: 그룹 경로 ${group.href} 에 대응하는 page.tsx 가 없습니다.`, errors);
    for (const item of group.items) {
      ensure(pageRouteSet.has(normalizeHref(item.href)), `${role}: 서브 경로 ${item.href} 에 대응하는 page.tsx 가 없습니다.`, errors);
      const matchedRole = pathRoleMap.find(({ prefix }) => normalizeHref(item.href).startsWith(prefix))?.role ?? null;
      ensure(matchedRole === role, `${role}: ${item.href} 접근 역할이 ${role} 과 다릅니다.`, errors);
    }
  }

  const menuRouteSet = new Set(actualGroups.flatMap((group) => [group.href, ...group.items.map((item) => item.href)]).map(normalizeHref));
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
