"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";

interface QuoteWriteModalProps {
  open: boolean;
  onClose: () => void;
}

interface QuoteItem {
  id: number;
  categoryL: string;
  name: string;
  qty: string;
  unit: string;
  spec: string;
}

export default function QuoteWriteModal({ open, onClose }: QuoteWriteModalProps) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [pmsProject, setPmsProject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([
    { id: 1, categoryL: "", name: "", qty: "1", unit: "EA", spec: "" },
  ]);
  const [vendors, setVendors] = useState<string[]>([]);
  const [vendorSearch, setVendorSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), categoryL: "", name: "", qty: "1", unit: "EA", spec: "" },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateItem = (id: number, field: keyof QuoteItem, value: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const addVendor = () => {
    if (!vendorSearch.trim()) return;
    if (!vendors.includes(vendorSearch.trim())) {
      setVendors((prev) => [...prev, vendorSearch.trim()]);
    }
    setVendorSearch("");
  };

  const removeVendor = (v: string) => {
    setVendors((prev) => prev.filter((x) => x !== v));
  };

  const validate = (forSend: boolean) => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "요청 제목을 입력하세요.";
    if (!deadline) errs.deadline = "견적 마감일을 입력하세요.";
    if (forSend && vendors.length === 0) {
      errs.vendors = "대상 협력업체를 1개사 이상 선택하세요.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate(false)) return;
    onClose();
  };

  const handleSend = () => {
    if (!validate(true)) return;
    onClose();
    setTimeout(() => {
      toast.show("견적요청이 등록되었습니다. QR-2026-016", "success");
    }, 4000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 10px",
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

  const sectionStyle: React.CSSProperties = {
    borderTop: "1px solid #e0e0e0",
    paddingTop: 16,
    marginTop: 16,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="견적요청 작성"
      width={720}
      footer={
        <>
          <button
            onClick={onClose}
            style={{ padding: "8px 20px", border: "1px solid #CFCFCF", borderRadius: 4, background: "#ffffff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
          >
            닫기
          </button>
          <button
            onClick={handleSave}
            style={{ padding: "8px 20px", border: "1px solid #CFCFCF", borderRadius: 4, background: "#ffffff", color: "#654024", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            임시저장
          </button>
          <button
            onClick={handleSend}
            style={{ padding: "8px 20px", border: "1px solid #DFE8F0", borderRadius: 4, background: "#654024", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            발송하기
          </button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>
            요청 제목 <span style={{ color: "#e53e3e" }}>*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="견적 요청 제목을 입력하세요"
            style={{ ...inputStyle, borderColor: errors.title ? "#e53e3e" : "#ccc" }}
          />
          {errors.title && <p style={{ color: "#e53e3e", fontSize: 15, marginTop: 4 }}>{errors.title}</p>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>PMS 프로젝트</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={pmsProject}
                onChange={(e) => setPmsProject(e.target.value)}
                placeholder="프로젝트 ID"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                style={{ padding: "6px 12px", border: "1px solid #CFCFCF", borderRadius: 4, background: "#ffffff", color: "#654024", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}
              >
                연계조회
              </button>
            </div>
          </div>
          <div>
            <label style={labelStyle}>
              견적 마감일 <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{ ...inputStyle, borderColor: errors.deadline ? "#e53e3e" : "#ccc" }}
            />
            {errors.deadline && <p style={{ color: "#e53e3e", fontSize: 15, marginTop: 4 }}>{errors.deadline}</p>}
          </div>
          <div>
            <label style={labelStyle}>납기 희망일</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>전달사항</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="협력업체에 전달할 사항을 입력하세요 (최대 2000자)"
            style={{ ...inputStyle, resize: "vertical", height: "auto" }}
          />
        </div>

        <div style={sectionStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#222" }}>품목 목록</span>
            <button
              onClick={addItem}
              style={{ padding: "5px 12px", border: "1px solid #CFCFCF", borderRadius: 4, background: "#ffffff", color: "#654024", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              + 행 추가
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  {["#", "대분류", "품목명", "수량", "단위", "규격", "삭제"].map((h) => (
                    <th key={h} style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "center", fontWeight: 600, color: "#444", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee", textAlign: "center" }}>{idx + 1}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                      <input value={item.categoryL} onChange={(e) => updateItem(item.id, "categoryL", e.target.value)} placeholder="대분류" style={{ width: "90px", padding: "4px 6px", border: "1px solid #ccc", borderRadius: 3, fontSize: 15, fontFamily: "inherit" }} />
                    </td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                      <input value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="품목명" style={{ width: "140px", padding: "4px 6px", border: "1px solid #ccc", borderRadius: 3, fontSize: 15, fontFamily: "inherit" }} />
                    </td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                      <input value={item.qty} onChange={(e) => updateItem(item.id, "qty", e.target.value)} style={{ width: "60px", padding: "4px 6px", border: "1px solid #ccc", borderRadius: 3, fontSize: 15, textAlign: "right", fontFamily: "inherit" }} />
                    </td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                      <input value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} style={{ width: "60px", padding: "4px 6px", border: "1px solid #ccc", borderRadius: 3, fontSize: 15, fontFamily: "inherit" }} />
                    </td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                      <input value={item.spec} onChange={(e) => updateItem(item.id, "spec", e.target.value)} placeholder="규격" style={{ width: "100px", padding: "4px 6px", border: "1px solid #ccc", borderRadius: 3, fontSize: 15, fontFamily: "inherit" }} />
                    </td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee", textAlign: "center" }}>
                      <button onClick={() => removeItem(item.id)} style={{ background: "#ffffff", color: "#654024", border: "1px solid #CFCFCF", borderRadius: 3, padding: "3px 8px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={sectionStyle}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#222", display: "block", marginBottom: 10 }}>대상 협력업체</span>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVendor(); } }}
              placeholder="업체명 또는 사업자번호 검색"
              style={{ ...inputStyle, flex: 1, borderColor: errors.vendors ? "#e53e3e" : "#ccc" }}
            />
            <button
              onClick={addVendor}
              style={{ padding: "6px 14px", border: "1px solid #DFE8F0", borderRadius: 4, background: "#654024", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
            >
              추가
            </button>
          </div>
          {errors.vendors && <p style={{ color: "#e53e3e", fontSize: 15, marginBottom: 8 }}>{errors.vendors}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {vendors.map((v) => (
              <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#DBEAFE", color: "#1E40AF", borderRadius: 999, padding: "4px 12px", fontSize: 15, fontWeight: 600 }}>
                {v}
                <button onClick={() => removeVendor(v)} style={{ background: "transparent", border: "none", color: "#1E40AF", cursor: "pointer", padding: 0, lineHeight: 1, fontSize: 12 }}>×</button>
              </span>
            ))}
            {vendors.length === 0 && <span style={{ color: "#aaa", fontSize: 15 }}>선택된 업체가 없습니다.</span>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
