"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import Stepper from "@/components/Stepper";
import { useToast } from "@/components/Toast";
import { METHOD_LABELS } from "@/lib/mock/orders";
import type { Order } from "@/lib/types";

export const PMS_PROJECTS = [
  { id: "PMS-2026-041", name: "포항 ESS 전력계측 개선", amount: 120000000 },
  { id: "PMS-2026-018", name: "광명공장 변압기 교체", amount: 280000000 },
  { id: "PMS-2026-022", name: "배전반 정비 연간계약", amount: 95000000 },
];

export const METHOD_INFO: Record<string, { docs: string; process: string; extraLabel: string }> = {
  NEGOTIATION: {
    docs: "수의계약 사유서, 단가 협의서, 업체 선정 내역",
    process: "업체 지정 → 협의 → 계약 체결",
    extraLabel: "수의계약 사유",
  },
  LOWEST_PRICE: {
    docs: "입찰공고문, 예정금액 산출 근거, 체크리스트",
    process: "공고등록 → 참여신청 → 투찰 → 개찰 → 낙찰",
    extraLabel: "특이사항",
  },
  LIMITED: {
    docs: "제한조건 설명서, 자격심사 서류, 견적서",
    process: "제한조건 설정 → 공고 → 참여신청 → 투찰",
    extraLabel: "제한 조건",
  },
  TWO_STAGE: {
    docs: "기술제안서, 가격입찰서, 평가기준서",
    process: "기술평가 → 가격입찰 → 종합평가 → 낙찰",
    extraLabel: "기술평가 기준",
  },
  QUALIFIED: {
    docs: "적격심사 기준, 실적 증빙서류, 기술평가서",
    process: "참여신청 → 기술평가 → 적격심사 → 낙찰",
    extraLabel: "심사 기준",
  },
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  border: "1px solid #CBD5E1",
  borderRadius: 6,
  fontSize: 16,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

function fmtCurrency(value: number) {
  return `₩${value.toLocaleString()}`;
}

interface OrderWriteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: (draft: Order) => void;
  /** 작성자 역할 (B 또는 C). 토스트 문구 차별화. */
  role?: "B" | "C";
}

export default function OrderWriteModal({ open, onClose, onSubmitted, role = "B" }: OrderWriteModalProps) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState("LOWEST_PRICE");
  const [extraInfo, setExtraInfo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedProject = PMS_PROJECTS.find((project) => project.id === projectId);
  const methodInfo = METHOD_INFO[method];
  const steps = [
    { label: "PMS 수주계약" },
    { label: "기본정보" },
    { label: "선정방법" },
    { label: "확인·제출" },
  ];

  function reset() {
    setStep(0);
    setProjectId("");
    setTitle("");
    setBudget("");
    setDeliveryDate("");
    setDescription("");
    setMethod("LOWEST_PRICE");
    setExtraInfo("");
    setErrors({});
  }

  function handleClose() {
    reset();
    onClose();
  }

  function validateCurrentStep() {
    const nextErrors: Record<string, string> = {};
    if (step === 0 && !projectId) {
      nextErrors.projectId = "PMS 수주계약을 반드시 선택해야 합니다.";
    }
    if (step === 1) {
      if (!title.trim()) nextErrors.title = "요청명을 입력하세요.";
      if (!budget.trim()) nextErrors.budget = "예산 금액을 입력하세요.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    if (step === 0 && selectedProject && !budget) {
      setBudget(String(selectedProject.amount));
      setTitle(`${selectedProject.name} 발주계약요청`);
    }
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function handleSubmit() {
    if (!projectId) {
      setStep(0);
      setErrors({ projectId: "PMS 수주계약을 선택한 뒤 제출해야 합니다." });
      return;
    }
    const draft: Order = {
      id: "ORD-2026-011",
      title: title.trim(),
      method,
      amount: Number(budget || 0),
      status: "RECEIVED",
      requestedAt: "2026-04-29",
      assignee: role === "C" ? "계약1팀(직접작성)" : "계약1팀",
      pmsProjectId: selectedProject?.id,
      pmsProjectName: selectedProject?.name,
      editableByRequester: false,
      canCancel: false,
    };
    onSubmitted(draft);
    toast.show(
      role === "C"
        ? "계약담당자 명의로 발주계약요청이 등록되었습니다. (PMS 연계 자동완료)"
        : "PMS 수주계약 기반 발주계약요청이 제출되었습니다.",
      "success"
    );
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="발주계약요청 작성"
      width={760}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <button
            onClick={handleClose}
            style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}
          >
            닫기
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 0 && (
              <button
                onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}
              >
                이전
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={handleNext}
                style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid #DFE8F0", background: "#654024", color: "#fff", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid #CFCFCF", background: "#ffffff", color: "#654024", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}
              >
                발주계약요청 제출
              </button>
            )}
          </div>
        </div>
      }
    >
      <Stepper steps={steps} current={step} />
      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: 10,
              padding: "14px 16px",
              fontSize: 15,
              color: "#1D4ED8",
              lineHeight: 1.6,
            }}
          >
            발주계약요청은 반드시 PMS 수주계약을 선택한 뒤 생성됩니다. 다음 단계에서 선정방법(수의계약/최저가/제한적/2단계/적격심사)별 제출서류 체크리스트가 자동 안내됩니다.
          </div>
          <div>
            <label style={{ display: "block", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              PMS 수주계약 선택 <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              style={{ ...inputStyle, borderColor: errors.projectId ? "#DC2626" : "#CBD5E1" }}
            >
              <option value="">선택하세요</option>
              {PMS_PROJECTS.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.id} · {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && <div style={{ marginTop: 6, fontSize: 14, color: "#DC2626" }}>{errors.projectId}</div>}
          </div>
          {selectedProject && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: "8px 12px",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                padding: 16,
                fontSize: 15,
              }}
            >
              <span style={{ color: "#64748B" }}>프로젝트 ID</span>
              <strong>{selectedProject.id}</strong>
              <span style={{ color: "#64748B" }}>사업명</span>
              <strong>{selectedProject.name}</strong>
              <span style={{ color: "#64748B" }}>연계 금액</span>
              <strong>{fmtCurrency(selectedProject.amount)}</strong>
            </div>
          )}
        </div>
      )}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              요청명 <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input value={title} onChange={(event) => setTitle(event.target.value)} style={{ ...inputStyle, borderColor: errors.title ? "#DC2626" : "#CBD5E1" }} />
            {errors.title && <div style={{ marginTop: 6, fontSize: 14, color: "#DC2626" }}>{errors.title}</div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                요청 금액 <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input value={budget} onChange={(event) => setBudget(event.target.value)} style={{ ...inputStyle, borderColor: errors.budget ? "#DC2626" : "#CBD5E1" }} />
              {errors.budget && <div style={{ marginTop: 6, fontSize: 14, color: "#DC2626" }}>{errors.budget}</div>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>납기 희망일</label>
              <input type="date" value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>요청 내용</label>
            <textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(METHOD_LABELS).map(([key, label]) => (
              <label key={key} style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="radio" checked={method === key} onChange={() => setMethod(key)} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{label}</div>
                  <div style={{ fontSize: 15, color: "#64748B", marginTop: 2 }}>{METHOD_INFO[key].process}</div>
                </div>
              </label>
            ))}
          </div>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>필요 서류 (제출 체크리스트)</div>
            <div style={{ fontSize: 15, color: "#334155", marginBottom: 10 }}>{methodInfo.docs}</div>
            <label style={{ display: "block", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{methodInfo.extraLabel}</label>
            <textarea rows={3} value={extraInfo} onChange={(event) => setExtraInfo(event.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>
      )}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: 10,
              padding: "14px 16px",
              fontSize: 15,
              color: "#166534",
              lineHeight: 1.6,
            }}
          >
            제출 후에는 {role === "C" ? "계약담당자 본인" : "사업담당자"}만 초안 상태에서 수정/취소할 수 있습니다.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "8px 12px", fontSize: 15 }}>
            <span style={{ color: "#64748B" }}>PMS 수주계약</span>
            <strong>{selectedProject ? `${selectedProject.id} · ${selectedProject.name}` : "-"}</strong>
            <span style={{ color: "#64748B" }}>요청명</span>
            <strong>{title || "-"}</strong>
            <span style={{ color: "#64748B" }}>요청 금액</span>
            <strong>{budget ? fmtCurrency(Number(budget)) : "-"}</strong>
            <span style={{ color: "#64748B" }}>선정방법</span>
            <strong>{METHOD_LABELS[method]}</strong>
          </div>
        </div>
      )}
    </Modal>
  );
}
