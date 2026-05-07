"use client";

import React, { useState } from "react";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import Tabs from "@/components/Tabs";
import { useToast } from "@/components/Toast";
import {
  EVAL_BID_LIST,
  EVAL_CRITERIA,
  EVAL_REVIEWERS,
  EVAL_PARTICIPANTS_STATUS,
  METHOD_LABELS,
} from "@/lib/mock/bids";

const btn = (variant: "primary" | "secondary" | "danger" | "ghost" = "primary"): React.CSSProperties => ({
  padding: "6px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  border: variant === "primary" ? "1px solid #DFE8F0" : "1px solid #CFCFCF",
  background: variant === "primary" ? "#654024" : "#ffffff",
  color: variant === "primary" ? "#ffffff" : "#654024",
});

// ── Drawer 탭: 기준설정 ────────────────────────────────────────
function CriteriaTab() {
  const toast = useToast();
  const [criteria, setCriteria] = useState(EVAL_CRITERIA);

  const totalScore = criteria.reduce((s, c) => s + c.maxScore, 0);
  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 16, color: "#555" }}>기준 그룹:</span>
        <select style={{ padding: "5px 8px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit" }}>
          <option>표준_적격심사_2026</option>
          <option>표준_2단계경쟁_2026</option>
        </select>
        <button style={{ ...btn("secondary"), fontSize: 12 }}>+ 새 그룹 만들기</button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            {["항목명", "평가방식", "최고배점", "가중치", ""].map((h) => (
              <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((c, i) => (
            <tr key={c.id}>
              <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0" }}>
                <input style={{ width: "100%", padding: "4px 6px", border: "1px solid #e0e0e0", borderRadius: 3, fontSize: 16, fontFamily: "inherit" }} value={c.name} onChange={(e) => setCriteria(criteria.map((cr, ci) => ci === i ? { ...cr, name: e.target.value } : cr))} />
              </td>
              <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                <select style={{ padding: "3px 6px", border: "1px solid #e0e0e0", borderRadius: 3, fontSize: 15, fontFamily: "inherit" }} value={c.evalType} onChange={(e) => setCriteria(criteria.map((cr, ci) => ci === i ? { ...cr, evalType: e.target.value } : cr))}>
                  <option value="GRADE">GRADE</option>
                  <option value="SCORE">SCORE</option>
                  <option value="PASS_FAIL">PASS_FAIL</option>
                </select>
              </td>
              <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                <input type="number" style={{ width: 60, padding: "4px 6px", border: "1px solid #e0e0e0", borderRadius: 3, fontSize: 16, fontFamily: "inherit", textAlign: "center" }} value={c.maxScore} onChange={(e) => setCriteria(criteria.map((cr, ci) => ci === i ? { ...cr, maxScore: Number(e.target.value) } : cr))} />
              </td>
              <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                <input type="number" step="0.01" style={{ width: 70, padding: "4px 6px", border: "1px solid #e0e0e0", borderRadius: 3, fontSize: 16, fontFamily: "inherit", textAlign: "center" }} value={c.weight} onChange={(e) => setCriteria(criteria.map((cr, ci) => ci === i ? { ...cr, weight: Number(e.target.value) } : cr))} />
              </td>
              <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                <button style={{ ...btn("danger"), padding: "2px 8px", fontSize: 12 }} onClick={() => setCriteria(criteria.filter((_, ci) => ci !== i))}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{ ...btn("secondary"), fontSize: 12, marginTop: 8 }} onClick={() => setCriteria([...criteria, { id: `C00${criteria.length + 1}`, name: "새 항목", evalType: "SCORE", maxScore: 10, weight: 0.10 }])}>
        + 항목추가
      </button>
      <div style={{ display: "flex", gap: 20, marginTop: 12, padding: "10px 0", borderTop: "1px solid #e0e0e0", fontSize: 16 }}>
        <span>배점 합계: <strong style={{ color: totalScore === 100 ? "#065F46" : "#DC2626" }}>{totalScore}점</strong></span>
        <span>가중치 합계: <strong style={{ color: Math.abs(totalWeight - 1) < 0.001 ? "#065F46" : "#DC2626" }}>{totalWeight.toFixed(2)}</strong></span>
        <span>합격기준: <input type="number" defaultValue={60} style={{ width: 60, padding: "2px 6px", border: "1px solid #ccc", borderRadius: 3, fontSize: 16, fontFamily: "inherit" }} />점</span>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button style={btn("secondary")}>취소</button>
        <button style={btn("primary")} onClick={() => toast.show("기준설정이 저장되었습니다.", "success")}>기준설정 저장</button>
      </div>
    </div>
  );
}

// ── Drawer 탭: 위원배정 ────────────────────────────────────────
function ReviewersTab() {
  const toast = useToast();
  const [reviewers, setReviewers] = useState(EVAL_REVIEWERS);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <div>
      <button style={{ ...btn("primary"), fontSize: 12, marginBottom: 12 }} onClick={() => setSearchModalOpen(true)}>
        + 심사위원 추가 (내부 사용자 검색)
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            {["이름", "부서", "역할", "배정일", "상태"].map((h) => (
              <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reviewers.map((r, i) => (
            <tr key={r.id}>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{r.name}</td>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{r.dept}</td>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                <select style={{ padding: "3px 6px", border: "1px solid #e0e0e0", borderRadius: 3, fontSize: 15, fontFamily: "inherit" }} value={r.role} onChange={(e) => setReviewers(reviewers.map((rv, ri) => ri === i ? { ...rv, role: e.target.value } : rv))}>
                  <option value="LEAD">주심사</option>
                  <option value="MEMBER">심사위원</option>
                </select>
              </td>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{r.assignedAt}</td>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                <span style={{ color: "#065F46", fontSize: 15 }}>✅ {r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 16, color: "#555", marginTop: 10 }}>
        총 {reviewers.length}명 배정 (주심사 {reviewers.filter((r) => r.role === "LEAD").length}명, 심사위원 {reviewers.filter((r) => r.role === "MEMBER").length}명)
      </div>
      <div style={{ fontSize: 15, color: "#888", marginBottom: 12 }}>※ 최소 주심사(LEAD) 1명 이상 배정 필수</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button style={btn("secondary")} onClick={() => toast.show("배정 안내 메일이 발송되었습니다.", "info")}>배정 안내 메일 발송</button>
        <button style={btn("primary")} onClick={() => toast.show("위원 배정이 저장되었습니다.", "success")}>배정 저장</button>
      </div>

      <Modal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} title="심사위원 검색">
        <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
          <input style={{ flex: 1, padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit" }} placeholder="이름/부서 검색" />
          <button style={btn("primary")}>검색</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              {["이름", "부서", "직책", ""].map((h) => (
                <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: "홍길동", dept: "구매2팀", title: "과장" },
              { name: "이민준", dept: "전략팀", title: "대리" },
              { name: "박지영", dept: "IT팀", title: "팀장" },
            ].map((u, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{u.name}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{u.dept}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{u.title}</td>
                <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                  <button
                    style={{ ...btn("primary"), padding: "2px 8px", fontSize: 12 }}
                    onClick={() => {
                      setReviewers([...reviewers, { id: `R00${reviewers.length + 1}`, name: u.name, dept: u.dept, role: "MEMBER", assignedAt: "2026-04-22", status: "배정완료" }]);
                      setSearchModalOpen(false);
                      toast.show(`${u.name}님이 심사위원으로 배정되었습니다.`, "success");
                    }}
                  >
                    + 추가
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}

// ── Drawer 탭: 진행현황 ────────────────────────────────────────
function ProgressTab() {
  const total = EVAL_PARTICIPANTS_STATUS.length * EVAL_REVIEWERS.length;
  const done = EVAL_PARTICIPANTS_STATUS.reduce((s, p) => {
    return s + [p.r001, p.r002, p.r003].filter((v) => v === "제출").length;
  }, 0);
  const pct = Math.round((done / total) * 100);

  const statusIcon: Record<string, string> = { "제출": "✅", "진행중": "🟡", "미시작": "⬜" };

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "left" }}>업체명</th>
              <th style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>서류</th>
              {EVAL_REVIEWERS.map((r) => (
                <th key={r.id} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center", minWidth: 80 }}>{r.name}({r.role === "LEAD" ? "주" : "위"})</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EVAL_PARTICIPANTS_STATUS.map((p, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{p.vendorName}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                  <span style={{ color: p.docStatus === "완료" ? "#065F46" : "#DC2626", fontSize: 15 }}>
                    {p.docStatus === "완료" ? "✅ 완료" : "⚠ 미완료"}
                  </span>
                </td>
                {[p.r001, p.r002, p.r003].map((status, si) => (
                  <td key={si} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center", fontSize: 15 }}>
                    {statusIcon[status] ?? "⬜"} {status}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 16 }}>
          <span>전체 진행률: {pct}% ({done}/{total}건 완료)</span>
        </div>
        <div style={{ height: 10, background: "#e0e0e0", borderRadius: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#654024", borderRadius: 5, transition: "width 0.3s" }} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 15, color: "#555" }}>
          <span>✅ 제출완료</span>
          <span>🟡 진행중</span>
          <span>⬜ 미시작</span>
        </div>
      </div>
    </div>
  );
}

// ── Drawer 탭: 집계결과 ────────────────────────────────────────
function ResultTab() {
  const toast = useToast();
  const [aggregated, setAggregated] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);

  const handleAggregate = () => {
    setAggregated(true);
    toast.show("심사 집계가 완료되었습니다.", "success");
  };

  const handleNotify = () => {
    setNotifyModalOpen(false);
    // 설계서 FN-P-14 §6: srm-bid-proposals Webhook 시뮬레이션 (기술평가 완료 후 업체별 제안 데이터 전송)
    setTimeout(() => toast.show(
      "심사 결과 발송 완료 — srm-bid-proposals 이벤트가 PMS로 전송되었습니다. " +
      "PMS Pipeline PL-003(대전공장 HVAC)의 제안비교(c) 탭에 업체별 신용·부채·납기 데이터가 반영됩니다.",
      "success"
    ), 500);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 16, color: "#555" }}>집계 상태: <strong>{aggregated ? "완료" : "미실행"}</strong></span>
        <button style={{ ...btn("primary"), opacity: aggregated ? 0.5 : 1, fontSize: 12 }} onClick={handleAggregate} disabled={aggregated}>
          집계 실행
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16, marginBottom: 16 }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            {["업체명", "총점", "합격여부", "이계약", "김사업", "박담당"].map((h) => (
              <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EVAL_PARTICIPANTS_STATUS.map((p, i) => (
            <tr key={i} style={{ background: !aggregated ? "#f9f9f9" : "white" }}>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{p.vendorName}</td>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center", fontWeight: 700 }}>
                {aggregated ? `${p.score}점` : "—"}
              </td>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                {aggregated ? (
                  p.pass
                    ? <span style={{ color: "#065F46", fontWeight: 700 }}>합격 ✅</span>
                    : <span style={{ color: "#DC2626", fontWeight: 700 }}>탈락 ❌</span>
                ) : "—"}
              </td>
              {["91.0", "87.5", "87.0"].map((s, si) => (
                <td key={si} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center", color: "#888" }}>
                  {aggregated ? s : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {aggregated && (
        <div style={{ background: "#F0F9FF", borderRadius: 6, padding: "10px 16px", fontSize: 16, marginBottom: 12 }}>
          합격기준: 60점 &nbsp;|&nbsp; 합격: {EVAL_PARTICIPANTS_STATUS.filter((p) => p.pass).length}개사 &nbsp;|&nbsp; 탈락: {EVAL_PARTICIPANTS_STATUS.filter((p) => !p.pass).length}개사
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          style={{ ...btn("primary"), opacity: !aggregated ? 0.5 : 1 }}
          disabled={!aggregated}
          onClick={() => setNotifyModalOpen(true)}
        >
          결과 통보 발송
        </button>
      </div>

      <Modal
        open={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        title="심사 결과 통보"
        footer={
          <>
            <button style={btn("secondary")} onClick={() => setNotifyModalOpen(false)}>취소</button>
            <button style={btn("primary")} onClick={handleNotify}>메일 발송</button>
          </>
        }
      >
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>통보 대상</div>
            {["전체참여업체", "합격업체만", "탈락업체만"].map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 16, cursor: "pointer" }}>
                <input type="radio" name="notifyTarget" defaultChecked={opt === "전체참여업체"} />
                {opt}
              </label>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>메일 제목</div>
            <input style={{ width: "100%", padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit", boxSizing: "border-box" }} defaultValue="입찰심사 결과 안내 — BID-2026-005" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>메일 본문</div>
            <textarea style={{ width: "100%", minHeight: 100, padding: "8px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} defaultValue="안녕하세요. 입찰 심사 결과를 안내드립니다." />
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────────
export default function CEvaluationsPage() {
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedBid = EVAL_BID_LIST.find((b) => b.id === selectedBidId);

  const columns: Column[] = [
    { key: "id", label: "공고ID", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    { key: "method", label: "선정방법", width: "110px", align: "center", render: (val) => METHOD_LABELS[String(val)] ?? String(val) },
    { key: "participantCount", label: "참여업체 수", width: "100px", align: "center", render: (val) => `${val}개사` },
    {
      key: "evalStatus",
      label: "심사 상태",
      width: "130px",
      align: "center",
      render: (val) => {
        const v = String(val);
        const style = v === "심사진행중" ? { bg: "#DBEAFE", color: "#1E40AF" } : v === "위원배정완료" ? { bg: "#FEF3C7", color: "#92400E" } : { bg: "#E5E7EB", color: "#374151" };
        return (
          <span style={{ display: "inline-block", background: style.bg, color: style.color, borderRadius: "999px", padding: "2px 10px", fontSize: 15, fontWeight: 600 }}>
            {v}
          </span>
        );
      },
    },
  ];

  const handleRowClick = (row: Record<string, unknown>) => {
    setSelectedBidId(String(row.id));
    setDrawerOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader title="참여업체 평가·심사 관리" />

      <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 6, padding: "8px 14px", fontSize: 15, color: "#92400E" }}>
        ※ 최저가·제한적최저가·수의계약은 자동 선정 처리됩니다.
      </div>

      <SearchForm
        fields={[
          { label: "공고 상태", name: "bidStatus", type: "select", options: [{ label: "진행중", value: "IN_PROGRESS" }, { label: "완료", value: "CLOSED" }] },
          { label: "선정방법", name: "method", type: "select", options: [{ label: "적격심사", value: "QUALIFIED" }, { label: "2단계경쟁", value: "TWO_STAGE" }] },
          { label: "심사상태", name: "evalStatus", type: "select", options: [{ label: "위원배정완료", value: "ASSIGNED" }, { label: "심사진행중", value: "IN_PROGRESS" }, { label: "자동선정", value: "AUTO" }] },
        ]}
      />

      <DataTable
        columns={columns}
        data={EVAL_BID_LIST as unknown as Record<string, unknown>[]}
        sectionLabel="심사 관리 목록"
        onRowClick={handleRowClick}
      />

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={`심사관리 — ${selectedBid?.id ?? ""} (${selectedBid?.title ?? ""})`} width={680}>
        {selectedBid && (
          <Tabs
            tabs={[
              { id: "criteria", label: "기준설정" },
              { id: "reviewers", label: "위원배정" },
              { id: "progress", label: "진행현황" },
              { id: "result", label: "집계결과" },
            ]}
          >
            {(tab) => (
              <>
                {tab === "criteria" && <CriteriaTab />}
                {tab === "reviewers" && <ReviewersTab />}
                {tab === "progress" && <ProgressTab />}
                {tab === "result" && <ResultTab />}
              </>
            )}
          </Tabs>
        )}
      </Drawer>
    </div>
  );
}
