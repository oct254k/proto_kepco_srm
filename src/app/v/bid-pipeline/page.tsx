"use client";

import React, { useState } from "react";
import Stepper from "@/components/Stepper";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import Drawer from "@/components/Drawer";
import { useToast } from "@/components/Toast";
import { V_MY_BIDS, MOCK_BIDS, METHOD_LABELS } from "@/lib/mock/bids";

const btn = (variant: "primary" | "secondary" | "danger" | "ghost" = "primary"): React.CSSProperties => ({
  padding: "8px 20px",
  borderRadius: 4,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  border: variant === "primary" ? "none" : variant === "danger" ? "none" : variant === "ghost" ? "1px solid #e0e0e0" : "1px solid #01ACC8",
  background: variant === "primary" ? "#01ACC8" : variant === "danger" ? "#DC2626" : "#fff",
  color: variant === "primary" ? "#fff" : variant === "danger" ? "#fff" : variant === "ghost" ? "#555" : "#01ACC8",
});

const PIPELINE_STEPS = [
  { label: "공고목록" },
  { label: "참여신청" },
  { label: "자가심사" },
  { label: "투찰" },
  { label: "결과조회" },
];

// ── Step 0: 공고확인 ──────────────────────────────────────────
function Step0Panel({ bidId, onApply }: { bidId: string; onApply: () => void }) {
  const bid = MOCK_BIDS.find((b) => b.id === bidId);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!bid) return null;

  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 24, marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
          {[
            { label: "공고번호", value: bid.id },
            { label: "상태", value: <StatusBadge status={bid.status} /> },
            { label: "공고명", value: bid.title },
            { label: "선정방법", value: METHOD_LABELS[bid.method] ?? bid.method },
            { label: "예정금액", value: `${bid.estAmount.toLocaleString()}원` },
            { label: "공고일", value: bid.publishedAt },
            { label: "마감일", value: bid.deadline },
            { label: "참여조건", value: "제한 없음 (공개입찰)" },
          ].map((item) => (
            <div key={item.label} style={{ paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: 15, color: "#888", marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 17, fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
          <button style={btn("ghost")} onClick={() => setDrawerOpen(true)}>공고 상세 보기</button>
          <button style={btn("primary")} onClick={onApply}>참여 신청 →</button>
        </div>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="공고 상세" width={560}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>공고번호</div>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{bid.id}</div>
          </div>
          <div>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>공고명</div>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{bid.title}</div>
          </div>
          <div>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>입찰방법</div>
            <div>{METHOD_LABELS[bid.method] ?? bid.method}</div>
          </div>
          <div>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>마감일시</div>
            <div>{bid.deadline}</div>
          </div>
          <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>품목 목록</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  {["품목명", "수량", "단위"].map((h) => (
                    <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[{ name: "태양광 인버터 5kW", qty: 5, unit: "EA" }, { name: "태양광 인버터 10kW", qty: 3, unit: "EA" }].map((item, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{item.name}</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{item.qty}</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>첨부파일</div>
            {[{ name: "입찰공고문.pdf", size: "2.1 MB" }, { name: "공사내역서.xlsx", size: "1.5 MB" }].map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f5f5f5", fontSize: 16 }}>
                <span>📎 {f.name} ({f.size})</span>
                <button style={{ ...btn("secondary"), padding: "2px 8px", fontSize: 15 }}>다운로드</button>
              </div>
            ))}
          </div>
          <button style={{ ...btn("primary"), marginTop: 8 }} onClick={() => { setDrawerOpen(false); onApply(); }}>
            참여신청 하기 →
          </button>
        </div>
      </Drawer>
    </div>
  );
}

// ── Step 1: 참여신청 ──────────────────────────────────────────
function Step1Panel({ onSubmit, onPrev }: { onSubmit: () => void; onPrev: () => void }) {
  const toast = useToast();
  const [docs, setDocs] = useState([
    { name: "사업자등록증 사본", required: true, uploaded: false },
    { name: "법인인감증명서", required: true, uploaded: false },
    { name: "입찰참가자격등록증", required: true, uploaded: false },
  ]);

  const handleSubmit = () => {
    const allUploaded = docs.every((d) => !d.required || d.uploaded);
    if (!allUploaded) {
      toast.show("필수 서류를 모두 첨부해 주세요.", "error");
      return;
    }
    onSubmit();
    setTimeout(() => toast.show("참여신청이 완료되었습니다.", "success"), 4000);
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#222" }}>참여자격 확인 (필수 서류 첨부)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {docs.map((doc, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: doc.uploaded ? "#F0FDF4" : "#F9FAFB", border: `1px solid ${doc.uploaded ? "#BBF7D0" : "#e0e0e0"}`, borderRadius: 6 }}>
            <input
              type="checkbox"
              checked={doc.uploaded}
              onChange={(e) => setDocs(docs.map((d, di) => di === i ? { ...d, uploaded: e.target.checked } : d))}
            />
            <span style={{ flex: 1, fontSize: 16 }}>
              {doc.name} {doc.required && <span style={{ color: "#DC2626", fontSize: 14 }}>(필수)</span>}
            </span>
            {doc.uploaded ? (
              <span style={{ fontSize: 15, color: "#065F46", fontWeight: 600 }}>✓ 업로드완료</span>
            ) : (
              <button
                style={{ ...btn("secondary"), fontSize: 15, padding: "4px 10px" }}
                onClick={() => setDocs(docs.map((d, di) => di === i ? { ...d, uploaded: true } : d))}
              >
                파일첨부
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={btn("ghost")} onClick={onPrev}>← 이전: 공고확인</button>
        <button style={btn("primary")} onClick={handleSubmit}>참여신청 제출</button>
      </div>
    </div>
  );
}

// ── Step 2: 심사 ──────────────────────────────────────────────
function Step2Panel({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 24 }}>
      <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 8, padding: 20, marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 27, marginBottom: 8 }}>⏳</div>
        <div style={{ fontSize: 19, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>심사 진행 중</div>
        <div style={{ fontSize: 16, color: "#78350F" }}>
          계약담당자가 배정한 심사위원들이 귀사의 서류를 검토하고 있습니다.
        </div>
      </div>
      <div style={{ background: "#F9FAFB", borderRadius: 8, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>심사위원 현황</div>
        {[
          { name: "이계약", dept: "계약팀", role: "주심사", status: "제출완료" },
          { name: "김사업", dept: "전력사업팀", role: "심사위원", status: "진행중" },
          { name: "박담당", dept: "구매팀", role: "심사위원", status: "미시작" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>
              {r.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{r.name} ({r.dept})</div>
              <div style={{ fontSize: 15, color: "#888" }}>{r.role}</div>
            </div>
            <span style={{ fontSize: 15, color: r.status === "제출완료" ? "#065F46" : r.status === "진행중" ? "#92400E" : "#888" }}>
              {r.status === "제출완료" ? "✅ " : r.status === "진행중" ? "🟡 " : "⬜ "}{r.status}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={btn("ghost")} onClick={onPrev}>← 이전: 참여신청</button>
        <button style={{ ...btn("primary") }} onClick={onNext}>투찰 단계로 →</button>
      </div>
    </div>
  );
}

// ── Step 3: 투찰 ──────────────────────────────────────────────
function Step3Panel({ onSubmit, onPrev }: { onSubmit: () => void; onPrev: () => void }) {
  const toast = useToast();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [items, setItems] = useState([
    { name: "태양광 인버터 5kW", qty: 5, unit: "EA", unitPrice: 0 },
    { name: "태양광 인버터 10kW", qty: 3, unit: "EA", unitPrice: 0 },
  ]);

  const total = items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const vat = Math.floor(total * 0.1);
  const grandTotal = total + vat;

  const handleConfirm = () => {
    setConfirmModalOpen(false);
    onSubmit();
    setTimeout(() => toast.show("투찰이 정상적으로 제출되었습니다.", "info"), 4000);
  };

  return (
    <div>
      {/* 카운트다운 배너 */}
      <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 23 }}>⏱</span>
        <span style={{ fontSize: 16, color: "#DC2626", fontWeight: 600 }}>
          투찰 마감까지: <span style={{ fontSize: 21, fontFamily: "monospace" }}>07 일 22 시간 15 분</span>
        </span>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#222" }}>투찰금액 입력</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16, marginBottom: 16 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              {["품목명", "수량", "단위", "투찰단가(원)", "합계(원)"].map((h) => (
                <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{item.name}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{item.qty}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{item.unit}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>
                  <input
                    type="number"
                    min="0"
                    style={{ width: "100%", padding: "4px 6px", border: "1px solid #ccc", borderRadius: 3, fontSize: 16, fontFamily: "inherit", textAlign: "right" }}
                    value={item.unitPrice || ""}
                    onChange={(e) => setItems(items.map((it, idx) => idx === i ? { ...it, unitPrice: Number(e.target.value) } : it))}
                    placeholder="0"
                  />
                </td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "right" }}>
                  {(item.qty * item.unitPrice).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ background: "#F9FAFB", borderRadius: 6, padding: 16, marginBottom: 20 }}>
          {[
            { label: "공급가액 합계", value: total },
            { label: "VAT (10%)", value: vat },
            { label: "총 투찰금액 (VAT 포함)", value: grandTotal },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontWeight: i === 2 ? 700 : 400, fontSize: i === 2 ? 15 : 13, borderTop: i === 2 ? "1px solid #e0e0e0" : "none", color: i === 2 ? "#01ACC8" : "#333" }}>
              <span>{row.label}</span>
              <span>{row.value.toLocaleString()}원</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button style={btn("ghost")} onClick={onPrev}>← 이전: 심사</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={btn("secondary")}>투찰 포기</button>
            <button
              style={{ ...btn("primary"), opacity: grandTotal === 0 ? 0.5 : 1 }}
              disabled={grandTotal === 0}
              onClick={() => setConfirmModalOpen(true)}
            >
              투찰 제출
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="투찰 제출 확인"
        footer={
          <>
            <button style={btn("secondary")} onClick={() => setConfirmModalOpen(false)}>취소</button>
            <button style={btn("primary")} onClick={handleConfirm}>확인 — 투찰 제출</button>
          </>
        }
      >
        <div>
          <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 6, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 16, marginBottom: 8 }}>총 투찰금액 (VAT 포함)</div>
            <div style={{ fontSize: 25, fontWeight: 700, color: "#01ACC8" }}>{grandTotal.toLocaleString()}원</div>
          </div>
          <div style={{ fontSize: 16, color: "#DC2626", marginBottom: 8 }}>⚠ 제출 후 마감일 이전에만 수정이 가능합니다.</div>
          <div style={{ fontSize: 16, color: "#555" }}>투찰을 제출하시겠습니까?</div>
        </div>
      </Modal>
    </div>
  );
}

// ── Step 4: 결과확인 ──────────────────────────────────────────
function Step4Panel() {
  return (
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 24 }}>
      <div style={{ background: "#EDE9FE", border: "1px solid #DDD6FE", borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 35, marginBottom: 8 }}>🏆</div>
        <div style={{ fontSize: 25, fontWeight: 800, color: "#5B21B6", marginBottom: 6 }}>낙찰</div>
        <div style={{ fontSize: 17, color: "#6D28D9" }}>(주)한국전기솔루션 귀중</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", marginBottom: 24 }}>
        {[
          { label: "본인 투찰금액", value: "21,835,000원" },
          { label: "예정가 (공개)", value: "22,100,000원" },
          { label: "낙찰하한금액", value: "20,890,000원" },
          { label: "참여업체 수", value: "5개사" },
          { label: "개찰일시", value: "2026-05-02 10:00" },
          { label: "낙찰순위", value: "1위" },
        ].map((item) => (
          <div key={item.label} style={{ paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{item.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#F0FDF4", borderRadius: 6, padding: 14, fontSize: 16, color: "#065F46", marginBottom: 16 }}>
        낙찰 후 계약 진행을 위해 계약담당자에게 연락하세요.
      </div>
      <div style={{ textAlign: "right" }}>
        <button style={btn("primary")}>계약·보증 안내 →</button>
      </div>
    </div>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────────
export default function VBidPipelinePage() {
  const [selectedBidId, setSelectedBidId] = useState(V_MY_BIDS[0].bidId);
  const [currentStep, setCurrentStep] = useState(V_MY_BIDS[0].step);

  const selectedMyBid = V_MY_BIDS.find((b) => b.bidId === selectedBidId);

  const handleSelectBid = (bidId: string) => {
    setSelectedBidId(bidId);
    const found = V_MY_BIDS.find((b) => b.bidId === bidId);
    setCurrentStep(found ? found.step : 0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader title="입찰 파이프라인" />

      {/* 공고 선택 드롭다운 */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>참여 중인 입찰</span>
        <select
          style={{ flex: 1, padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit", background: "#fff" }}
          value={selectedBidId}
          onChange={(e) => handleSelectBid(e.target.value)}
        >
          {V_MY_BIDS.map((b) => (
            <option key={b.bidId} value={b.bidId}>
              {b.bidId} — {b.title} ({b.stepLabel})
            </option>
          ))}
        </select>
        {selectedMyBid && <StatusBadge status={selectedMyBid.status} />}
      </div>

      {/* 스텝바 */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "20px 24px" }}>
        <Stepper steps={PIPELINE_STEPS} current={currentStep} />

        {/* 단계별 클릭 버튼 (완료 단계 복귀) */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {PIPELINE_STEPS.map((step, i) => (
            <button
              key={i}
              onClick={() => i <= currentStep && setCurrentStep(i)}
              style={{
                padding: "4px 12px", fontSize: 15, borderRadius: 4, cursor: i <= currentStep ? "pointer" : "not-allowed",
                border: "1px solid #e0e0e0", background: i === currentStep ? "#01ACC8" : "#fff",
                color: i === currentStep ? "#fff" : i < currentStep ? "#01ACC8" : "#bbb",
                fontFamily: "inherit",
              }}
            >
              {i < currentStep ? `✓ ${step.label}` : step.label}
            </button>
          ))}
        </div>
      </div>

      {/* 단계별 콘텐츠 패널 */}
      {currentStep === 0 && (
        <Step0Panel bidId={selectedBidId} onApply={() => setCurrentStep(1)} />
      )}
      {currentStep === 1 && (
        <Step1Panel
          onSubmit={() => setCurrentStep(2)}
          onPrev={() => setCurrentStep(0)}
        />
      )}
      {currentStep === 2 && (
        <Step2Panel
          onNext={() => setCurrentStep(3)}
          onPrev={() => setCurrentStep(1)}
        />
      )}
      {currentStep === 3 && (
        <Step3Panel
          onSubmit={() => setCurrentStep(4)}
          onPrev={() => setCurrentStep(2)}
        />
      )}
      {currentStep === 4 && <Step4Panel />}
    </div>
  );
}
