"use client";

import React, { useState } from "react";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import Stepper from "@/components/Stepper";
import { useToast } from "@/components/Toast";
import { B_ASSIGNED_REVIEWS, B_REVIEW_VENDORS, EVAL_CRITERIA } from "@/lib/mock/bids";

const btn = (variant: "primary" | "secondary" | "danger" | "ghost" = "primary"): React.CSSProperties => ({
  padding: "6px 16px", borderRadius: 4, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  border: variant === "primary" ? "none" : variant === "danger" ? "none" : variant === "ghost" ? "1px solid #e0e0e0" : "1px solid #01ACC8",
  background: variant === "primary" ? "#01ACC8" : variant === "danger" ? "#DC2626" : "#fff",
  color: variant === "primary" ? "#fff" : variant === "danger" ? "#fff" : variant === "ghost" ? "#555" : "#01ACC8",
});

const REVIEW_STEPS = [
  { label: "공고" },
  { label: "신청" },
  { label: "자가심사" },
  { label: "투찰" },
  { label: "개찰" },
  { label: "낙찰" },
];

// ── 점수 입력 Modal ────────────────────────────────────────────
function ScoreInputModal({ open, onClose, vendorName }: { open: boolean; onClose: () => void; vendorName: string }) {
  const toast = useToast();
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(EVAL_CRITERIA.map((c) => [c.id, 0]))
  );

  const total = EVAL_CRITERIA.reduce((s, c) => s + (scores[c.id] ?? 0), 0);

  const handleSave = () => {
    toast.show("심사 점수가 저장되었습니다.", "success");
    onClose();
  };

  const handleSubmit = () => {
    toast.show("심사 점수가 저장되었습니다.", "success");
    setTimeout(() => toast.show("이 업체 평가가 완료되었습니다.", "info"), 4000);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`심사 점수 입력 — ${vendorName}`}
      width={580}
      footer={
        <>
          <button style={btn("secondary")} onClick={handleSave}>임시저장</button>
          <button style={btn("primary")} onClick={handleSubmit}>이 업체 평가 완료</button>
        </>
      }
    >
      <div>
        <div style={{ background: "#F0F9FF", borderRadius: 6, padding: "8px 14px", marginBottom: 16, fontSize: 16, color: "#1E40AF" }}>
          평가 대상: {vendorName} | 심사위원: 김사업 (심사위원) | 상태: DRAFT
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16, marginBottom: 12 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              {["항목명", "최대배점", "입력점수", "환산점수"].map((h) => (
                <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EVAL_CRITERIA.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{c.name}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{c.maxScore}</td>
                <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                  <input
                    type="number"
                    min={0}
                    max={c.maxScore}
                    step={0.5}
                    aria-label={`${c.name} 점수 입력, 최대 ${c.maxScore}점`}
                    style={{
                      width: 70, padding: "4px 6px", border: `1px solid ${(scores[c.id] ?? 0) > c.maxScore ? "#DC2626" : "#ccc"}`,
                      borderRadius: 3, fontSize: 16, fontFamily: "inherit", textAlign: "right",
                    }}
                    value={scores[c.id] ?? 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setScores({ ...scores, [c.id]: val });
                    }}
                  />
                </td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center", color: "#01ACC8" }}>
                  {scores[c.id] ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #e0e0e0", fontSize: 16 }}>
          <span>현재 합산: <strong style={{ color: "#01ACC8", fontSize: 18 }}>{total.toFixed(1)}점</strong></span>
          <span style={{ color: "#888" }}>/ 100점</span>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>비고</div>
          <input style={{ width: "100%", padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit", boxSizing: "border-box" }} placeholder="평가 의견 입력 (선택)" />
        </div>

        <div style={{ background: "#FEF2F2", borderRadius: 6, padding: "8px 12px", marginTop: 12, fontSize: 15, color: "#DC2626" }}>
          ⚠ 업체 평가 완료 후 수정이 불가합니다.
        </div>
      </div>
    </Modal>
  );
}

// ── 심사현황 Modal ─────────────────────────────────────────────
function ReviewStatusModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="심사현황 — BID-2026-005" width={480} footer={<button style={btn("secondary")} onClick={onClose}>닫기</button>}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16, marginBottom: 12 }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            {["심사위원", "역할", "제출여부", "제출일시"].map((h) => (
              <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { name: "이계약", role: "주심사", status: "제출완료", date: "04-28 14:30" },
            { name: "김사업", role: "심사위원", status: "진행중", date: "—" },
            { name: "박담당", role: "심사위원", status: "제출완료", date: "04-28 16:00" },
          ].map((r, i) => (
            <tr key={i}>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{r.name}</td>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{r.role}</td>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                <span style={{ color: r.status === "제출완료" ? "#065F46" : "#92400E", fontSize: 15 }}>
                  {r.status === "제출완료" ? "✅ 제출완료" : "🟡 진행중"}
                </span>
              </td>
              <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center", color: "#888", fontSize: 15 }}>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 15, color: "#888" }}>※ 타 심사위원의 점수는 집계 전까지 비공개입니다.</div>
    </Modal>
  );
}

// ── 최종 제출 확인 Modal ───────────────────────────────────────
function FinalSubmitModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="심사결과 최종 제출 확인"
      footer={
        <>
          <button style={btn("secondary")} onClick={onClose}>취소</button>
          <button style={btn("primary")} onClick={onConfirm}>최종 제출</button>
        </>
      }
    >
      <div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 16, color: "#555", marginBottom: 4 }}>공고명: 태양광 인버터 구매 입찰</div>
          <div style={{ fontSize: 16, color: "#555" }}>평가 업체: 5개사 (전체 입력 완료)</div>
        </div>
        <div style={{ background: "#F9FAFB", borderRadius: 6, padding: 14, marginBottom: 12 }}>
          {[
            { vendor: "(주)한국전기솔루션", score: 88.0 },
            { vendor: "(주)태양전력", score: 75.5 },
            { vendor: "(주)그린솔루션", score: 62.0 },
            { vendor: "(주)에너지텍", score: 58.5 },
            { vendor: "(주)스마트파워", score: 55.0 },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f0f0f0", fontSize: 16 }}>
              <span>{item.vendor}</span>
              <span style={{ fontWeight: 600, color: item.score >= 60 ? "#065F46" : "#DC2626" }}>{item.score}점</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#FEF2F2", borderRadius: 6, padding: "8px 12px", fontSize: 15, color: "#DC2626" }}>
          ⚠ 제출 후 점수 수정이 불가합니다. 계약담당자에게 결과가 전달됩니다.
        </div>
      </div>
    </Modal>
  );
}

// ── 심사 Drawer ────────────────────────────────────────────────
function ReviewDrawer({ bidId, open, onClose }: { bidId: string | null; open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [finalSubmitOpen, setFinalSubmitOpen] = useState(false);

  const review = B_ASSIGNED_REVIEWS.find((r) => r.bidId === bidId);
  const selectedVendor = B_REVIEW_VENDORS.find((v) => v.id === selectedVendorId);

  const doneCount = B_REVIEW_VENDORS.filter((v) => v.myStatus === "DONE").length;
  const allDone = doneCount === B_REVIEW_VENDORS.length;

  const handleFinalSubmit = () => {
    setFinalSubmitOpen(false);
    setTimeout(() => toast.show("심사 점수가 저장되었습니다.", "success"), 4000);
    onClose();
  };

  const statusStyle: Record<string, { bg: string; color: string }> = {
    DONE: { bg: "#D1FAE5", color: "#065F46" },
    DRAFT: { bg: "#FEF3C7", color: "#92400E" },
    NONE: { bg: "#F3F4F6", color: "#374151" },
  };

  return (
    <>
      <Drawer open={open} onClose={onClose} title={`입찰심사 — ${bidId ?? ""} ${review?.title ?? ""}`} width={660}>
        {review && (
          <div>
            <div style={{ display: "flex", gap: 20, marginBottom: 16, fontSize: 16, color: "#555" }}>
              <span>심사 마감: <strong>{review.deadline}</strong></span>
              <span>내 역할: <strong>심사위원</strong></span>
            </div>

            {/* 탭 영역 */}
            {!selectedVendorId ? (
              <>
                {/* 업체 목록 */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <button style={{ ...btn("primary"), fontSize: 15 }} onClick={() => setStatusModalOpen(true)}>심사현황</button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16, marginBottom: 12 }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                      {["업체명", "자가심사", "투찰", "내 심사상태", ""].map((h) => (
                        <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {B_REVIEW_VENDORS.map((v) => (
                      <tr key={v.id}>
                        <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{v.vendorName}</td>
                        <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center", fontSize: 15 }}>
                          {v.selfAssess === "완료" ? "✅ 완료" : "✗ 미제출"}
                        </td>
                        <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center", fontSize: 15 }}>
                          {v.tender === "완료" ? "✅ 완료" : "—"}
                        </td>
                        <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          <span style={{
                            display: "inline-block",
                            background: statusStyle[v.myStatus]?.bg ?? "#f0f0f0",
                            color: statusStyle[v.myStatus]?.color ?? "#666",
                            borderRadius: "999px", padding: "2px 10px", fontSize: 14, fontWeight: 600,
                          }}>
                            {v.myStatusLabel}
                          </span>
                        </td>
                        <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          <button
                            style={{ ...btn("primary"), padding: "3px 10px", fontSize: 15 }}
                            onClick={() => {
                              setSelectedVendorId(v.id);
                              setScoreModalOpen(true);
                            }}
                          >
                            {v.myStatus === "DONE" ? "수정" : v.myStatus === "DRAFT" ? "이어서 작성" : "작성 시작"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ fontSize: 16, color: "#555", marginBottom: 10 }}>
                  완료: {doneCount}건 &nbsp;|&nbsp; 진행중: {B_REVIEW_VENDORS.filter((v) => v.myStatus === "DRAFT").length}건 &nbsp;|&nbsp; 미작성: {B_REVIEW_VENDORS.filter((v) => v.myStatus === "NONE").length}건
                </div>
                <div style={{ fontSize: 15, color: "#888", marginBottom: 16 }}>※ 모든 업체 심사 완료 후 [심사결과 제출] 가능합니다.</div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    style={{ ...btn("primary"), opacity: allDone ? 1 : 0.5, cursor: allDone ? "pointer" : "not-allowed" }}
                    onClick={() => allDone && setFinalSubmitOpen(true)}
                  >
                    심사결과 제출 {!allDone && `(미완료 ${B_REVIEW_VENDORS.length - doneCount}건)`}
                  </button>
                </div>
              </>
            ) : (
              <div>
                <button style={{ ...btn("ghost"), marginBottom: 16 }} onClick={() => setSelectedVendorId(null)}>
                  ← 업체 목록으로
                </button>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>
                  평가 대상: {selectedVendor?.vendorName}
                </div>
                <div style={{ background: "#F9FAFB", borderRadius: 6, padding: 14, marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>업체 제출 자료 (참고용)</div>
                  <div style={{ fontSize: 16, color: "#555", marginBottom: 6 }}>자가심사 결과: 품질관리B / 납기이행A / 재정건전성B</div>
                  <div style={{ fontSize: 16, color: "#555" }}>
                    첨부서류: <button style={{ ...btn("secondary"), padding: "2px 8px", fontSize: 14, marginLeft: 6 }}>자가심사_증빙.pdf</button>
                  </div>
                </div>
                <button style={btn("primary")} onClick={() => setScoreModalOpen(true)}>점수 입력</button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <ScoreInputModal
        open={scoreModalOpen}
        onClose={() => { setScoreModalOpen(false); setSelectedVendorId(null); }}
        vendorName={selectedVendor?.vendorName ?? ""}
      />
      <ReviewStatusModal open={statusModalOpen} onClose={() => setStatusModalOpen(false)} />
      <FinalSubmitModal open={finalSubmitOpen} onClose={() => setFinalSubmitOpen(false)} onConfirm={handleFinalSubmit} />
    </>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────────
export default function BBidReviewPage() {
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns: Column[] = [
    { key: "bidId", label: "공고ID", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    { key: "deadline", label: "심사마감", width: "100px", align: "center" },
    {
      key: "myStatusLabel",
      label: "내 제출상태",
      width: "110px",
      align: "center",
      render: (val, row) => <StatusBadge status={String(row.myStatus)} />,
    },
    {
      key: "totalDone",
      label: "전체현황",
      width: "100px",
      align: "center",
      render: (val, row) => `${row.totalDone}/${row.totalReviewers}완료`,
    },
  ];

  const handleRowClick = (row: Record<string, unknown>) => {
    setSelectedBidId(String(row.bidId));
    setDrawerOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader title="나의 배정 심사 (입찰심사)" />

      <SearchForm
        fields={[
          { label: "기간", name: "period", type: "daterange" },
          { label: "상태", name: "status", type: "select", options: [{ label: "진행중", value: "IN_PROGRESS" }, { label: "제출완료", value: "SUBMITTED" }, { label: "미시작", value: "WAITING" }] },
        ]}
      />

      <DataTable
        columns={columns}
        data={B_ASSIGNED_REVIEWS as unknown as Record<string, unknown>[]}
        sectionLabel="배정된 심사 목록"
        onRowClick={handleRowClick}
        showCheckbox={false}
        actionButton={undefined}
      />

      {/* 목록 행 아래 스텝 진행 상태 표시 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {B_ASSIGNED_REVIEWS.map((r) => (
          <div key={r.bidId} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 6, padding: "12px 20px" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#333", marginBottom: 10 }}>{r.bidId} — {r.title}</div>
            <Stepper steps={REVIEW_STEPS} current={r.step} />
          </div>
        ))}
      </div>

      <ReviewDrawer bidId={selectedBidId} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
