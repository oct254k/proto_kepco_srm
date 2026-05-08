/**
 * Playwright 스크린샷 스크립트
 * 사용: node scripts/screenshot.mjs
 * (dev 서버가 localhost:3000에서 실행 중이어야 함)
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../screenshots");
const BASE_URL = "http://localhost:3000";
const VIEWPORT = { width: 1440, height: 900 };

const PAGES = [
  // B 사업담당자
  { role: "B", path: "/b/dashboard",      name: "B_01_대시보드" },
  { role: "B", path: "/b/quote-requests", name: "B_02_견적요청목록" },
  { role: "B", path: "/b/orders",         name: "B_03_발주계약관리" },
  { role: "B", path: "/b/bids",           name: "B_04_입찰현황" },
  { role: "B", path: "/b/bid-review",     name: "B_05_사업접수현황" },
  { role: "B", path: "/b/mypage",         name: "B_06_마이페이지" },

  // C 계약담당자
  { role: "C", path: "/c/dashboard",      name: "C_01_대시보드" },
  { role: "C", path: "/c/quote-requests", name: "C_02_견적요청목록" },
  { role: "C", path: "/c/orders",         name: "C_03_발주계약관리" },
  { role: "C", path: "/c/bids",           name: "C_04_입찰관리" },
  { role: "C", path: "/c/awards",         name: "C_05_낙찰관리" },
  { role: "C", path: "/c/evaluations",    name: "C_06_업체평가" },
  { role: "C", path: "/c/contracts",      name: "C_07_계약관리" },
  { role: "C", path: "/c/mypage",         name: "C_08_마이페이지" },

  // V 협력업체
  { role: "V", path: "/v/dashboard",      name: "V_01_대시보드" },
  { role: "V", path: "/v/quotes",         name: "V_02_견적목록" },
  { role: "V", path: "/v/bid-pipeline",   name: "V_03_입찰파이프라인" },
  { role: "V", path: "/v/bid-history",    name: "V_04_입찰이력" },
  { role: "V", path: "/v/contracts",      name: "V_05_계약목록" },
  { role: "V", path: "/v/company",        name: "V_06_업체정보" },

  // A 시스템관리자
  { role: "A", path: "/a/items",          name: "A_01_품목관리" },
  { role: "A", path: "/a/vendors",        name: "A_02_협력업체관리" },
  { role: "A", path: "/a/users",          name: "A_03_사용자관리" },
  { role: "A", path: "/a/system",         name: "A_04_시스템설정" },

  // 로그인
  { role: "B", path: "/login",            name: "Z_01_로그인" },
];

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEWPORT });
const page = await context.newPage();

let currentRole = null;

for (const { role, path, name } of PAGES) {
  // 역할이 바뀔 때만 localStorage 세팅
  if (role !== currentRole) {
    await page.goto(BASE_URL);
    await page.evaluate((r) => localStorage.setItem("srm_role", r), role);
    currentRole = role;
  }

  await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });

  // 폰트·이미지 로드 대기
  await page.waitForTimeout(500);

  const file = join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`✓ ${name}.png`);
}

await browser.close();
console.log(`\n완료 — ${OUT_DIR}`);
