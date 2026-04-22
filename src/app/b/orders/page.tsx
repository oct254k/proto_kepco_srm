"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import Stepper from "@/components/Stepper";
import Tabs from "@/components/Tabs";
import { useToast } from "@/components/Toast";
import { MOCK_ORDERS, METHOD_LABELS, PMS_SYNC_INFO } from "@/lib/mock/orders";
import type { Order } from "@/lib/types";

// ─── 선정방법 정보 ───
const METHOD_INFO: Record<string, { docs: string; process: string; extraLabel: string }> = {
  NEGOTIATION: {
    docs: "수의계약 사유서, 단가 협의서, 업체 선정 내역",
    process: "업체 선정 → 협의 → 계약 체결",
    extraLabel: "수의계약 사유",
  },
  LOWEST_PRICE: {
    docs: "견적서류, 발주요청서, 예정금액산출 근거",
    process: "공고등록 → 참여신청 → 투찰 → 개찰 → 낙찰",
    extraLabel: "특이사항",
  },
  LIMITED: {
    docs: "제한조건 설명서, 자격심사 서류, 견적서",
    process: "제한조건 설정 → 공고 → 참여신청 → 투찰 → 낙찰",
    extraLabel: "제한 조건",
  },
  TWO_STAGE: {
    docs: "기술제안서, 가격입찰서, 평가기준서",
    process: "기술평가 → 가격입찰 → 종합평가 → 낙찰",
    extraLabel: "기술평가 기준",
  },
  QUALIFIED: {
    docs: "기술평가서, 적격심사 기준, 실적 증빙서류",
    process: "기술평가 → 종합심사 → 낙찰자 선정",
    extraLabel: "심사 기준",
  },
};

// ─── 발주요청 작성 Stepper Modal ───
interface OrderWriteModalProps {
  open: boolean;
  onClose: () => void;
}

function OrderWriteModal({ open, onClose }: OrderWriteModalProps) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState("LOWEST_PRICE");
  const [extraInfo, setExtraInfo] = useState("");
  const [linkedQuote, setLinkedQuote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { label: "기본정보" },
    { label: "선정방법" },
    { label: "추가정보" },
    { label: "업체선택" },
    { label: "확인·제출" },
  ];

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!title.trim()) errs.title = "요청명을 입력하세요.";
      if (!budget.trim()) errs.budget = "요청 금액을 입력하세요.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = () => {
    onClose();
    setStep(0);
    setTimeout(() => {
      toast.show("PMS 연동 완료. PMS 계약ID: CTR-2026-016", "success");
    }, 4000);
  };

  const handleClose = () => {
    onClose();
    setStep(0);
    setErrors({});
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: 16,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 16,
    color: "#444",
    fontWeight: 600,
    marginBottom: 4,
    display: "block",
  };

  const methodInfo = METHOD_INFO[method] ?? METHOD_INFO["LOWEST_PRICE"];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>요청명 <span style={{ color: "#e53e3e" }}>*</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="발주계약요청명을 입력하세요"
                style={{ ...inputStyle, borderColor: errors.title ? "#e53e3e" : "#ccc" }}
              />
              {errors.title && <p style={{ color: "#e53e3e", fontSize: 15, marginTop: 4 }}>{errors.title}</p>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>요청 금액 <span style={{ color: "#e53e3e" }}>*</span></label>
                <input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="예: 120000000"
                  style={{ ...inputStyle, borderColor: errors.budget ? "#e53e3e" : "#ccc" }}
                />
                {errors.budget && <p style={{ color: "#e53e3e", fontSize: 15, marginTop: 4 }}>{errors.budget}</p>}
              </div>
              <div>
                <label style={labelStyle}>납기 희망일</label>
                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>요청 내용</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                rows={3}
                placeholder="발주 요청 내용 (최대 2000자)"
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <fieldset style={{ border: "1px solid #e0e0e0", borderRadius: 6, padding: 16 }}>
              <legend style={{ fontSize: 16, fontWeight: 700, color: "#444", padding: "0 8px" }}>낙찰자 선정방법</legend>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                {Object.entries(METHOD_LABELS).map(([key, label]) => (
                  <label key={key} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="method"
                      value={key}
                      checked={method === key}
                      onChange={() => setMethod(key)}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "#222" }}>{label}</span>
                      <span style={{ fontSize: 15, color: "#888", marginLeft: 8 }}>
                        {key === "NEGOTIATION" && "— 단독 업체 지정 계약"}
                        {key === "LOWEST_PRICE" && "— 가격 최저가 업체 자동 선정"}
                        {key === "LIMITED" && "— 예비가 추첨 후 예정가 이하 최저가"}
                        {key === "TWO_STAGE" && "— 기술평가 후 가격입찰"}
                        {key === "QUALIFIED" && "— 기술평가 종합 선정"}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 6, padding: 14 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1E40AF", marginBottom: 8 }}>
                선택된 방법: {METHOD_LABELS[method]}
              </p>
              <p style={{ fontSize: 15, color: "#374151", marginBottom: 6 }}>
                <strong>필요 서류:</strong> {methodInfo.docs}
              </p>
              <p style={{ fontSize: 15, color: "#374151" }}>
                <strong>입찰 프로세스:</strong> {methodInfo.process}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#f9f9f9", borderRadius: 6, padding: 12, fontSize: 16, color: "#555" }}>
              <strong>선정방법:</strong> {METHOD_LABELS[method]}
            </div>
            <div>
              <label style={labelStyle}>{methodInfo.extraLabel}</label>
              <textarea
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                rows={4}
                placeholder={`${methodInfo.extraLabel}을 입력하세요`}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            {method === "NEGOTIATION" && (
              <div>
                <label style={labelStyle}>수의계약 근거 법령</label>
                <select style={inputStyle}>
                  <option value="">선택하세요</option>
                  <option>국가계약법 시행령 제26조 (긴급입찰)</option>
                  <option>국가계약법 시행령 제26조 (소액계약)</option>
                  <option>국가계약법 시행령 제26조 (특수성)</option>
                </select>
              </div>
            )}
            {method === "LIMITED" && (
              <div>
                <label style={labelStyle}>제한 지역/자격</label>
                <input
                  placeholder="예: 서울특별시 소재 업체, ISO 9001 인증 보유"
                  style={inputStyle}
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>견적요청 연결 (선택)</label>
              <select
                value={linkedQuote}
                onChange={(e) => setLinkedQuote(e.target.value)}
                style={inputStyle}
              >
                <option value="">-- 견적요청 선택 (선택사항) --</option>
                <option value="QR-2026-013">QR-2026-013 — 네트워크 장비 구매 견적</option>
                <option value="QR-2026-014">QR-2026-014 — 서버실 UPS 교체 견적</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>대상 업체 지정</label>
              <div style={{ border: "1px solid #e0e0e0", borderRadius: 4, padding: 12 }}>
                {["(주)한국전기솔루션", "(주)IT솔루션", "(주)대성전기"].map((v) => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 16, cursor: "pointer" }}>
                    <input type="checkbox" />
                    {v}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#D1FAE5", border: "1px solid #A7F3D0", borderRadius: 6, padding: 14 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#065F46", marginBottom: 4 }}>발주요청 확인</p>
              <p style={{ fontSize: 15, color: "#065F46" }}>입력하신 내용을 확인 후 제출하세요. 제출 후 계약담당자에게 전달됩니다.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px", fontSize: 16 }}>
              <span style={{ color: "#888" }}>요청명</span><span style={{ fontWeight: 500 }}>{title || "(미입력)"}</span>
              <span style={{ color: "#888" }}>요청금액</span>
              <span style={{ fontWeight: 500 }}>
                {budget ? `₩${parseInt(budget.replace(/,/g, ""), 10).toLocaleString()}` : "(미입력)"}
              </span>
              <span style={{ color: "#888" }}>납기희망일</span><span style={{ fontWeight: 500 }}>{deliveryDate || "-"}</span>
              <span style={{ color: "#888" }}>선정방법</span><span style={{ fontWeight: 500 }}>{METHOD_LABELS[method]}</span>
              <span style={{ color: "#888" }}>연결견적</span><span style={{ fontWeight: 500 }}>{linkedQuote || "-"}</span>
            </div>
            <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 6, padding: 12, fontSize: 15, color: "#92400E" }}>
              제출 후 전자결재가 자동 생성되며, 계약담당자가 접수 처리합니다.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="발주계약요청 작성"
      width={700}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <button
            onClick={handleClose}
            style={{ padding: "8px 20px", border: "1px solid #ccc", borderRadius: 4, background: "#fff", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}
          >
            닫기
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 0 && (
              <button
                onClick={handlePrev}
                style={{ padding: "8px 20px", border: "1px solid #ccc", borderRadius: 4, background: "#fff", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}
              >
                ← 이전
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={handleNext}
                style={{ padding: "8px 20px", border: "none", borderRadius: 4, background: "#01ACC8", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                다음 →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{ padding: "8px 20px", border: "none", borderRadius: 4, background: "#065F46", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                발주요청
              </button>
            )}
          </div>
        </div>
      }
    >
      <Stepper steps={steps} current={step} />
      {renderStep()}
    </Modal>
  );
}

// ─── Drawer 상세 ───
interface OrderDetailDrawerProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

function OrderDetailDrawer({ order, open, onClose }: OrderDetailDrawerProps) {
  if (!order) return null;

  const drawerTabs = [
    { id: "info", label: "요청정보" },
    { id: "items", label: "품목목록" },
    { id: "docs", label: "첨부서류" },
    { id: "history", label: "처리이력" },
  ];

  const labelCol: React.CSSProperties = { color: "#888", fontWeight: 500, paddingTop: 2, fontSize: 16 };
  const valueCol: React.CSSProperties = { color: "#222", fontWeight: 500, fontSize: 16 };

  return (
    <Drawer open={open} onClose={onClose} title={`발주계약요청 상세 — ${order.id}`} width={620}>
      <Tabs tabs={drawerTabs}>
        {(activeTab) => (
          <>
            {activeTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px" }}>
                  <span style={labelCol}>요청번호</span><span style={valueCol}>{order.id}</span>
                  <span style={labelCol}>상태</span><span><StatusBadge status={order.status} /></span>
                  <span style={labelCol}>요청명</span><span style={valueCol}>{order.title}</span>
                  <span style={labelCol}>선정방법</span><span style={valueCol}>{METHOD_LABELS[order.method] ?? order.method}</span>
                  <span style={labelCol}>요청금액</span><span style={valueCol}>₩{order.amount.toLocaleString()}</span>
                  <span style={labelCol}>담당팀</span><span style={valueCol}>{order.assignee}</span>
                  <span style={labelCol}>요청일</span><span style={valueCol}>{order.requestedAt}</span>
                  <span style={labelCol}>PMS 연계</span><span style={valueCol}>PRJ-2026-001</span>
                  <span style={labelCol}>납기희망일</span><span style={valueCol}>2026-06-30</span>
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  {order.status === "SUBMITTED" && (
                    <button style={{ padding: "7px 14px", background: "#fff", color: "#555", border: "1px solid #ccc", borderRadius: 4, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
                      수정
                    </button>
                  )}
                  <button style={{ padding: "7px 14px", background: "#FEE2E2", color: "#991B1B", border: "1px solid #FECACA", borderRadius: 4, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
                    취소
                  </button>
                </div>
              </div>
            )}

            {activeTab === "items" && (
              <div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                      {["#", "품목명", "수량", "단위", "단가", "금액"].map((h) => (
                        <th key={h} style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "center", fontWeight: 600, color: "#444" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>1</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>전력 계측 장비</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "right" }}>2</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>SET</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "right" }}>₩60,000,000</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "right" }}>₩120,000,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "docs" && (
              <div style={{ color: "#888", fontSize: 16 }}>
                <p>등록된 첨부서류가 없습니다.</p>
              </div>
            )}

            {activeTab === "history" && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    {["일시", "이벤트", "처리자"].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "left", fontWeight: 600, color: "#444" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>2026-04-22 10:00</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>발주요청 제출</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>김담당</td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        )}
      </Tabs>
    </Drawer>
  );
}

// ─── 메인 페이지 ───
export default function BOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (row: Record<string, unknown>) => {
    const order = MOCK_ORDERS.find((o) => o.id === (row.id as string));
    if (order) {
      setSelectedOrder(order);
      setDrawerOpen(true);
    }
  };

  const columns = [
    { key: "id", label: "발주번호", width: "150px" },
    { key: "title", label: "요청명", align: "left" as const },
    {
      key: "method",
      label: "선정방법",
      width: "110px",
      render: (val: unknown) => METHOD_LABELS[val as string] ?? (val as string),
    },
    {
      key: "amount",
      label: "금액",
      width: "140px",
      align: "right" as const,
      render: (val: unknown) => `₩${(val as number).toLocaleString()}`,
    },
    { key: "assignee", label: "담당팀", width: "100px" },
    {
      key: "status",
      label: "상태",
      width: "110px",
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
  ];

  const searchFields = [
    { label: "기간", type: "daterange" as const, name: "period" },
    {
      label: "상태",
      type: "select" as const,
      name: "status",
      options: [
        { label: "접수", value: "SUBMITTED" },
        { label: "진행중", value: "IN_PROGRESS" },
        { label: "완료", value: "CLOSED" },
        { label: "취소", value: "CANCELLED" },
      ],
    },
    {
      label: "선정방법",
      type: "select" as const,
      name: "method",
      options: Object.entries(METHOD_LABELS).map(([k, v]) => ({ label: v, value: k })),
    },
    { label: "키워드", type: "text" as const, name: "keyword", placeholder: "발주명 검색" },
  ];

  return (
    <div>
      <PageHeader
        title="발주계약요청 관리"
        actions={
          <button
            onClick={() => setModalOpen(true)}
            style={{ padding: "8px 18px", background: "#01ACC8", color: "#fff", border: "none", borderRadius: 4, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            + 발주계약요청 작성
          </button>
        }
      />

      {/* PMS 연동 상태 카드 */}
      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1E40AF" }}>PMS 연동 상태: {PMS_SYNC_INFO.status}</span>
        </div>
        <span style={{ fontSize: 16, color: "#374151" }}>마지막 동기화: {PMS_SYNC_INFO.lastSync}</span>
        <span style={{ fontSize: 16, color: "#374151" }}>대기중 발주 {PMS_SYNC_INFO.pendingCount}건</span>
      </div>

      <SearchForm fields={searchFields} onSearch={() => {}} />

      <DataTable
        columns={columns}
        data={MOCK_ORDERS as unknown as Record<string, unknown>[]}
        totalCount={MOCK_ORDERS.length}
        sectionLabel="발주계약요청 목록"
        showExcel={true}
        showCheckbox={false}
        onRowClick={handleRowClick}
      />

      <OrderDetailDrawer
        order={selectedOrder}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <OrderWriteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
