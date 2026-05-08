/**
 * SRM 기능 체크리스트 생성 스크립트 v2
 * 사용: node scripts/checklist.mjs
 *
 * 체크 방식:
 *  th       - 테이블 컬럼 헤더(<th>) 존재 여부
 *  button   - 버튼(<button>) 텍스트 존재 여부
 *  label    - 폼 레이블(<label>) 텍스트 존재 여부
 *  option   - <select> 옵션 텍스트 존재 여부
 *  input    - <input>/<select>/<textarea> 개수 > 0
 *  click    - 버튼 클릭 후 특정 텍스트/요소 노출 여부 (모달·드로어)
 *  text-el  - 특정 DOM 요소 안 텍스트 (badge, span 등)
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../screenshots/checklist");
const BASE_URL = "http://localhost:3000";
const VIEWPORT = { width: 1440, height: 900 };

mkdirSync(OUT_DIR, { recursive: true });

// ─── 체크 실행기 ──────────────────────────────────────────────────────────────
async function runCheck(page, check) {
  try {
    switch (check.type) {
      case "th":
        // 테이블 컬럼 헤더
        return (await page.locator(`th:has-text("${check.text}")`).count()) > 0;

      case "button":
        // 버튼 텍스트
        return (await page.locator(`button:has-text("${check.text}")`).count()) > 0;

      case "label":
        // 폼 레이블
        return (await page.locator(`label:has-text("${check.text}")`).count()) > 0;

      case "option":
        // select 옵션값
        return (await page.locator(`option:has-text("${check.text}")`).count()) > 0;

      case "input":
        // 실제 입력 요소 개수
        return (
          (await page.locator('input:not([type="checkbox"]):not([type="radio"])').count()) > 0 ||
          (await page.locator("select").count()) > 0 ||
          (await page.locator("textarea").count()) > 0
        );

      case "click": {
        // 버튼 클릭 후 특정 텍스트 노출 확인
        const btn = page.locator(`button:has-text("${check.buttonText}")`).first();
        if ((await btn.count()) === 0) return false;
        await btn.click();
        await page.waitForTimeout(600);
        const found = (await page.locator(`text="${check.checkText}"`).count()) > 0
          || (check.checkSelector && (await page.locator(check.checkSelector).count()) > 0);
        await page.keyboard.press("Escape");
        await page.waitForTimeout(300);
        return found;
      }

      case "text-el":
        // 특정 selector 안에 텍스트 존재
        return (await page.locator(`${check.selector}:has-text("${check.text}")`).count()) > 0;

      default:
        return false;
    }
  } catch {
    return false;
  }
}

// ─── 스펙 체크 항목 ───────────────────────────────────────────────────────────
const SPEC = [
  // ══ B 사업담당자 ══════════════════════════════════════════════════════════════
  {
    role: "B", featureNo: "1.1.1", feature: "대시보드",
    path: "/b/dashboard", screenCount: 3,
    checks: [
      { label: "캘린더 UI 표시", type: "text-el", selector: "div,section", text: "캘린더" },
      { label: "공지사항 목록 섹션", type: "text-el", selector: "div,h2,h3,span", text: "공지사항" },
    ],
  },
  {
    role: "B", featureNo: "1.2.1", feature: "견적요청 (등록 폼)",
    path: "/b/quote-requests", screenCount: 3,
    checks: [
      { label: "신규/등록 버튼 존재", type: "button", text: "신규" },
      { label: "클릭 시 견적요청명 입력 필드 노출", type: "click", buttonText: "신규", checkText: "견적요청명" },
      { label: "클릭 시 견적담당 필드 노출", type: "click", buttonText: "신규", checkText: "견적담당" },
      { label: "클릭 시 업체추가 버튼 노출", type: "click", buttonText: "신규", checkText: "업체추가" },
      { label: "클릭 시 견적마감일시 필드 노출", type: "click", buttonText: "신규", checkText: "마감" },
    ],
  },
  {
    role: "B", featureNo: "1.2.2", feature: "견적요청목록",
    path: "/b/quote-requests", screenCount: 2,
    checks: [
      { label: "테이블 컬럼 - 견적요청번호", type: "th", text: "견적요청번호" },
      { label: "테이블 컬럼 - 견적유형", type: "th", text: "견적유형" },
      { label: "테이블 컬럼 - 상태", type: "th", text: "상태" },
      { label: "테이블 컬럼 - 업체명", type: "th", text: "업체명" },
      { label: "견적금액 조회 기능 (행 클릭 or 버튼)", type: "text-el", selector: "td,button,span", text: "금액" },
    ],
  },
  {
    role: "B", featureNo: "1.3.1", feature: "발주계약요청 (등록 폼)",
    path: "/b/orders", screenCount: 2,
    checks: [
      { label: "신규/발주계약요청 등록 버튼", type: "button", text: "신규" },
      { label: "클릭 시 계약방법 선택 (수의계약/경쟁입찰) 노출", type: "click", buttonText: "신규", checkText: "수의계약" },
      { label: "클릭 시 낙찰자 선정방법 노출", type: "click", buttonText: "신규", checkText: "낙찰자" },
      { label: "클릭 시 계약명 입력 필드 노출", type: "click", buttonText: "신규", checkText: "계약명" },
      { label: "클릭 시 추정금액 필드 노출", type: "click", buttonText: "신규", checkText: "추정금액" },
      { label: "클릭 시 체크리스트 섹션 노출", type: "click", buttonText: "신규", checkText: "체크리스트" },
    ],
  },
  {
    role: "B", featureNo: "1.3.2", feature: "발주계약요청목록",
    path: "/b/orders", screenCount: 1,
    checks: [
      { label: "테이블 컬럼 - 요청번호", type: "th", text: "요청번호" },
      { label: "테이블 컬럼 - 계약명", type: "th", text: "계약명" },
      { label: "테이블 컬럼 - 수주계약번호", type: "th", text: "수주계약번호" },
      { label: "테이블 컬럼 - 수주계약명", type: "th", text: "수주계약명" },
      { label: "테이블 컬럼 - 체크리스트", type: "th", text: "체크리스트" },
      { label: "테이블 컬럼 - 진행상태", type: "th", text: "진행상태" },
    ],
  },
  {
    role: "B", featureNo: "1.4.1", feature: "입찰계획목록",
    path: "/b/bids", screenCount: 1,
    checks: [
      { label: "테이블 컬럼 - 입찰건명 또는 계약명", type: "th", text: "계약명" },
      { label: "테이블 컬럼 - 상태", type: "th", text: "상태" },
    ],
  },
  {
    role: "B", featureNo: "1.5.1", feature: "입찰심사",
    path: "/b/bid-review", screenCount: 2,
    checks: [
      { label: "심사대상 목록 테이블", type: "th", text: "입찰" },
      { label: "평가 점수 입력 필드", type: "input" },
      { label: "제출 버튼", type: "button", text: "제출" },
    ],
  },
  {
    role: "B", featureNo: "1.6.1", feature: "발주계약요청현황 (마이페이지)",
    path: "/b/mypage", screenCount: 2,
    checks: [
      { label: "발주요청현황 탭 또는 섹션", type: "text-el", selector: "button,a,h2,h3,span", text: "발주" },
      { label: "진행상황 목록 테이블", type: "th", text: "상태" },
    ],
  },
  {
    role: "B", featureNo: "1.6.2", feature: "협력업체메일발송 (마이페이지)",
    path: "/b/mypage", screenCount: 1,
    checks: [
      { label: "메일발송 탭 또는 버튼", type: "text-el", selector: "button,a,span", text: "메일" },
      { label: "발송 버튼", type: "button", text: "발송" },
    ],
  },
  {
    role: "B", featureNo: "1.6.3", feature: "시스템수정요청 (마이페이지)",
    path: "/b/mypage", screenCount: 2,
    checks: [
      { label: "수정요청 탭 또는 섹션", type: "text-el", selector: "button,a,span", text: "수정요청" },
      { label: "전송 버튼", type: "button", text: "전송" },
    ],
  },

  // ══ V 협력업체 ════════════════════════════════════════════════════════════════
  {
    role: "V", featureNo: "2.1.1", feature: "대시보드",
    path: "/v/dashboard", screenCount: 1,
    checks: [
      { label: "공지사항 섹션", type: "text-el", selector: "div,h2,h3,span", text: "공지사항" },
      { label: "현황 또는 진행 정보", type: "text-el", selector: "div,span", text: "현황" },
    ],
  },
  {
    role: "V", featureNo: "2.2.1", feature: "견적요청목록",
    path: "/v/quotes", screenCount: 2,
    checks: [
      { label: "테이블 컬럼 - 견적요청번호", type: "th", text: "견적요청번호" },
      { label: "테이블 컬럼 - 상태", type: "th", text: "상태" },
      { label: "테이블 컬럼 - 마감일", type: "th", text: "마감" },
      { label: "견적금액 조회 버튼 또는 링크", type: "text-el", selector: "button,a,td", text: "금액" },
    ],
  },
  {
    role: "V", featureNo: "2.2.2", feature: "견적작성",
    path: "/v/quotes", screenCount: 1,
    checks: [
      { label: "견적작성 버튼", type: "button", text: "견적작성" },
      { label: "클릭 시 품목별 금액 입력 필드 노출", type: "click", buttonText: "견적작성", checkText: "금액" },
      { label: "클릭 시 첨부파일 등록 기능 노출", type: "click", buttonText: "견적작성", checkText: "첨부" },
    ],
  },
  {
    role: "V", featureNo: "2.3.1", feature: "입찰공고 목록",
    path: "/v/bid-pipeline", screenCount: 2,
    checks: [
      { label: "테이블 컬럼 - 입찰공고번호", type: "th", text: "입찰공고번호" },
      { label: "테이블 컬럼 - 계약방법", type: "th", text: "계약방법" },
      { label: "테이블 컬럼 - 낙찰방법", type: "th", text: "낙찰방법" },
      { label: "테이블 컬럼 - 참여신청마감", type: "th", text: "마감" },
      { label: "공고 상세 조회 기능 (행 클릭)", type: "text-el", selector: "td", text: "공고" },
    ],
  },
  {
    role: "V", featureNo: "2.3.2", feature: "입찰참여신청",
    path: "/v/bid-pipeline", screenCount: 1,
    checks: [
      { label: "참여신청 버튼", type: "button", text: "신청" },
      { label: "서류 업로드 기능", type: "text-el", selector: "button,label,span", text: "업로드" },
      { label: "첨부파일 체크리스트", type: "text-el", selector: "div,ul,li,span", text: "체크리스트" },
    ],
  },
  {
    role: "V", featureNo: "2.4.1", feature: "자가심사",
    path: "/v/bid-pipeline", screenCount: 2,
    checks: [
      { label: "자가심사 탭 또는 섹션", type: "text-el", selector: "button,a,h3,span", text: "자가심사" },
      { label: "심사 응답 입력 (라디오/체크박스)", type: "input" },
      { label: "제출 버튼", type: "button", text: "제출" },
    ],
  },
  {
    role: "V", featureNo: "2.4.2", feature: "투찰",
    path: "/v/bid-pipeline", screenCount: 2,
    checks: [
      { label: "투찰 탭 또는 섹션", type: "text-el", selector: "button,a,h3,span", text: "투찰" },
      { label: "투찰 금액 입력 필드", type: "label", text: "투찰" },
      { label: "상세견적서 첨부 기능", type: "text-el", selector: "button,label,span", text: "견적서" },
      { label: "입찰포기 버튼", type: "button", text: "포기" },
    ],
  },
  {
    role: "V", featureNo: "2.5.1", feature: "보증서제출",
    path: "/v/contracts", screenCount: 2,
    checks: [
      { label: "보증서 제출 버튼 또는 섹션", type: "text-el", selector: "button,h3,span", text: "보증서" },
      { label: "계약이행보증 항목", type: "text-el", selector: "td,li,span,label", text: "계약이행" },
      { label: "하자이행보증 항목", type: "text-el", selector: "td,li,span,label", text: "하자이행" },
    ],
  },
  {
    role: "V", featureNo: "2.6.2", feature: "입찰참여현황 (마이페이지)",
    path: "/v/bid-history", screenCount: 2,
    checks: [
      { label: "테이블 컬럼 - 입찰건명", type: "th", text: "입찰" },
      { label: "테이블 컬럼 - 상태", type: "th", text: "상태" },
    ],
  },
  {
    role: "V", featureNo: "2.6.3", feature: "투찰참여현황 (마이페이지)",
    path: "/v/bid-history", screenCount: 2,
    checks: [
      { label: "투찰 이력 테이블", type: "text-el", selector: "th,td,span", text: "투찰" },
      { label: "투찰 금액 컬럼", type: "text-el", selector: "th,td", text: "금액" },
    ],
  },
  {
    role: "V", featureNo: "2.6.4", feature: "기업정보수정 (마이페이지)",
    path: "/v/company", screenCount: 2,
    checks: [
      { label: "기업정보 입력 폼 필드 존재", type: "input" },
      { label: "저장 버튼", type: "button", text: "저장" },
      { label: "사업자등록증 관련 항목", type: "text-el", selector: "label,span,td", text: "사업자" },
    ],
  },

  // ══ C 계약담당자 ══════════════════════════════════════════════════════════════
  {
    role: "C", featureNo: "3.1.1", feature: "대시보드",
    path: "/c/dashboard", screenCount: 3,
    checks: [
      { label: "캘린더 또는 현황 표시", type: "text-el", selector: "div,h2,h3,span", text: "캘린더" },
      { label: "공지사항 섹션", type: "text-el", selector: "div,h2,h3,span", text: "공지사항" },
    ],
  },
  {
    role: "C", featureNo: "3.2.1", feature: "견적요청 (등록 폼)",
    path: "/c/quote-requests", screenCount: 3,
    checks: [
      { label: "신규 버튼", type: "button", text: "신규" },
      { label: "클릭 시 견적요청명 입력 필드 노출", type: "click", buttonText: "신규", checkText: "견적요청명" },
      { label: "클릭 시 업체추가 기능 노출", type: "click", buttonText: "신규", checkText: "업체추가" },
      { label: "클릭 시 견적마감일시 필드 노출", type: "click", buttonText: "신규", checkText: "마감" },
    ],
  },
  {
    role: "C", featureNo: "3.2.2", feature: "견적요청목록",
    path: "/c/quote-requests", screenCount: 2,
    checks: [
      { label: "테이블 컬럼 - 견적요청번호", type: "th", text: "견적요청번호" },
      { label: "테이블 컬럼 - 상태", type: "th", text: "상태" },
      { label: "견적금액 조회 기능", type: "text-el", selector: "td,button", text: "금액" },
    ],
  },
  {
    role: "C", featureNo: "3.3.1", feature: "발주계약요청 (등록 폼)",
    path: "/c/orders", screenCount: 2,
    checks: [
      { label: "신규 버튼", type: "button", text: "신규" },
      { label: "클릭 시 계약방법 선택 (수의계약/경쟁입찰) 노출", type: "click", buttonText: "신규", checkText: "수의계약" },
      { label: "클릭 시 계약명 입력 필드 노출", type: "click", buttonText: "신규", checkText: "계약명" },
      { label: "클릭 시 추정금액 필드 노출", type: "click", buttonText: "신규", checkText: "추정금액" },
    ],
  },
  {
    role: "C", featureNo: "3.3.2", feature: "발주계약요청목록",
    path: "/c/orders", screenCount: 1,
    checks: [
      { label: "테이블 컬럼 - 요청번호", type: "th", text: "요청번호" },
      { label: "테이블 컬럼 - 계약명", type: "th", text: "계약명" },
      { label: "테이블 컬럼 - 수주계약번호", type: "th", text: "수주계약번호" },
      { label: "테이블 컬럼 - 진행상태", type: "th", text: "진행상태" },
    ],
  },
  {
    role: "C", featureNo: "3.3.3", feature: "발주계약요청접수",
    path: "/c/orders", screenCount: 1,
    checks: [
      { label: "접수 버튼", type: "button", text: "접수" },
      { label: "반려 버튼", type: "button", text: "반려" },
    ],
  },
  {
    role: "C", featureNo: "3.3.4", feature: "발주계약계획등록",
    path: "/c/orders", screenCount: 1,
    checks: [
      { label: "발주계획 등록 버튼", type: "button", text: "계획" },
      { label: "발주방식 입력 필드 또는 라벨", type: "label", text: "발주방식" },
      { label: "그룹웨어 전자결재 안내 텍스트", type: "text-el", selector: "div,span,p", text: "그룹웨어" },
    ],
  },
  {
    role: "C", featureNo: "3.4.1", feature: "입찰계획등록",
    path: "/c/bids", screenCount: 1,
    checks: [
      { label: "입찰계획 등록 버튼", type: "button", text: "등록" },
      { label: "테이블 컬럼 - 입찰방식 또는 계약방법", type: "th", text: "계약방법" },
      { label: "심사기준 관련 항목", type: "text-el", selector: "th,td,label,span", text: "심사" },
    ],
  },
  {
    role: "C", featureNo: "3.4.2", feature: "입찰공고등록",
    path: "/c/bids", screenCount: 1,
    checks: [
      { label: "입찰공고 등록/공고 버튼", type: "button", text: "공고" },
      { label: "참여신청마감일시 입력 필드", type: "text-el", selector: "label,th,td,span", text: "참여신청마감" },
    ],
  },
  {
    role: "C", featureNo: "3.4.3", feature: "입찰계획목록",
    path: "/c/bids", screenCount: 1,
    checks: [
      { label: "테이블 컬럼 - 입찰건명 또는 계약명", type: "th", text: "계약명" },
      { label: "테이블 컬럼 - 상태", type: "th", text: "상태" },
    ],
  },
  {
    role: "C", featureNo: "3.5.1", feature: "업체참여신청현황",
    path: "/c/evaluations", screenCount: 2,
    checks: [
      { label: "참여업체 목록 테이블", type: "th", text: "업체" },
      { label: "참여신청일시 컬럼", type: "th", text: "신청일" },
      { label: "제출서류 컬럼 또는 항목", type: "text-el", selector: "th,td,span", text: "제출서류" },
      { label: "유찰/재공고 버튼", type: "button", text: "재공고" },
    ],
  },
  {
    role: "C", featureNo: "3.5.2", feature: "입찰심사",
    path: "/c/evaluations", screenCount: 2,
    checks: [
      { label: "심사 점수 입력 필드", type: "input" },
      { label: "제출 버튼", type: "button", text: "제출" },
    ],
  },
  {
    role: "C", featureNo: "3.5.3", feature: "입찰심사관리",
    path: "/c/evaluations", screenCount: 2,
    checks: [
      { label: "평가자 설정 기능", type: "text-el", selector: "label,button,th,td,span", text: "평가자" },
      { label: "심사항목 설정", type: "text-el", selector: "label,th,td,span", text: "심사항목" },
      { label: "심사시작 버튼", type: "button", text: "심사시작" },
    ],
  },
  {
    role: "C", featureNo: "3.6.1", feature: "개찰/낙찰조건관리",
    path: "/c/awards", screenCount: 1,
    checks: [
      { label: "개찰 버튼 존재", type: "button", text: "개찰" },
      { label: "낙찰조건 관련 항목", type: "text-el", selector: "label,th,td,span,h3", text: "낙찰" },
    ],
  },
  {
    role: "C", featureNo: "3.6.2", feature: "예정가관리",
    path: "/c/awards", screenCount: 3,
    checks: [
      { label: "예정가격 관련 항목", type: "text-el", selector: "label,button,th,td,span", text: "예정가" },
      { label: "예비가격표 항목", type: "text-el", selector: "label,button,th,td,span", text: "예비가" },
      { label: "복수예비가격표 항목", type: "text-el", selector: "label,button,span", text: "복수예비" },
    ],
  },
  {
    role: "C", featureNo: "3.6.3", feature: "개찰",
    path: "/c/awards", screenCount: 2,
    checks: [
      { label: "개찰 실행 버튼", type: "button", text: "개찰" },
      { label: "낙찰하한율 / 낙찰하한금액 표시", type: "text-el", selector: "th,td,span", text: "낙찰하한" },
      { label: "입찰참여 여부 컬럼", type: "text-el", selector: "th,td", text: "참여" },
    ],
  },
  {
    role: "C", featureNo: "3.6.4", feature: "업체선정",
    path: "/c/awards", screenCount: 3,
    checks: [
      { label: "업체선정 버튼 또는 섹션", type: "button", text: "업체선정" },
      { label: "우선협상대상자 선정 기능", type: "text-el", selector: "button,span,td", text: "우선협상" },
      { label: "낙찰결과 표시", type: "text-el", selector: "th,td,span", text: "낙찰결과" },
    ],
  },
  {
    role: "C", featureNo: "3.7.1", feature: "발주계약목록",
    path: "/c/contracts", screenCount: 2,
    checks: [
      { label: "테이블 컬럼 - 계약명", type: "th", text: "계약명" },
      { label: "테이블 컬럼 - 상태", type: "th", text: "상태" },
    ],
  },
  {
    role: "C", featureNo: "3.7.2", feature: "계약서등록",
    path: "/c/contracts", screenCount: 2,
    checks: [
      { label: "계약서 등록 버튼", type: "button", text: "계약서" },
      { label: "체결 버튼 (상태값 변경)", type: "button", text: "체결" },
      { label: "PMS 연동 안내", type: "text-el", selector: "span,p,div", text: "PMS" },
    ],
  },
  {
    role: "C", featureNo: "3.7.3", feature: "보증서제출확인",
    path: "/c/contracts", screenCount: 1,
    checks: [
      { label: "보증서 관련 섹션", type: "text-el", selector: "th,td,span,h3", text: "보증서" },
      { label: "승인 버튼", type: "button", text: "승인" },
    ],
  },
  {
    role: "C", featureNo: "3.8.1", feature: "발주계약요청현황 (마이페이지)",
    path: "/c/mypage", screenCount: 2,
    checks: [
      { label: "발주요청현황 탭", type: "text-el", selector: "button,a,span", text: "발주" },
      { label: "진행상황 목록", type: "th", text: "상태" },
    ],
  },
  {
    role: "C", featureNo: "3.8.2", feature: "협력업체메일발송 (마이페이지)",
    path: "/c/mypage", screenCount: 1,
    checks: [
      { label: "메일발송 탭", type: "text-el", selector: "button,a,span", text: "메일" },
      { label: "발송 버튼", type: "button", text: "발송" },
    ],
  },
  {
    role: "C", featureNo: "3.8.3", feature: "시스템수정요청 (마이페이지)",
    path: "/c/mypage", screenCount: 2,
    checks: [
      { label: "수정요청 탭", type: "text-el", selector: "button,a,span", text: "수정요청" },
      { label: "전송 버튼", type: "button", text: "전송" },
    ],
  },

  // ══ A 관리자 ══════════════════════════════════════════════════════════════════
  {
    role: "A", featureNo: "4.1.1", feature: "사용자관리",
    path: "/a/users", screenCount: 2,
    checks: [
      { label: "테이블 컬럼 - 사용자명 또는 이름", type: "th", text: "이름" },
      { label: "테이블 컬럼 - 역할/권한", type: "th", text: "권한" },
      { label: "권한 변경 기능 (버튼 또는 select)", type: "text-el", selector: "button,select", text: "권한" },
    ],
  },
  {
    role: "A", featureNo: "4.2.1", feature: "협력업체 승인관리",
    path: "/a/vendors", screenCount: 2,
    checks: [
      { label: "테이블 컬럼 - 업체명", type: "th", text: "업체명" },
      { label: "승인 버튼", type: "button", text: "승인" },
      { label: "보류/반려 버튼", type: "button", text: "반려" },
      { label: "사업자등록증 확인 항목", type: "text-el", selector: "th,td,span,label", text: "사업자" },
    ],
  },
  {
    role: "A", featureNo: "4.2.2", feature: "협력업체 목록",
    path: "/a/vendors", screenCount: 2,
    checks: [
      { label: "테이블 컬럼 - 업체명", type: "th", text: "업체명" },
      { label: "비밀번호 초기화 버튼", type: "button", text: "초기화" },
      { label: "계약 체결건수 컬럼", type: "text-el", selector: "th,td,span", text: "체결" },
    ],
  },
  {
    role: "A", featureNo: "4.3.1", feature: "품목 그룹관리",
    path: "/a/items", screenCount: 2,
    checks: [
      { label: "대분류(공사/물품구매/용역) 항목", type: "text-el", selector: "td,span,button", text: "공사" },
      { label: "중분류 항목 존재", type: "text-el", selector: "td,span", text: "중분류" },
      { label: "그룹 추가/등록 버튼", type: "button", text: "추가" },
    ],
  },
  {
    role: "A", featureNo: "4.3.2", feature: "품목관리",
    path: "/a/items", screenCount: 2,
    checks: [
      { label: "소분류 품목 목록", type: "text-el", selector: "td,span", text: "소분류" },
      { label: "품목 등록 버튼", type: "button", text: "등록" },
      { label: "품목명 컬럼", type: "th", text: "품목" },
    ],
  },
  {
    role: "A", featureNo: "4.4.1", feature: "시스템 대시보드",
    path: "/a/system", screenCount: 2,
    checks: [
      { label: "메뉴 사용내역 탭 또는 섹션", type: "text-el", selector: "button,h3,span", text: "사용" },
      { label: "통계 차트 또는 수치", type: "text-el", selector: "div,span,h3", text: "통계" },
    ],
  },
  {
    role: "A", featureNo: "4.4.2", feature: "시스템 요청사항",
    path: "/a/system", screenCount: 2,
    checks: [
      { label: "요청사항 목록 테이블", type: "th", text: "요청" },
      { label: "상세 조회 기능 (행 클릭 or 버튼)", type: "text-el", selector: "button,td", text: "상세" },
    ],
  },
  {
    role: "A", featureNo: "4.4.3", feature: "공지사항 관리",
    path: "/a/system", screenCount: 2,
    checks: [
      { label: "공지사항 등록 버튼", type: "button", text: "공지사항" },
      { label: "공지사항 목록 테이블", type: "th", text: "제목" },
    ],
  },
];

// ─── 메인 ────────────────────────────────────────────────────────────────────
const browser = await chromium.launch();
const browserContext = await browser.newContext({ viewport: VIEWPORT });
const page = await browserContext.newPage();

let currentRole = null;
const results = [];
const visitedPaths = new Set();

for (const spec of SPEC) {
  const { role, featureNo, feature, path, screenCount, checks } = spec;

  if (role !== currentRole) {
    await page.goto(BASE_URL);
    await page.evaluate((r) => localStorage.setItem("srm_role", r), role);
    currentRole = role;
    visitedPaths.clear();
  }

  let pageLoaded = false;
  try {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(600);
    pageLoaded = true;

    // 스크린샷 (경로당 1장)
    if (!visitedPaths.has(path)) {
      const safeName = `${role}_${featureNo.replace(/\./g, "-")}_${feature.replace(/[^가-힣a-zA-Z0-9]/g, "_")}`;
      await page.screenshot({ path: join(OUT_DIR, `${safeName}.png`), fullPage: true });
      visitedPaths.add(path);
    }
  } catch (e) {
    console.log(`✗ [${role}] ${featureNo} — 페이지 오류`);
  }

  const checkResults = [];
  for (const check of checks) {
    const found = pageLoaded ? await runCheck(page, check) : false;
    checkResults.push({ label: check.label, found });
  }

  const passCount = checkResults.filter((c) => c.found).length;
  const icon = !pageLoaded ? "✗" : passCount === checkResults.length ? "✓" : `${passCount}/${checkResults.length}`;
  console.log(`${icon} [${role}] ${featureNo} ${feature}`);

  results.push({ role, featureNo, feature, path, screenCount, checkResults, pageLoaded });
}

await browser.close();

// ─── 마크다운 생성 ────────────────────────────────────────────────────────────
const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
const roleNames = { B: "사업담당자", V: "협력업체", C: "계약담당자", A: "관리자" };
const roleOrder = ["B", "V", "C", "A"];

let md = `# SRM 프로토타입 기능 체크리스트\n\n`;
md += `> 생성일시: ${now}  \n`;
md += `> 기준: SRM_기능정의_요약.md  \n`;
md += `> 체크 방식: DOM 요소 직접 확인 (th컬럼·button·label·click-open 등)\n\n`;
md += `> 총 기능: ${SPEC.length}개 / 체크항목: ${SPEC.reduce((s, i) => s + i.checks.length, 0)}개\n\n`;

md += `## 역할별 달성률\n\n`;
md += `| 역할 | 기능 수 | 통과 | 미통과 | 달성률 |\n`;
md += `|-----|--------|------|--------|-------|\n`;
for (const role of roleOrder) {
  const rr = results.filter((r) => r.role === role);
  const total = rr.reduce((s, r) => s + r.checkResults.length, 0);
  const passed = rr.reduce((s, r) => s + r.checkResults.filter((c) => c.found).length, 0);
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
  md += `| **${roleNames[role]} (${role})** | ${rr.length}기능 | ${passed} | ${total - passed} | ${pct}% |\n`;
}
md += `\n`;

for (const role of roleOrder) {
  md += `---\n\n## ${roleNames[role]} (${role})\n\n`;
  for (const { featureNo, feature, path, screenCount, checkResults, pageLoaded } of results.filter((r) => r.role === role)) {
    const total = checkResults.length;
    const passed = checkResults.filter((c) => c.found).length;
    const icon = !pageLoaded ? "🔴" : passed === total ? "🟢" : passed > 0 ? "🟡" : "🔴";
    const status = !pageLoaded ? "페이지 없음" : passed === total ? "구현 완료" : passed > 0 ? `일부 구현 (${passed}/${total})` : "미구현";
    md += `### ${icon} ${featureNo} ${feature} — ${status}\n`;
    md += `- 경로: \`${path}\` | 스펙 화면수: ${screenCount}\n\n`;
    for (const { label, found } of checkResults) {
      md += `- [${found ? "x" : " "}] ${label}\n`;
    }
    md += `\n`;
  }
}

md += `---\n\n## 미구현 / 보완 필요 목록\n\n`;
for (const role of roleOrder) {
  const incomplete = results.filter((r) => r.role === role && !r.checkResults.every((c) => c.found));
  for (const { featureNo, feature, checkResults } of incomplete) {
    const missing = checkResults.filter((c) => !c.found);
    if (!missing.length) continue;
    md += `### [${role}] ${featureNo} ${feature}\n`;
    for (const { label } of missing) md += `- [ ] ${label}\n`;
    md += `\n`;
  }
}

const outFile = join(OUT_DIR, "SRM_체크리스트.md");
writeFileSync(outFile, md, "utf-8");

const totalChecks = results.reduce((s, r) => s + r.checkResults.length, 0);
const totalPassed = results.reduce((s, r) => s + r.checkResults.filter((c) => c.found).length, 0);
console.log(`\n✅ 완료 → ${outFile}`);
console.log(`   전체 달성률: ${totalPassed}/${totalChecks} (${Math.round((totalPassed / totalChecks) * 100)}%)`);
