"use client";

import React, { useState } from "react";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import Drawer from "@/components/Drawer";
import Tabs from "@/components/Tabs";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { MOCK_BIDS, METHOD_LABELS, BID_PARTICIPANTS } from "@/lib/mock/bids";
import type { Bid } from "@/lib/types";

// ── 인라인 스타일 헬퍼 ──────────────────────────────────────────
const btn = (variant: "primary" | "secondary" | "danger" = "primary"): React.CSSProperties => ({
  padding: "6px 16px",
  borderRadius: 4,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  border: variant === "primary" ? "none" : variant === "danger" ? "none" : "1px solid #01ACC8",
  background: variant === "primary" ? "#01ACC8" : variant === "danger" ? "#DC2626" : "#fff",
  color: variant === "primary" ? "#fff" : variant === "danger" ? "#fff" : "#01ACC8",
});

const fieldRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 };
const label: React.CSSProperties = { minWidth: 110, fontSize: 16, color: "#555", fontWeight: 500 };
const input: React.CSSProperties = {
  flex: 1, padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4,
  fontSize: 16, fontFamily: "inherit",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 17, fontWeight: 700, color: "#222", margin: "20px 0 12px",
  paddingBottom: 8, borderBottom: "2px solid #01ACC8",
};

// ── 계획 등록 폼 ────────────────────────────────────────────────
function PlanForm({ onSave }: { onSave: () => void }) {
  const toast = useToast();
  const [method, setMethod] = useState("LOWEST_PRICE");
  const [bidType, setBidType] = useState("OPEN");
  const [selfAssess, setSelfAssess] = useState("N");

  const handleConfirm = () => {
    toast.show("입찰계획이 확정되었습니다. 공고 등록 탭을 이용하세요.", "success");
    onSave();
  };

  const handleDraft = () => {
    toast.show("임시 저장되었습니다.", "info");
  };

  const radioGroup: React.CSSProperties = { display: "flex", gap: 16, flexWrap: "wrap" };
  const radio: React.CSSProperties = { display: "flex", alignItems: "center", gap: 4, fontSize: 16, cursor: "pointer" };

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 6, border: "1px solid #e0e0e0" }}>
      <div style={sectionTitle}>입찰계획 등록</div>

      <div style={fieldRow}>
        <span style={label}>발주계획 연계</span>
        <input style={{ ...input, flex: "none", width: 200 }} placeholder="발주계획 검색" readOnly />
        <button style={{ ...btn("secondary"), fontSize: 15 }}>🔍 검색</button>
        <span style={{ fontSize: 15, color: "#888" }}>ORD-PLAN-2026-010 — 태양광 인버터 구매</span>
      </div>

      <div style={fieldRow}>
        <span style={label}>입찰공고명 <span style={{ color: "#DC2626" }}>*</span></span>
        <input style={input} placeholder="입찰공고명을 입력하세요 (최대 300자)" />
      </div>

      <div style={fieldRow}>
        <span style={label}>낙찰자 선정방법 <span style={{ color: "#DC2626" }}>*</span></span>
        <div style={radioGroup}>
          {[
            { val: "LOWEST_PRICE", label: "최저가" },
            { val: "LIMITED", label: "제한경쟁" },
            { val: "TWO_STAGE", label: "2단계경쟁" },
            { val: "QUALIFIED", label: "적격심사" },
            { val: "NEGOTIATION", label: "수의계약" },
          ].map((m) => (
            <label key={m.val} style={radio}>
              <input type="radio" name="method" value={m.val} checked={method === m.val} onChange={() => setMethod(m.val)} />
              {m.label}
            </label>
          ))}
        </div>
      </div>

      <div style={fieldRow}>
        <span style={label}>입찰 유형 <span style={{ color: "#DC2626" }}>*</span></span>
        <div style={radioGroup}>
          {[{ val: "OPEN", label: "공개입찰" }, { val: "RESTRICTED", label: "제한경쟁" }, { val: "DESIGNATED", label: "지명경쟁" }].map((t) => (
            <label key={t.val} style={radio}>
              <input type="radio" name="bidType" value={t.val} checked={bidType === t.val} onChange={() => setBidType(t.val)} />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {bidType === "DESIGNATED" && (
        <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 6, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>지명경쟁 대상 업체 지정</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input style={{ ...input, flex: "none", width: 160 }} placeholder="업체명 검색" />
            <button style={{ ...btn("secondary"), fontSize: 15 }}>🔍 검색</button>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {["(주)대성전기", "(주)한진산업"].map((v) => (
              <span key={v} style={{ background: "#01ACC8", color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: 15 }}>
                {v} ✕
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={fieldRow}>
        <span style={label}>자가심사 여부</span>
        <div style={radioGroup}>
          {[{ val: "N", label: "해당없음" }, { val: "Y", label: "자가심사 진행" }].map((s) => (
            <label key={s.val} style={radio}>
              <input type="radio" name="selfAssess" value={s.val} checked={selfAssess === s.val} onChange={() => setSelfAssess(s.val)} />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <div style={fieldRow}><span style={label}>입찰공개일</span><input type="date" style={input} /></div>
        <div style={fieldRow}><span style={label}>투찰 마감일시 <span style={{ color: "#DC2626" }}>*</span></span><input type="datetime-local" style={input} /></div>
        <div style={fieldRow}><span style={label}>개찰 예정일</span><input type="date" style={input} /></div>
        <div style={fieldRow}><span style={label}>납품 기간</span><input type="date" style={{ ...input, flex: "none", width: "45%" }} /><span>~</span><input type="date" style={{ ...input, flex: "none", width: "45%" }} /></div>
        <div style={fieldRow}><span style={label}>입찰보증금률(%)</span><input type="number" defaultValue="5.00" style={input} /></div>
        <div style={fieldRow}><span style={label}>이행보증금률(%)</span><input type="number" defaultValue="10.00" style={input} /></div>
        <div style={fieldRow}><span style={label}>예정금액(원)</span><input type="number" style={input} placeholder="0" /></div>
        <div style={fieldRow}><span style={label}>비고</span><input style={input} placeholder="비고 입력" /></div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        <button style={btn("secondary")} onClick={handleDraft}>임시저장</button>
        <button style={btn("primary")} onClick={handleConfirm}>계획 확정</button>
      </div>
    </div>
  );
}

// ── 공고 등록 폼 ────────────────────────────────────────────────
function NoticeForm() {
  const toast = useToast();
  const [items, setItems] = useState([
    { name: "태양광 인버터 5kW", spec: "IEC형", qty: 5, unit: "EA", unitPrice: 42000000 },
    { name: "태양광 인버터 10kW", spec: "IEC형", qty: 3, unit: "EA", unitPrice: 78000000 },
  ]);

  const handlePublish = () => {
    // 설계서 FN-P-14 §6: srm-bid-stage: ANNOUNCED + srm-bid-items Webhook 시뮬레이션
    toast.show(
      "공고 게시 완료 — srm-bid-stage(ANNOUNCED) 이벤트가 PMS로 전송되었습니다. " +
      "PMS Pipeline PL-001(광명공장 LED 조명교체)이 '공고중' 컬럼으로 이동됩니다.",
      "success"
    );
  };

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 6, border: "1px solid #e0e0e0" }}>
      <div style={sectionTitle}>공고 등록</div>
      <div style={{ background: "#F0F9FF", borderRadius: 6, padding: "8px 14px", marginBottom: 16, fontSize: 16, color: "#1E40AF" }}>
        공고 대상: BID-2026-005 — 태양광 설비 물품 구매 (계획에서 자동 연계)
      </div>

      <div style={fieldRow}>
        <span style={label}>공고 제목 <span style={{ color: "#DC2626" }}>*</span></span>
        <input style={input} defaultValue="태양광 인버터 구매 입찰" />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ ...label, marginBottom: 8 }}>공고 내용 <span style={{ color: "#DC2626" }}>*</span></div>
        <div style={{ border: "1px solid #ccc", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ background: "#f5f5f5", padding: "6px 10px", fontSize: 15, borderBottom: "1px solid #ccc", color: "#555" }}>
            B I U | ≡ ≡ | 표 | 이미지 | 링크
          </div>
          <textarea
            style={{ width: "100%", minHeight: 120, padding: 10, border: "none", fontSize: 16, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
            defaultValue={"본 공고는 켑코이에스(주)에서 시행하는 태양광 인버터 구매 입찰 공고입니다.\n입찰에 참여하고자 하는 업체는 아래 내용을 확인하시기 바랍니다."}
          />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ ...label, marginBottom: 8 }}>품목 목록</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              {["#", "품목명", "규격", "수량", "단위", "단가(원)", ""].map((h) => (
                <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{i + 1}</td>
                <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0" }}>
                  <input style={{ ...input, flex: "none", width: "100%" }} value={item.name} onChange={(e) => setItems(items.map((it, idx) => idx === i ? { ...it, name: e.target.value } : it))} />
                </td>
                <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0" }}>
                  <input style={{ ...input, flex: "none", width: "100%" }} value={item.spec} onChange={(e) => setItems(items.map((it, idx) => idx === i ? { ...it, spec: e.target.value } : it))} />
                </td>
                <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0" }}>
                  <input type="number" style={{ ...input, flex: "none", width: 60 }} value={item.qty} onChange={(e) => setItems(items.map((it, idx) => idx === i ? { ...it, qty: Number(e.target.value) } : it))} />
                </td>
                <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0" }}>
                  <input style={{ ...input, flex: "none", width: 60 }} value={item.unit} onChange={(e) => setItems(items.map((it, idx) => idx === i ? { ...it, unit: e.target.value } : it))} />
                </td>
                <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0" }}>
                  <input type="number" style={{ ...input, flex: "none", width: 110 }} value={item.unitPrice} onChange={(e) => setItems(items.map((it, idx) => idx === i ? { ...it, unitPrice: Number(e.target.value) } : it))} />
                </td>
                <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                  <button style={{ ...btn("danger"), padding: "2px 8px", fontSize: 15 }} onClick={() => setItems(items.filter((_, idx) => idx !== i))}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{ ...btn("secondary"), fontSize: 15, marginTop: 6 }} onClick={() => setItems([...items, { name: "", spec: "", qty: 1, unit: "EA", unitPrice: 0 }])}>
          + 행 추가
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <span style={label}>첨부파일</span>
        <input type="file" style={{ marginLeft: 8 }} multiple />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button style={btn("secondary")}>미리보기</button>
        <button style={btn("secondary")}>임시저장</button>
        <button style={btn("primary")} onClick={handlePublish}>공고 게시</button>
      </div>
    </div>
  );
}

// ── 공고 상세 Drawer ─────────────────────────────────────────────
function BidDetailDrawer({ bid, open, onClose }: { bid: Bid | null; open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const participants = bid ? BID_PARTICIPANTS.filter((p) => p.bidId === bid.id) : [];

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.show("취소 사유를 입력하세요.", "error");
      return;
    }
    toast.show("공고가 취소되었습니다.", "info");
    setCancelModalOpen(false);
    onClose();
  };

  return (
    <>
      <Drawer open={open} onClose={onClose} title={`입찰공고 상세 — ${bid?.id ?? ""}`} width={620}>
        {bid && (
          <Tabs
            tabs={[
              { id: "info", label: "공고정보" },
              { id: "items", label: "품목목록" },
              { id: "vendors", label: "참여업체현황" },
              { id: "self", label: "자가심사현황" },
              { id: "history", label: "공고이력" },
            ]}
          >
            {(tab) => (
              <>
                {tab === "info" && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                      {[
                        { label: "공고번호", value: bid.id },
                        { label: "상태", value: <StatusBadge status={bid.status} /> },
                        { label: "공고명", value: bid.title },
                        { label: "선정방법", value: METHOD_LABELS[bid.method] ?? bid.method },
                        { label: "공고일", value: bid.publishedAt },
                        { label: "마감일", value: bid.deadline },
                        { label: "예정금액", value: `${bid.estAmount.toLocaleString()}원` },
                        { label: "보증금률", value: "입찰 5% / 이행 10%" },
                      ].map((item) => (
                        <div key={item.label} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                          <div style={{ fontSize: 15, color: "#888", marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontSize: 17, fontWeight: 500 }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                    {bid.status === "ACTIVE" && (
                      <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
                        <button style={btn("secondary")}>공고 수정</button>
                        <button style={btn("danger")} onClick={() => setCancelModalOpen(true)}>공고 취소</button>
                      </div>
                    )}
                  </div>
                )}
                {tab === "items" && (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        {["#", "품목명", "규격", "수량", "단위"].map((h) => (
                          <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "태양광 인버터 5kW", spec: "IEC형", qty: 5, unit: "EA" },
                        { name: "태양광 인버터 10kW", spec: "IEC형", qty: 3, unit: "EA" },
                      ].map((item, i) => (
                        <tr key={i}>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{i + 1}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{item.name}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{item.spec}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{item.qty}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {tab === "vendors" && (
                  participants.length === 0 ? (
                    <div style={{ padding: 32, textAlign: "center", color: "#888" }}>참여업체가 없습니다.</div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                      <thead>
                        <tr style={{ background: "#f5f5f5" }}>
                          {["업체명", "투찰금액", "점수", "상태"].map((h) => (
                            <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {participants.map((p) => (
                          <tr key={p.id}>
                            <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{p.vendorName}</td>
                            <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "right" }}>{p.amount.toLocaleString()}원</td>
                            <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{p.score > 0 ? `${p.score}점` : "-"}</td>
                            <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}><StatusBadge status={p.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}
                {tab === "self" && (
                  <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
                    <div style={{ fontSize: 35, marginBottom: 12 }}>📋</div>
                    <div>자가심사 현황 데이터가 없습니다.</div>
                  </div>
                )}
                {tab === "history" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { date: bid.publishedAt, event: "공고 게시", user: "이계약" },
                      { date: "2026-04-18", event: "계획 확정", user: "이계약" },
                      { date: "2026-04-15", event: "계획 임시저장", user: "이계약" },
                    ].map((h, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                        <span style={{ fontSize: 15, color: "#888", minWidth: 90 }}>{h.date}</span>
                        <span style={{ fontSize: 16, color: "#333" }}>{h.event}</span>
                        <span style={{ fontSize: 15, color: "#888", marginLeft: "auto" }}>{h.user}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </Tabs>
        )}
      </Drawer>

      <Modal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="공고 취소 사유 입력"
        footer={
          <>
            <button style={btn("secondary")} onClick={() => setCancelModalOpen(false)}>닫기</button>
            <button style={btn("danger")} onClick={handleCancel}>공고 취소 확인</button>
          </>
        }
      >
        <div style={{ marginBottom: 8, fontSize: 17, fontWeight: 500 }}>취소 사유 <span style={{ color: "#DC2626" }}>*</span></div>
        <textarea
          style={{ width: "100%", minHeight: 100, padding: 10, border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
          placeholder="공고 취소 사유를 입력하세요."
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
        <div style={{ fontSize: 15, color: "#888", marginTop: 6 }}>* 취소 사유는 참여업체에게 통보됩니다.</div>
      </Modal>
    </>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────────
export default function CBidsPage() {
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const columns: Column[] = [
    { key: "id", label: "공고번호", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    { key: "method", label: "선정방법", width: "110px", align: "center", render: (val) => METHOD_LABELS[String(val)] ?? String(val) },
    { key: "estAmount", label: "예정금액", width: "130px", align: "right", render: (val) => `${Number(val).toLocaleString()}원` },
    { key: "publishedAt", label: "공고일", width: "100px", align: "center" },
    { key: "deadline", label: "마감일", width: "100px", align: "center" },
    { key: "status", label: "상태", width: "90px", align: "center", render: (val) => <StatusBadge status={String(val)} /> },
  ];

  const handleRowClick = (row: Record<string, unknown>) => {
    setSelectedBid(row as unknown as Bid);
    setDrawerOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader
        title="입찰계획·공고 관리"
        actions={
          <button style={btn("primary")} onClick={() => setActiveTab("plan")}>
            + 입찰계획 등록
          </button>
        }
      />

      {/* 탭 Bar */}
      <div style={{ display: "flex", borderBottom: "2px solid #e0e0e0" }}>
        {[
          { id: "list", label: "입찰 목록" },
          { id: "plan", label: "계획 등록" },
          { id: "notice", label: "공고 등록" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "10px 20px", fontSize: 17, fontWeight: activeTab === t.id ? 700 : 400,
              color: activeTab === t.id ? "#01ACC8" : "#555", background: "transparent",
              border: "none", borderBottom: `2px solid ${activeTab === t.id ? "#01ACC8" : "transparent"}`,
              cursor: "pointer", marginBottom: -2, fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "list" && (
        <>
          <SearchForm
            fields={[
              { label: "기간", name: "period", type: "daterange" },
              { label: "상태", name: "status", type: "select", options: [{ label: "공고중", value: "ACTIVE" }, { label: "진행중", value: "IN_PROGRESS" }, { label: "개찰완료", value: "OPENED" }, { label: "마감", value: "CLOSED" }, { label: "낙찰완료", value: "AWARDED" }] },
              { label: "선정방법", name: "method", type: "select", options: Object.entries(METHOD_LABELS).map(([v, l]) => ({ value: v, label: l })) },
              { label: "키워드", name: "keyword", type: "text", placeholder: "공고명 검색" },
            ]}
          />
          <DataTable
            columns={columns}
            data={MOCK_BIDS as unknown as Record<string, unknown>[]}
            sectionLabel="입찰 목록"
            onRowClick={handleRowClick}
          />
        </>
      )}

      {activeTab === "plan" && <PlanForm onSave={() => setActiveTab("notice")} />}
      {activeTab === "notice" && <NoticeForm />}

      <BidDetailDrawer bid={selectedBid} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
