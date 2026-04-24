"use client";

import React, { useState } from "react";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import Tabs from "@/components/Tabs";
import { useToast } from "@/components/Toast";
import { MOCK_BIDS, METHOD_LABELS, RESERVE_PRICES, OPEN_BID_RESULTS, MOCK_AWARDS } from "@/lib/mock/bids";

const btn = (variant: "primary" | "secondary" | "danger" | "ghost" = "primary"): React.CSSProperties => ({
  padding: "6px 16px", borderRadius: 4, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  border: variant === "primary" ? "none" : variant === "danger" ? "none" : variant === "ghost" ? "1px solid #e0e0e0" : "1px solid #01ACC8",
  background: variant === "primary" ? "#01ACC8" : variant === "danger" ? "#DC2626" : "#fff",
  color: variant === "primary" ? "#fff" : variant === "danger" ? "#fff" : variant === "ghost" ? "#555" : "#01ACC8",
});

// ── 예비가 추첨 Modal ─────────────────────────────────────────
function DrawModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (no: number) => {
    if (selected.includes(no)) {
      setSelected(selected.filter((s) => s !== no));
    } else if (selected.length < 2) {
      setSelected([...selected, no]);
    }
  };

  const avg = selected.length === 2
    ? Math.round((RESERVE_PRICES[selected[0] - 1].amount + RESERVE_PRICES[selected[1] - 1].amount) / 2)
    : null;
  const lowerBound = avg ? Math.round(avg * 0.87) : null;

  const handleConfirm = () => {
    if (selected.length < 2) {
      toast.show("2개 번호를 선택해야 합니다.", "error");
      return;
    }
    toast.show("예정가가 확정되었습니다.", "success");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="예비가 추첨 — BID-2026-005"
      width={520}
      footer={
        <>
          <button style={btn("secondary")} onClick={onClose}>취소</button>
          <button style={{ ...btn("primary"), opacity: selected.length < 2 ? 0.5 : 1 }} onClick={handleConfirm} disabled={selected.length < 2}>
            예정가 확정
          </button>
        </>
      }
    >
      <div>
        <div style={{ fontSize: 16, marginBottom: 14, color: "#555" }}>15개 번호 중 2개를 선택하세요</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
          {RESERVE_PRICES.map((rp) => (
            <button
              key={rp.no}
              style={{
                padding: "8px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                border: selected.includes(rp.no) ? "2px solid #01ACC8" : "1px solid #e0e0e0",
                borderRadius: 6, background: selected.includes(rp.no) ? "#E0F7FA" : "#fff",
                color: selected.includes(rp.no) ? "#01ACC8" : "#333",
              }}
              onClick={() => toggleSelect(rp.no)}
            >
              [{rp.no < 10 ? ` ${rp.no}` : rp.no}]
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div style={{ background: "#F0F9FF", borderRadius: 6, padding: 14, marginBottom: 12 }}>
            {selected.map((no, i) => (
              <div key={no} style={{ display: "flex", justifyContent: "space-between", fontSize: 16, padding: "4px 0" }}>
                <span>선택 {i + 1}: {no}번</span>
                <span style={{ fontWeight: 600 }}>{RESERVE_PRICES[no - 1].amount.toLocaleString()}원</span>
              </div>
            ))}
            {avg && (
              <>
                <div style={{ borderTop: "1px solid #e0e0e0", marginTop: 8, paddingTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
                    <span>예정가 (산술평균)</span>
                    <span style={{ color: "#01ACC8" }}>{avg.toLocaleString()}원</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: "#888", marginTop: 4 }}>
                    <span>낙찰하한금액 (하한율 87%)</span>
                    <span>{lowerBound?.toLocaleString()}원</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div style={{ fontSize: 15, color: "#888" }}>
          추첨 일시: 2026-04-28 14:00 | 추첨 담당: 이계약
        </div>
      </div>
    </Modal>
  );
}

// ── 개찰 결과 공개 Modal ──────────────────────────────────────
function OpenBidModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="개찰결과 공개"
      footer={
        <>
          <button style={btn("secondary")} onClick={onClose}>취소</button>
          <button style={btn("primary")} onClick={onConfirm}>개찰 실행</button>
        </>
      }
    >
      <div>
        <div style={{ background: "#FEF3C7", borderRadius: 6, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "#92400E" }}>개찰 진행 전 확인</div>
          <div style={{ fontSize: 16, color: "#78350F" }}>
            개찰 실행 시 모든 참여업체의 투찰금액이 공개됩니다. 한번 실행 후에는 취소할 수 없습니다.
          </div>
        </div>
        <div style={{ fontSize: 16, color: "#555" }}>
          <div>공고: BID-2026-005 태양광 인버터 구매 입찰</div>
          <div>예정금액: 98,000,000원</div>
          <div>참여업체: 5개사</div>
        </div>
      </div>
    </Modal>
  );
}

// ── 낙찰 확정 Modal ───────────────────────────────────────────
function AwardConfirmModal({ open, onClose, onConfirm, vendorName, amount }: { open: boolean; onClose: () => void; onConfirm: () => void; vendorName: string; amount: number }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="낙찰 확정"
      footer={
        <>
          <button style={btn("secondary")} onClick={onClose}>취소</button>
          <button style={btn("primary")} onClick={onConfirm}>확정</button>
        </>
      }
    >
      <div>
        <div style={{ background: "#EDE9FE", borderRadius: 8, padding: 20, marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "#5B21B6", marginBottom: 6 }}>낙찰 예정 업체</div>
          <div style={{ fontSize: 23, fontWeight: 800, color: "#5B21B6" }}>{vendorName}</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#7C3AED", marginTop: 6 }}>{amount.toLocaleString()}원</div>
        </div>
        <div style={{ fontSize: 16, color: "#555", marginBottom: 8 }}>
          낙찰을 확정하면 PMS Pipeline S5가 자동으로 시작됩니다.
        </div>
        <div style={{ background: "#FEF2F2", borderRadius: 6, padding: "8px 12px", fontSize: 15, color: "#DC2626" }}>
          ⚠ 낙찰 확정 후에는 취소할 수 없습니다.
        </div>
      </div>
    </Modal>
  );
}

// ── 결과 통보 Modal ───────────────────────────────────────────
function NotifyModal({ open, onClose, vendorName, amount }: { open: boolean; onClose: () => void; vendorName: string; amount: number }) {
  const toast = useToast();

  const handleSend = () => {
    onClose();
    setTimeout(() => toast.show("낙찰 결과가 참여업체에 통보되었습니다.", "info"), 4000);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="낙찰 결과 통보 — BID-2026-005"
      width={560}
      footer={
        <>
          <button style={btn("secondary")} onClick={onClose}>취소</button>
          <button style={btn("primary")} onClick={handleSend}>메일 발송</button>
        </>
      }
    >
      <div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>통보 대상</div>
          {["전체참여업체 (5개사)", "낙찰업체 (1개사)", "탈락업체 (4개사)"].map((opt, i) => (
            <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 16, cursor: "pointer" }}>
              <input type="radio" name="notifyTarget" defaultChecked={i === 0} />
              {opt}
            </label>
          ))}
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>메일 제목</div>
          <input style={{ width: "100%", padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit", boxSizing: "border-box" }} defaultValue="낙찰 결과 안내 — 태양광 인버터 구매 입찰" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>메일 본문</div>
          <textarea style={{ width: "100%", minHeight: 120, padding: "8px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
            defaultValue={`안녕하세요. 입찰 결과를 안내드립니다.\n공고명: 태양광 인버터 구매 입찰 (BID-2026-005)\n낙찰업체: ${vendorName}\n낙찰금액: ${amount.toLocaleString()}원`}
          />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>발송 이력</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                {["업체명", "발송일시", "상태"].map((h) => (
                  <th key={h} style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { vendor: "(주)한국전기솔루션", time: "미발송", ok: null },
                { vendor: "(주)태양전력", time: "미발송", ok: null },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0" }}>{r.vendor}</td>
                  <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center", color: "#888" }}>{r.time}</td>
                  <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                    <span style={{ color: "#888", fontSize: 14 }}>대기중</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

// ── Tab 1: 예정가 관리 ─────────────────────────────────────────
function Tab1EstPrice({ bidId }: { bidId: string }) {
  const toast = useToast();
  const [drawModalOpen, setDrawModalOpen] = useState(false);
  const [estAmount, setEstAmount] = useState(98000000);
  const [floorRate, setFloorRate] = useState(87.0);
  const lowerBound = Math.round(estAmount * floorRate / 100);

  return (
    <div>
      <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 6, padding: "8px 14px", marginBottom: 16, fontSize: 15, color: "#1E40AF" }}>
        ℹ 예정가 정보는 가격등록자만 입력 가능합니다. 계약담당자는 읽기 전용입니다.
      </div>

      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, color: "#222" }}>예정가 정보</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
          <div>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>예정금액 (원)</div>
            <input type="number" style={{ width: "100%", padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit", boxSizing: "border-box" }}
              value={estAmount}
              onChange={(e) => setEstAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>낙찰하한율 (%)</div>
            <input type="number" step="0.1" style={{ width: "100%", padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit", boxSizing: "border-box" }}
              value={floorRate}
              onChange={(e) => setFloorRate(Number(e.target.value))}
            />
          </div>
          <div>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>낙찰하한금액 (자동 계산)</div>
            <div style={{ padding: "7px 10px", background: "#F9FAFB", border: "1px solid #e0e0e0", borderRadius: 4, fontSize: 16, color: "#01ACC8", fontWeight: 700 }} aria-live="polite">
              {lowerBound.toLocaleString()}원
            </div>
          </div>
          <div>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>산정기초조서 파일</div>
            <input type="file" />
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#222" }}>예비가격표 (15개 — 제한경쟁 전용)</div>
          <span style={{ fontSize: 16, color: "#555" }}>완료: <strong style={{ color: "#01ACC8" }}>15/15</strong></span>
        </div>
        <div style={{ overflowY: "auto", maxHeight: 300 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                {["No", "예비가금액 (원)", "비고"].map((h) => (
                  <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RESERVE_PRICES.map((rp) => (
                <tr key={rp.no}>
                  <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center", fontWeight: 600 }}>{rp.no}</td>
                  <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0" }}>
                    <input type="number" defaultValue={rp.amount} style={{ width: "100%", padding: "4px 6px", border: "1px solid #e0e0e0", borderRadius: 3, fontSize: 16, fontFamily: "inherit", textAlign: "right" }} />
                  </td>
                  <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0" }}>
                    <input placeholder="비고" style={{ width: "100%", padding: "4px 6px", border: "1px solid #e0e0e0", borderRadius: 3, fontSize: 16, fontFamily: "inherit" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button style={btn("secondary")} onClick={() => toast.show("저장되었습니다.", "success")}>저장</button>
        <button style={btn("primary")} onClick={() => setDrawModalOpen(true)}>추첨 실행</button>
      </div>

      <DrawModal open={drawModalOpen} onClose={() => setDrawModalOpen(false)} />
    </div>
  );
}

// ── Tab 2: 개찰결과 ───────────────────────────────────────────
function Tab2OpenBid({ bidId }: { bidId: string }) {
  const toast = useToast();
  const [openBidModal, setOpenBidModal] = useState(false);
  const [opened, setOpened] = useState(false);

  const handleOpenBid = () => {
    setOpened(true);
    setOpenBidModal(false);
    toast.show("개찰이 완료되었습니다.", "success");
  };

  const columns: Column[] = [
    { key: "rank", label: "순위", width: "50px", align: "center" },
    { key: "vendorName", label: "업체명", align: "left" },
    {
      key: "amount",
      label: "투찰금액 (원)",
      width: "140px",
      align: "right",
      render: (val, row) => row.abandoned ? "투찰포기" : `${Number(val).toLocaleString()}`,
    },
    { key: "estRate", label: "예정가대비율", width: "110px", align: "center" },
    {
      key: "qualified",
      label: "하한충족",
      width: "90px",
      align: "center",
      render: (val, row) => row.abandoned ? "—" : val ? <span style={{ color: "#065F46" }}>충족 ✅</span> : <span style={{ color: "#DC2626" }}>미달 ❌</span>,
    },
    {
      key: "candidate",
      label: "낙찰후보",
      width: "90px",
      align: "center",
      render: (val, row) => row.abandoned ? "—" : val ? <span style={{ color: "#065F46" }}>후보 ✅</span> : <span style={{ color: "#DC2626" }}>제외 ❌</span>,
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "12px 16px", background: "#F9FAFB", borderRadius: 6 }}>
        <span style={{ fontSize: 16 }}>공고 상태: <strong>마감완료 (CLOSED)</strong></span>
        <span style={{ fontSize: 16 }}>예정가: <strong style={{ color: "#01ACC8" }}>98,000,000원</strong></span>
        <span style={{ fontSize: 16 }}>하한금액: <strong>85,260,000원</strong></span>
        <button style={{ ...btn("primary"), marginLeft: "auto" }} onClick={() => setOpenBidModal(true)}>
          개찰
        </button>
      </div>

      {opened && (
        <>
          <DataTable
            columns={columns}
            data={OPEN_BID_RESULTS as unknown as Record<string, unknown>[]}
            sectionLabel="개찰결과"
            showCheckbox={false}
            showExcel={false}
          />
          <div style={{ background: "#F9FAFB", borderRadius: 6, padding: "10px 16px", marginTop: 10, fontSize: 16, color: "#555" }}>
            개찰일시: 2026-04-29 10:00 &nbsp;|&nbsp; 참여업체: 5개사 &nbsp;|&nbsp; 유효 투찰: 3건
          </div>
        </>
      )}

      {!opened && (
        <div style={{ padding: 40, textAlign: "center", color: "#888", background: "#F9FAFB", borderRadius: 8 }}>
          <div style={{ fontSize: 35, marginBottom: 8 }}>📊</div>
          <div>개찰을 실행하면 투찰 결과가 여기에 표시됩니다.</div>
        </div>
      )}

      <OpenBidModal open={openBidModal} onClose={() => setOpenBidModal(false)} onConfirm={handleOpenBid} />
    </div>
  );
}

// ── Tab 3: 낙찰확정 ───────────────────────────────────────────
function Tab3Award({ bidId }: { bidId: string }) {
  const toast = useToast();
  const [selectedVendor, setSelectedVendor] = useState(OPEN_BID_RESULTS[0].vendorName);
  const [selectedAmount, setSelectedAmount] = useState(OPEN_BID_RESULTS[0].amount);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [awarded, setAwarded] = useState(false);

  const candidates = OPEN_BID_RESULTS.filter((r) => r.candidate);

  const handleAwardConfirm = () => {
    setConfirmModalOpen(false);
    setAwarded(true);
    // 설계서 FN-P-14 §6: srm-bid-awarded Webhook 시뮬레이션
    // BID-2026-005 → PMS PL-001 (광명공장 LED 조명교체) 연계
    setTimeout(() => toast.show(
      "낙찰 확정 완료 — srm-bid-awarded 이벤트가 PMS로 전송되었습니다. " +
      "PMS Pipeline PL-001(광명공장 LED 조명교체)이 '낙찰' 컬럼으로 이동됩니다.",
      "success"
    ), 500);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: "#222" }}>
          낙찰 후보 목록 (제한경쟁 — 예정가 이하 최저가 기준)
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16, marginBottom: 8 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              {["순위", "업체명", "투찰금액 (원)", "예정가대비율", "선택"].map((h) => (
                <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr key={i} style={{ background: selectedVendor === c.vendorName ? "#F0F9FF" : "#fff" }}>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{c.rank}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{c.vendorName}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "right" }}>{c.amount.toLocaleString()}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{c.estRate}</td>
                <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                  <input
                    type="radio"
                    name="awardCandidate"
                    checked={selectedVendor === c.vendorName}
                    onChange={() => { setSelectedVendor(c.vendorName); setSelectedAmount(c.amount); }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 15, color: "#888", marginBottom: 16 }}>※ 최저가 기준 1순위 자동 선택. 동점 발생 시 수동 지정.</div>

        {!awarded && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 6, marginBottom: 16 }}>
            <div style={{ fontSize: 16 }}>
              낙찰업체: <strong>{selectedVendor}</strong> &nbsp;|&nbsp; 낙찰금액: <strong style={{ color: "#01ACC8" }}>{selectedAmount.toLocaleString()}원</strong>
            </div>
            <button style={btn("primary")} onClick={() => setConfirmModalOpen(true)}>낙찰업체 확정</button>
          </div>
        )}
      </div>

      {awarded && (
        <>
          <div style={{ background: "#EDE9FE", border: "1px solid #DDD6FE", borderRadius: 8, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#5B21B6", marginBottom: 8 }}>낙찰 확정 완료</div>
            <div style={{ display: "flex", gap: 24, fontSize: 16 }}>
              <span>낙찰업체: <strong>{selectedVendor}</strong></span>
              <span>낙찰금액: <strong style={{ color: "#5B21B6" }}>{selectedAmount.toLocaleString()}원</strong></span>
              <span>확정일: <strong>2026-04-29</strong></span>
            </div>
            <div style={{ marginTop: 10, padding: "8px 12px", background: "#D1FAE5", borderRadius: 6, fontSize: 15, color: "#065F46" }}>
              ✅ srm-bid-awarded 이벤트 전송 완료 — PMS Pipeline PL-001(광명공장 LED 조명교체) '낙찰' 컬럼으로 이동
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 16, color: "#555" }}>통보 대상:</span>
            {["전체참여업체", "낙찰업체", "탈락업체"].map((opt, i) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 16, cursor: "pointer" }}>
                <input type="radio" name="notifyTargetMain" defaultChecked={i === 0} />
                {opt}
              </label>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={btn("primary")} onClick={() => setNotifyModalOpen(true)}>결과 통보 발송</button>
          </div>
        </>
      )}

      <AwardConfirmModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleAwardConfirm}
        vendorName={selectedVendor}
        amount={selectedAmount}
      />

      <NotifyModal
        open={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        vendorName={selectedVendor}
        amount={selectedAmount}
      />
    </div>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────────
export default function CAwardsPage() {
  const [selectedBidId, setSelectedBidId] = useState<string>("BID-2026-005");
  const [showDetail, setShowDetail] = useState(false);

  const selectedBid = MOCK_BIDS.find((b) => b.id === selectedBidId);

  // 낙찰관리 대상 공고 목록 컬럼
  const awardListColumns: Column[] = [
    { key: "id", label: "공고ID", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    { key: "method", label: "낙찰방법", width: "110px", align: "center", render: (val) => METHOD_LABELS[String(val)] ?? String(val) },
    {
      key: "status",
      label: "상태",
      width: "90px",
      align: "center",
      render: (val) => <StatusBadge status={String(val)} />,
    },
    {
      key: "id",
      label: "진행단계",
      width: "120px",
      align: "center",
      render: (val) => {
        const stages: Record<string, string> = {
          "BID-2026-005": "예정가대기",
          "BID-2026-004": "낙찰확정대기",
          "BID-2026-003": "낙찰완료",
          "BID-2026-002": "마감",
          "BID-2026-001": "낙찰완료",
        };
        return <span style={{ fontSize: 15, color: "#555" }}>{stages[String(val)] ?? "-"}</span>;
      },
    },
  ];

  const awardsColumns: Column[] = [
    { key: "id", label: "낙찰ID", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    { key: "vendorName", label: "낙찰업체", width: "160px", align: "center" },
    { key: "awardedAmount", label: "낙찰금액", width: "130px", align: "right", render: (val) => `${Number(val).toLocaleString()}원` },
    { key: "status", label: "상태", width: "90px", align: "center", render: (val) => <StatusBadge status={String(val)} /> },
    { key: "awardedAt", label: "확정일", width: "100px", align: "center" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader title="낙찰관리 통합 ★ PMS Pipeline S5" />

      {/* 입찰 선택 */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>입찰 선택</span>
          <select
            style={{ flex: 1, padding: "6px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 16, fontFamily: "inherit", background: "#fff" }}
            value={selectedBidId}
            onChange={(e) => { setSelectedBidId(e.target.value); setShowDetail(true); }}
          >
            {MOCK_BIDS.map((b) => (
              <option key={b.id} value={b.id}>{b.id} — {b.title} ({METHOD_LABELS[b.method] ?? b.method})</option>
            ))}
          </select>
          {selectedBid && <StatusBadge status={selectedBid.status} />}
          <button style={btn("primary")} onClick={() => setShowDetail(true)}>조회</button>
        </div>
      </div>

      {/* 공고 목록 테이블 */}
      {!showDetail && (
        <DataTable
          columns={awardListColumns}
          data={MOCK_BIDS as unknown as Record<string, unknown>[]}
          sectionLabel="낙찰관리 대상 공고"
          onRowClick={(row) => { setSelectedBidId(String(row.id)); setShowDetail(true); }}
          showCheckbox={false}
        />
      )}

      {/* 탭 영역 — 공고 선택 후 표시 */}
      {showDetail && selectedBid && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <button style={btn("ghost")} onClick={() => setShowDetail(false)}>← 목록</button>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#222" }}>
              {selectedBid.id} / {selectedBid.title} / 낙찰방법: {METHOD_LABELS[selectedBid.method]}
            </span>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20 }}>
            <Tabs
              tabs={[
                { id: "est", label: "예정가 관리" },
                { id: "open", label: "개찰결과" },
                { id: "award", label: "낙찰확정" },
              ]}
            >
              {(tab) => (
                <>
                  {tab === "est" && <Tab1EstPrice bidId={selectedBidId} />}
                  {tab === "open" && <Tab2OpenBid bidId={selectedBidId} />}
                  {tab === "award" && <Tab3Award bidId={selectedBidId} />}
                </>
              )}
            </Tabs>
          </div>
        </div>
      )}

      {/* 낙찰 이력 */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: "#222" }}>낙찰 이력</div>
        <DataTable
          columns={awardsColumns}
          data={MOCK_AWARDS as unknown as Record<string, unknown>[]}
          sectionLabel="낙찰 이력"
          showCheckbox={false}
        />
      </div>
    </div>
  );
}
