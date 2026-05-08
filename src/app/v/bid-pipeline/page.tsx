"use client";

import React, { useMemo, useState } from "react";
import Stepper from "@/components/Stepper";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import Drawer from "@/components/Drawer";
import StatusGuide, { type StatusGuideSection } from "@/components/StatusGuide";
import { useToast } from "@/components/Toast";
import { METHOD_LABELS, MOCK_BIDS, V_MY_BIDS } from "@/lib/mock/bids";

const PIPELINE_STEPS = [
  { label: "공고확인" },
  { label: "참여신청" },
  { label: "자가심사" },
  { label: "투찰" },
  { label: "결과조회" },
];

const BID_PIPELINE_GUIDE: StatusGuideSection[] = [
  {
    title: "입찰 파이프라인 상태",
    description: "협력업체는 자기 업체 기준 단계만 볼 수 있고, 타 업체 금액과 순위는 개찰 전 공개하지 않습니다.",
    items: [
      {
        code: "OPEN_NOTICE",
        label: "공고확인",
        meaning: "공고문과 첨부문서를 검토하는 단계입니다.",
        owner: "협력업체",
        actions: "공고 열람, 참여신청 이동",
        next: "참여신청",
        limit: "타 업체 참여 현황 비노출",
      },
      {
        code: "SELF_REVIEW",
        label: "자가심사중",
        meaning: "필수 서류 제출 후 자가심사 결과를 입력하는 단계입니다.",
        owner: "협력업체",
        actions: "응답 입력, 제출",
        next: "투찰 또는 심사탈락",
        limit: "탈락 시 투찰 화면 진입 차단",
      },
      {
        code: "DISQUALIFIED",
        label: "심사탈락",
        meaning: "자가심사 또는 심사 결과 기준 미달로 투찰이 제한된 상태입니다.",
        owner: "계약담당자, 협력업체",
        actions: "반려 사유 확인",
        next: "없음",
        limit: "투찰 작성/제출 불가",
      },
      {
        code: "SUBMITTED",
        label: "투찰제출완료",
        meaning: "투찰 금액을 최종 제출한 상태입니다.",
        owner: "협력업체",
        actions: "마감 전까지 수정",
        next: "개찰결과",
        limit: "타 업체 금액·순위 비노출",
      },
      {
        code: "AWARDED",
        label: "낙찰",
        meaning: "개찰과 평가를 거쳐 낙찰이 확정된 상태입니다.",
        owner: "계약담당자",
        actions: "계약·보증 화면으로 이동",
        next: "계약 진행",
        limit: "개찰 전에는 이 결과를 노출하지 않음",
      },
    ],
  },
];

const btn = (variant: "primary" | "secondary" | "danger" | "ghost" = "primary"): React.CSSProperties => ({
  padding: "8px 18px",
  borderRadius: 6,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  border: variant === "primary" ? "1px solid #DFE8F0" : variant === "danger" ? "1px solid #FCA5A5" : "1px solid #CBD5E1",
  background: variant === "primary" ? "#654024" : variant === "danger" ? "#FEF2F2" : "#fff",
  color: variant === "primary" ? "#fff" : variant === "danger" ? "#B91C1C" : "#334155",
});

type MyBid = typeof V_MY_BIDS[number];

function BidNoticePanel({ bid, onApply }: { bid: MyBid; onApply: () => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const detail = MOCK_BIDS.find((item) => item.id === bid.bidId);

  if (!detail) return null;

  return (
    <>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
          {[
            ["공고번호", detail.id],
            ["공고상태", <StatusBadge key="status" status={detail.status} />],
            ["공고명", detail.title],
            ["선정방법", METHOD_LABELS[detail.method] ?? detail.method],
            ["예정금액", `${detail.estAmount.toLocaleString()}원`],
            ["마감일", detail.deadline],
            ["참여조건", "자가심사 통과 업체만 투찰 가능"],
            ["데이터 공개", "개찰 전까지 타 업체 금액/순위 비공개"],
          ].map(([label, value], index) => (
            <div key={`${String(label)}-${index}`}>
              <div style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#0F172A" }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button style={btn("secondary")} onClick={() => setDrawerOpen(true)}>공고 상세 보기</button>
          <button style={btn("primary")} onClick={onApply}>참여신청</button>
        </div>
      </div>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="공고 상세" width={580}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 16, color: "#334155", lineHeight: 1.6 }}>
            공고문, 내역서, 자가심사 기준은 본인 업체 기준으로만 조회됩니다.
            타 업체 참여 여부와 제출 상태는 보이지 않습니다.
          </div>
          <button style={btn("primary")} onClick={() => { setDrawerOpen(false); onApply(); }}>참여신청으로 이동</button>
        </div>
      </Drawer>
    </>
  );
}

function ApplyPanel({ onPrev, onSubmit }: { onPrev: () => void; onSubmit: () => void }) {
  const toast = useToast();
  const [docs, setDocs] = useState([
    { name: "사업자등록증 사본", uploaded: true },
    { name: "법인인감증명서", uploaded: true },
    { name: "입찰참가자격등록증", uploaded: false },
  ]);

  function handleSubmit() {
    const allUploaded = docs.every((item) => item.uploaded);
    if (!allUploaded) {
      toast.show("필수 서류를 모두 첨부해 주세요.", "error");
      return;
    }
    toast.show("참여신청이 완료되었습니다.", "success");
    onSubmit();
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 16 }}>참여신청</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {docs.map((doc, index) => (
          <label key={doc.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 8 }}>
            <input
              type="checkbox"
              checked={doc.uploaded}
              onChange={(event) => setDocs((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, uploaded: event.target.checked } : item)))}
            />
            <span style={{ fontSize: 16, color: "#0F172A", flex: 1 }}>{doc.name}</span>
            <StatusBadge status={doc.uploaded ? "APPROVED" : "NOT_SUBMITTED"} label={doc.uploaded ? "첨부완료" : "미첨부"} />
          </label>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={btn("secondary")} onClick={onPrev}>이전</button>
        <button style={btn("primary")} onClick={handleSubmit}>참여신청 제출</button>
      </div>
    </div>
  );
}

function SelfReviewPanel({
  qualified,
  disqualified,
  onPrev,
  onPass,
}: {
  qualified: boolean;
  disqualified: boolean;
  onPrev: () => void;
  onPass: () => void;
}) {
  const [answers, setAnswers] = useState([true, true, !disqualified]);

  if (disqualified) {
    return (
      <div style={{ background: "#fff", border: "1px solid #FECACA", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <StatusBadge status="DISQUALIFIED" />
          <strong style={{ fontSize: 20, color: "#991B1B" }}>자가심사 탈락</strong>
        </div>
        <div style={{ fontSize: 16, color: "#7F1D1D", lineHeight: 1.7, marginBottom: 18 }}>
          제출 서류 중 필수 면허 증빙이 부족하여 투찰 단계로 진입할 수 없습니다.
          이 화면에서는 탈락 사유만 확인할 수 있고, 투찰 작성/제출 버튼은 제공하지 않습니다.
        </div>
        <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#9F1239", marginBottom: 18 }}>
          고객사 요구사항 강조포인트: 자가심사 불합격 시 투찰 단계 접근을 차단해 핵심 업무 규칙을 프로토타입에서 명확히 표현합니다.
        </div>
        <button style={btn("secondary")} onClick={onPrev}>이전</button>
      </div>
    );
  }

  if (qualified) {
    return (
      <div style={{ background: "#fff", border: "1px solid #BBF7D0", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <StatusBadge status="QUALIFIED" />
          <strong style={{ fontSize: 20, color: "#166534" }}>자가심사 통과</strong>
        </div>
        <div style={{ fontSize: 16, color: "#166534", lineHeight: 1.7, marginBottom: 18 }}>
          제출 서류와 자가심사 결과가 기준을 충족해 투찰 단계로 진행할 수 있습니다.
          같은 화면에서 탈락 케이스와 비교 검토가 가능하도록 통과 시나리오를 별도로 준비했습니다.
        </div>
        <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#166534", marginBottom: 18 }}>
          고객사 요구사항 강조포인트: 자가심사 합격 업체만 투찰 화면에 접근 가능하다는 규칙을 비교 가능한 데이터로 표현합니다.
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button style={btn("secondary")} onClick={onPrev}>이전</button>
          <button style={btn("primary")} onClick={onPass}>투찰 단계로 이동</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 16 }}>자가심사</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {["해당 면허를 보유하고 있습니다.", "최근 3년 유사 실적이 있습니다.", "재무 건전성 기준을 충족합니다."].map((question, index) => (
          <label key={question} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 8 }}>
            <input
              type="checkbox"
              checked={answers[index]}
              onChange={(event) => setAnswers((prev) => prev.map((value, valueIndex) => (valueIndex === index ? event.target.checked : value)))}
            />
            <span style={{ fontSize: 16, color: "#0F172A" }}>{question}</span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={btn("secondary")} onClick={onPrev}>이전</button>
        <button style={btn("primary")} onClick={onPass}>심사결과 제출</button>
      </div>
    </div>
  );
}

function BidPanel({
  closed,
  onPrev,
  onSubmitted,
}: {
  closed: boolean;
  onPrev: () => void;
  onSubmitted: () => void;
}) {
  const toast = useToast();
  const [items, setItems] = useState([
    { name: "배전반 유지보수", qty: 1, amount: 93000000 },
  ]);
  const [draftSaved, setDraftSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [abandonOpen, setAbandonOpen] = useState(false);
  const [abandonReason, setAbandonReason] = useState("");
  const [abandonReasonText, setAbandonReasonText] = useState("");

  const total = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);

  function handleTempSave() {
    setDraftSaved(true);
    toast.show("임시저장되었습니다. 최종 제출 전까지 수정 가능합니다.", "info");
  }

  function handleSubmit() {
    setConfirmOpen(false);
    toast.show("투찰이 최종 제출되었습니다.", "success");
    onSubmitted();
  }

  function handleAbandon() {
    if (!abandonReason) {
      toast.show("입찰포기 사유를 선택하세요.", "error");
      return;
    }
    setAbandonOpen(false);
    toast.show("입찰포기 처리되었습니다. 사유가 발주처에 통보됩니다.", "info");
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 19, fontWeight: 800 }}>투찰</div>
        <StatusBadge status={closed ? "CLOSED" : "BID_OPEN"} label={closed ? "투찰마감" : "투찰가능"} />
      </div>
      <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", fontSize: 15, color: "#991B1B", marginBottom: 16 }}>
        타 업체 금액, 순위, 개찰 예정 결과는 개찰 전까지 공개되지 않습니다.
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, marginBottom: 16 }}>
        <thead>
          <tr style={{ background: "#F8FAFC" }}>
            {["품목명", "수량", "투찰단가(원)"].map((header) => (
              <th key={header} style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0", textAlign: "center" }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.name}>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0" }}>{item.name}</td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0", textAlign: "center" }}>{item.qty}</td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0" }}>
                <input
                  type="number"
                  disabled={closed}
                  value={item.amount}
                  onChange={(event) => setItems((prev) => prev.map((value, valueIndex) => (valueIndex === index ? { ...value, amount: Number(event.target.value) } : value)))}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 15, fontFamily: "inherit", textAlign: "right" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
          <span>총 투찰금액</span>
          <span>{total.toLocaleString()}원</span>
        </div>
        <div style={{ fontSize: 14, color: "#64748B", marginTop: 6 }}>
          {draftSaved ? "임시저장본이 있습니다. 제출 전까지 수정 가능합니다." : "임시저장 후 최종 제출을 구분해서 처리합니다."}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={btn("secondary")} onClick={onPrev}>이전</button>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={btn("secondary")} disabled={closed} onClick={handleTempSave}>임시저장</button>
          <button style={btn("danger")} disabled={closed} onClick={() => setAbandonOpen(true)}>입찰포기</button>
          <button style={btn("primary")} disabled={closed} onClick={() => setConfirmOpen(true)}>최종 제출</button>
        </div>
      </div>
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="투찰 제출 확인"
        footer={
          <>
            <button style={btn("secondary")} onClick={() => setConfirmOpen(false)}>취소</button>
            <button style={btn("primary")} onClick={handleSubmit}>최종 제출</button>
          </>
        }
      >
        <div style={{ fontSize: 16, color: "#334155", lineHeight: 1.7 }}>
          제출 후에는 마감 전까지만 수정할 수 있습니다. 투찰 금액을 최종 제출하시겠습니까?
        </div>
      </Modal>

      <Modal
        open={abandonOpen}
        onClose={() => setAbandonOpen(false)}
        title="입찰포기"
        footer={
          <>
            <button style={btn("secondary")} onClick={() => setAbandonOpen(false)}>취소</button>
            <button style={btn("danger")} onClick={handleAbandon}>입찰포기 제출</button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 14px", fontSize: 15, color: "#991B1B" }}>
            ⚠ 입찰포기는 취소할 수 없습니다. 제출 후 동일 입찰에 재참여 불가합니다.
          </div>
          <div>
            <label style={{ display: "block", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
              포기 사유 <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              value={abandonReason}
              onChange={(event) => setAbandonReason(event.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 15, fontFamily: "inherit" }}
            >
              <option value="">사유를 선택하세요</option>
              <option value="PRICE">투찰가격 산정 곤란</option>
              <option value="CAPACITY">생산/이행능력 부족</option>
              <option value="DELIVERY">납기 미준수 우려</option>
              <option value="DOC">제출서류 준비 미비</option>
              <option value="OTHER">기타</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>상세 사유 (선택)</label>
            <textarea
              rows={3}
              value={abandonReasonText}
              onChange={(event) => setAbandonReasonText(event.target.value)}
              placeholder="발주처에 전달할 추가 사유를 입력하세요"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 15, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ResultPanel({ awarded }: { awarded: boolean }) {
  if (!awarded) {
    return (
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
        <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "18px 20px", fontSize: 16, color: "#475569", lineHeight: 1.7 }}>
          개찰 전에는 타 업체 금액, 순위, 낙찰 결과가 보이지 않습니다.
          이 화면에서는 본인 제출 상태와 결과 공개 여부만 확인할 수 있습니다.
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
      <div style={{ background: "#EDE9FE", border: "1px solid #DDD6FE", borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#6D28D9", marginBottom: 6 }}>낙찰</div>
        <div style={{ fontSize: 16, color: "#5B21B6" }}>낙찰 확정 이후 계약·보증 화면으로 진행합니다.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "8px 12px", fontSize: 15 }}>
        <span style={{ color: "#64748B" }}>본인 투찰금액</span>
        <strong>76,000,000원</strong>
        <span style={{ color: "#64748B" }}>결과 공개 시점</span>
        <strong>개찰 완료 후</strong>
      </div>
    </div>
  );
}

export default function VBidPipelinePage() {
  const [selectedBidId, setSelectedBidId] = useState(V_MY_BIDS[0].bidId);
  const [currentStep, setCurrentStep] = useState(V_MY_BIDS[0].step);

  const selectedMyBid = V_MY_BIDS.find((item) => item.bidId === selectedBidId) ?? V_MY_BIDS[0];
  const disqualified = selectedMyBid.status === "DISQUALIFIED";
  const qualified = selectedMyBid.status === "QUALIFIED";
  const awarded = selectedMyBid.status === "AWARDED";

  function handleSelectBid(bidId: string) {
    const found = V_MY_BIDS.find((item) => item.bidId === bidId);
    if (!found) return;
    setSelectedBidId(bidId);
    setCurrentStep(found.step);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader
        title="입찰 파이프라인"
        actions={<StatusGuide screenName="SCR-S-07 협력업체 입찰 파이프라인" sections={BID_PIPELINE_GUIDE} />}
      />

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#334155", whiteSpace: "nowrap" }}>참여 중인 입찰</span>
        <select
          value={selectedBidId}
          onChange={(event) => handleSelectBid(event.target.value)}
          style={{ flex: 1, padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 16, fontFamily: "inherit" }}
        >
          {V_MY_BIDS.map((bid) => (
            <option key={bid.bidId} value={bid.bidId}>
              {bid.bidId} · {bid.title} ({bid.stepLabel})
            </option>
          ))}
        </select>
        <StatusBadge status={selectedMyBid.status} />
        {selectedMyBid.status !== "AWARDED" && selectedMyBid.status !== "ABANDONED" && (
          <button
            onClick={() => setCurrentStep(3)}
            title="투찰 단계로 이동하여 입찰포기를 처리합니다"
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid #FCA5A5",
              background: "#FEF2F2",
              color: "#B91C1C",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            입찰포기
          </button>
        )}
      </div>

      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px", fontSize: 15, color: "#334155", lineHeight: 1.7 }}>
        비교 시연 포인트:
        <strong> BID-2026-005</strong>는 자가심사 탈락,
        <strong> BID-2026-004</strong>는 자가심사 통과,
        <strong> BID-2026-003</strong>은 투찰 제출 완료 상태로 준비했습니다.
        <span style={{ display: "block", marginTop: 6, fontSize: 14, color: "#64748B" }}>
          ※ 입찰포기 시 사유 입력이 필수이며, 한 번 제출하면 동일 입찰에 재참여할 수 없습니다.
        </span>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 24px" }}>
        <Stepper steps={PIPELINE_STEPS} current={currentStep} />
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {PIPELINE_STEPS.map((step, index) => (
            <button
              key={step.label}
              onClick={() => index <= currentStep && setCurrentStep(index)}
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                border: "1px solid #CBD5E1",
                background: index === currentStep ? "#654024" : "#fff",
                color: index === currentStep ? "#fff" : index <= currentStep ? "#654024" : "#94A3B8",
                cursor: index <= currentStep ? "pointer" : "not-allowed",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {currentStep === 0 && <BidNoticePanel bid={selectedMyBid} onApply={() => setCurrentStep(1)} />}
      {currentStep === 1 && <ApplyPanel onPrev={() => setCurrentStep(0)} onSubmit={() => setCurrentStep(2)} />}
      {currentStep === 2 && <SelfReviewPanel qualified={qualified} disqualified={disqualified} onPrev={() => setCurrentStep(1)} onPass={() => setCurrentStep(3)} />}
      {currentStep === 3 && <BidPanel closed={disqualified} onPrev={() => setCurrentStep(2)} onSubmitted={() => setCurrentStep(4)} />}
      {currentStep === 4 && <ResultPanel awarded={awarded} />}
    </div>
  );
}
