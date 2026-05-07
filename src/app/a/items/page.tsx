"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import DataTable, { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/Toast";
import {
  ITEM_CATEGORIES_L,
  ITEM_CATEGORIES_M,
  MOCK_ITEMS,
} from "@/lib/mock/items";
import type { Item } from "@/lib/types";

// ────────── 단가 이력 mock ──────────────────────────────────────────────────
const PRICE_HISTORY: Record<string, { from: string; to: string | null; price: number; by: string }[]> = {
  IT001: [
    { from: "2026-01-01", to: null, price: 8500000, by: "관리자 / 2026-01-01" },
    { from: "2025-01-01", to: "2025-12-31", price: 7800000, by: "관리자 / 2025-01-01" },
  ],
  IT002: [
    { from: "2026-01-01", to: null, price: 25000000, by: "관리자 / 2026-01-01" },
  ],
  IT003: [
    { from: "2025-06-01", to: null, price: 12000000, by: "관리자 / 2025-06-01" },
  ],
  IT004: [
    { from: "2025-03-01", to: null, price: 4500000, by: "관리자 / 2025-03-01" },
  ],
  IT005: [
    { from: "2024-07-01", to: null, price: 3200000, by: "관리자 / 2024-07-01" },
  ],
  IT006: [
    { from: "2026-01-01", to: null, price: 1200000, by: "관리자 / 2026-01-01" },
    { from: "2025-01-01", to: "2025-12-31", price: 1100000, by: "관리자 / 2025-01-01" },
  ],
};

// ────────── 스타일 헬퍼 ─────────────────────────────────────────────────────
const btnPrimary: React.CSSProperties = {
  padding: "6px 14px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  border: "1px solid #DFE8F0",
  background: "#654024",
  color: "#ffffff",
};
const btnOutline: React.CSSProperties = {
  padding: "6px 14px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  border: "1px solid #CFCFCF",
  background: "#ffffff",
  color: "#654024",
};
const btnDanger: React.CSSProperties = {
  padding: "6px 14px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  border: "1px solid #CFCFCF",
  background: "#ffffff",
  color: "#654024",
};
const labelStyle: React.CSSProperties = {
  fontSize: 16,
  color: "#555",
  fontWeight: 500,
  minWidth: 90,
  flexShrink: 0,
};
const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "6px 8px",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 16,
  fontFamily: "inherit",
};
const fieldRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 12,
};

// ────────── 메인 컴포넌트 ───────────────────────────────────────────────────
export default function ItemsPage() {
  const { show } = useToast();

  // ── 분류 선택 상태 ──────────────────────────────────────────────────────
  const [selectedLId, setSelectedLId] = useState<string>(ITEM_CATEGORIES_L[0].id);
  const [selectedMId, setSelectedMId] = useState<string>(
    ITEM_CATEGORIES_M[ITEM_CATEGORIES_L[0].id]?.[0]?.id ?? ""
  );

  // ── 품목 목록 상태 ──────────────────────────────────────────────────────
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchStatus, setSearchStatus] = useState("all");

  // ── Drawer 상태 ─────────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"new" | "edit">("new");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [drawerForm, setDrawerForm] = useState({ name: "", unit: "", stdPrice: "", active: true });

  // ── 품목 추가 Modal ─────────────────────────────────────────────────────
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemForm, setItemForm] = useState({ name: "", unit: "", stdPrice: "" });

  // ── 대분류 추가 Modal ───────────────────────────────────────────────────
  const [lModalOpen, setLModalOpen] = useState(false);
  const [lForm, setLForm] = useState({ name: "" });

  // ── 중분류 추가 Modal ───────────────────────────────────────────────────
  const [mModalOpen, setMModalOpen] = useState(false);
  const [mForm, setMForm] = useState({ name: "" });

  // ── 폐기 확인 Modal ─────────────────────────────────────────────────────
  const [inactiveModalOpen, setInactiveModalOpen] = useState(false);

  // ── 단가 등록 Modal ─────────────────────────────────────────────────────
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [priceForm, setPriceForm] = useState({ price: "", from: "" });

  // ── Excel 업로드 Modal ──────────────────────────────────────────────────
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  // ── 분류 목록 상태 (추가 지원) ──────────────────────────────────────────
  const [categoriesL, setCategoriesL] = useState(ITEM_CATEGORIES_L);
  const [categoriesM, setCategoriesM] = useState<typeof ITEM_CATEGORIES_M>(ITEM_CATEGORIES_M);

  // ─────────────────────────────────────────────────────────────────────────
  // 헬퍼: 현재 선택된 대분류/중분류 이름
  const selectedL = categoriesL.find((c) => c.id === selectedLId);
  const midList = categoriesM[selectedLId] ?? [];
  const selectedM = midList.find((m) => m.id === selectedMId);

  // 필터링된 품목
  const filteredItems = items.filter((item) => {
    const matchL = item.categoryL === selectedL?.name;
    const matchM = !selectedM || item.categoryM === selectedM.name;
    const matchKeyword =
      !searchKeyword ||
      item.name.includes(searchKeyword) ||
      item.id.includes(searchKeyword);
    const matchStatus =
      searchStatus === "all"
        ? true
        : searchStatus === "active"
        ? item.active
        : !item.active;
    return matchL && matchM && matchKeyword && matchStatus;
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 대분류 클릭
  function handleSelectL(id: string) {
    setSelectedLId(id);
    const firstM = categoriesM[id]?.[0]?.id ?? "";
    setSelectedMId(firstM);
  }

  // 행 클릭 → Drawer 편집 모드
  function handleRowClick(row: Record<string, unknown>) {
    const item = items.find((i) => i.id === (row.id as string));
    if (!item) return;
    setSelectedItem(item);
    setDrawerForm({
      name: item.name,
      unit: item.unit,
      stdPrice: String(item.stdPrice),
      active: item.active,
    });
    setDrawerMode("edit");
    setDrawerOpen(true);
  }

  // Drawer 저장
  function handleDrawerSave() {
    if (!drawerForm.name || !drawerForm.unit || !drawerForm.stdPrice) return;
    setTimeout(() => {
      if (drawerMode === "new") {
        const newItem: Item = {
          id: "IT" + String(Date.now()).slice(-4),
          categoryL: selectedL?.name ?? "",
          categoryM: selectedM?.name ?? "",
          name: drawerForm.name,
          unit: drawerForm.unit,
          stdPrice: Number(drawerForm.stdPrice),
          active: drawerForm.active,
        };
        setItems((prev) => [...prev, newItem]);
      } else if (selectedItem) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? {
                  ...item,
                  name: drawerForm.name,
                  unit: drawerForm.unit,
                  stdPrice: Number(drawerForm.stdPrice),
                  active: drawerForm.active,
                }
              : item
          )
        );
      }
      setDrawerOpen(false);
      show("품목 정보가 저장되었습니다.");
    }, 4000);
  }

  // 폐기 처리
  function handleInactive() {
    setInactiveModalOpen(true);
  }
  function confirmInactive() {
    if (!selectedItem) return;
    setInactiveModalOpen(false);
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, active: false } : item
        )
      );
      setDrawerOpen(false);
      show("품목이 폐기(INACTIVE) 처리되었습니다.");
    }, 4000);
  }

  // 품목 추가 Modal 저장
  function handleItemModalSave() {
    if (!itemForm.name || !itemForm.unit || !itemForm.stdPrice) return;
    setTimeout(() => {
      const newItem: Item = {
        id: "IT" + String(Date.now()).slice(-4),
        categoryL: selectedL?.name ?? "",
        categoryM: selectedM?.name ?? "",
        name: itemForm.name,
        unit: itemForm.unit,
        stdPrice: Number(itemForm.stdPrice),
        active: true,
      };
      setItems((prev) => [...prev, newItem]);
      setItemModalOpen(false);
      setItemForm({ name: "", unit: "", stdPrice: "" });
      show("품목 정보가 저장되었습니다.");
    }, 4000);
  }

  // 대분류 추가
  function handleLModalSave() {
    if (!lForm.name) return;
    const newId = "L" + String(Date.now()).slice(-3);
    setCategoriesL((prev) => [...prev, { id: newId, name: lForm.name, count: 0 }]);
    setCategoriesM((prev) => ({ ...prev, [newId]: [] }));
    setLModalOpen(false);
    setLForm({ name: "" });
    show("대분류가 등록되었습니다.");
  }

  // 중분류 추가
  function handleMModalSave() {
    if (!mForm.name) return;
    const newId = "M" + String(Date.now()).slice(-3);
    setCategoriesM((prev) => ({
      ...prev,
      [selectedLId]: [...(prev[selectedLId] ?? []), { id: newId, name: mForm.name, count: 0 }],
    }));
    setMModalOpen(false);
    setMForm({ name: "" });
    show("중분류가 등록되었습니다.");
  }

  // 단가 등록
  function handlePriceSave() {
    if (!priceForm.price || !priceForm.from) return;
    setTimeout(() => {
      setPriceModalOpen(false);
      setPriceForm({ price: "", from: "" });
      show("단가가 등록되었습니다.");
    }, 4000);
  }

  // DataTable 컬럼
  const columns: Column[] = [
    { key: "id", label: "품목코드", width: "100px", align: "center" },
    { key: "name", label: "품목명", align: "left" },
    { key: "unit", label: "단위", width: "70px", align: "center" },
    {
      key: "stdPrice",
      label: "기준단가",
      width: "120px",
      align: "right",
      render: (v) => (v != null ? (v as number).toLocaleString() + " 원" : ""),
    },
    {
      key: "active",
      label: "활성여부",
      width: "90px",
      align: "center",
      render: (v) => <StatusBadge status={(v as boolean) ? "활성" : "폐기"} />,
    },
  ];

  // 단가 이력 (선택 품목)
  const priceHistory =
    selectedItem && PRICE_HISTORY[selectedItem.id]
      ? PRICE_HISTORY[selectedItem.id]
      : [];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader title="품목 기준정보" />

      {/* 검색 필터 바 */}
      <div
        style={{
          background: "#FAF7F2",
          border: "1px solid #e0e0e0",
          borderRadius: 6,
          padding: "12px 20px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="품목코드/명 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ ...inputStyle, width: 220 }}
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          style={{ ...inputStyle, width: 120 }}
        >
          <option value="all">상태 전체</option>
          <option value="active">활성</option>
          <option value="inactive">폐기</option>
        </select>
        <button style={btnPrimary}>조회</button>
      </div>

      {/* Master / Detail 레이아웃 */}
      <div style={{ display: "flex", gap: 0, background: "#FAF7F2", border: "1px solid #e0e0e0", borderRadius: 6, overflow: "hidden" }}>

        {/* ── 좌측 대분류 패널 ─────────────────────────────────────────── */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "1px solid #e0e0e0",
              fontWeight: 700,
              fontSize: 16,
              color: "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>대분류</span>
            <button
              style={{ ...btnPrimary, padding: "3px 8px", fontSize: 12 }}
              onClick={() => setLModalOpen(true)}
            >
              + 추가
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {categoriesL.map((cat) => {
              const isSelected = cat.id === selectedLId;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectL(cat.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    border: "1px solid #CFCFCF",
                    borderBottom: "1px solid #f0f0f0",
                    background: isSelected ? "#e6f7fa" : "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: "inherit",
                    fontSize: 16,
                    fontWeight: isSelected ? 700 : 400,
                    color: isSelected ? "#00a7ea" : "#333",
                    borderLeft: isSelected ? "3px solid #00a7ea" : "3px solid transparent",
                  }}
                >
                  <span>{cat.name}</span>
                  <span
                    style={{
                      background: isSelected ? "#00a7ea" : "#e5e7eb",
                      color: isSelected ? "#fff" : "#555",
                      borderRadius: 999,
                      padding: "1px 8px",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 우측 콘텐츠 영역 ─────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>

          {/* 중분류 Chip 영역 */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              minHeight: 52,
            }}
          >
            <span style={{ fontSize: 15, color: "#888", marginRight: 4 }}>중분류:</span>
            {midList.length === 0 ? (
              <span style={{ fontSize: 16, color: "#aaa" }}>소분류를 먼저 등록하세요</span>
            ) : (
              midList.map((m) => {
                const isActive = m.id === selectedMId;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMId(m.id)}
                    style={{
                      padding: "4px 14px",
                      borderRadius: 999,
                      border: isActive ? "1px solid #DFE8F0" : "1px solid #CFCFCF",
                      background: isActive ? "#654024" : "#ffffff",
                      color: isActive ? "#ffffff" : "#654024",
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 400,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {m.name} ({m.count})
                  </button>
                );
              })
            )}
            <button
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                border: "1px solid #CFCFCF",
                background: "#ffffff",
                color: "#654024",
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
              onClick={() => setMModalOpen(true)}
            >
              + 중분류 추가
            </button>
          </div>

          {/* 품목 목록 */}
          <div style={{ flex: 1, padding: 16 }}>
            {midList.length === 0 ? (
              <EmptyState message="중분류를 먼저 등록하세요." />
            ) : (
              <DataTable
                columns={columns}
                data={filteredItems as unknown as Record<string, unknown>[]}
                sectionLabel={`${selectedM?.name ?? ""} 품목 목록`}
                showExcel={true}
                showCheckbox={false}
                onRowClick={handleRowClick}
                actionButton={
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={btnPrimary}
                      onClick={() => {
                        setDrawerMode("new");
                        setDrawerForm({ name: "", unit: "", stdPrice: "", active: true });
                        setSelectedItem(null);
                        setDrawerOpen(true);
                      }}
                    >
                      + 품목 등록
                    </button>
                    <button style={btnOutline} onClick={() => setExcelModalOpen(true)}>
                      Excel 업로드
                    </button>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Drawer: 품목 상세/편집 ───────────────────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          drawerMode === "new"
            ? "품목 등록"
            : `품목 상세 — ${selectedItem?.id} ${selectedItem?.name}`
        }
        width={680}
      >
        {/* 상태 표시 */}
        {drawerMode === "edit" && selectedItem && (
          <div style={{ marginBottom: 16 }}>
            <StatusBadge status={selectedItem.active ? "활성" : "폐기"} />
            {!selectedItem.active && (
              <p style={{ fontSize: 15, color: "#dc2626", marginTop: 6 }}>
                폐기 품목은 먼저 활성화하세요. 수정 폼이 일부 제한됩니다.
              </p>
            )}
          </div>
        )}

        {/* 품목 기본정보 폼 */}
        <div
          style={{
            background: "#f9f9f9",
            border: "1px solid #e0e0e0",
            borderRadius: 6,
            padding: "16px",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#333" }}>
            품목 기본정보
          </div>

          <div style={fieldRow}>
            <span style={labelStyle}>대분류</span>
            <span style={{ fontSize: 16, color: "#444" }}>{selectedL?.name ?? "-"}</span>
          </div>
          <div style={fieldRow}>
            <span style={labelStyle}>중분류</span>
            <span style={{ fontSize: 16, color: "#444" }}>{selectedM?.name ?? "-"}</span>
          </div>
          <div style={fieldRow}>
            <label style={labelStyle}>품목명 *</label>
            <input
              style={inputStyle}
              value={drawerForm.name}
              onChange={(e) => setDrawerForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="품목명 입력"
              disabled={drawerMode === "edit" && selectedItem?.active === false}
            />
          </div>
          <div style={fieldRow}>
            <label style={labelStyle}>단위 *</label>
            <select
              style={inputStyle}
              value={drawerForm.unit}
              onChange={(e) => setDrawerForm((f) => ({ ...f, unit: e.target.value }))}
              disabled={drawerMode === "edit" && selectedItem?.active === false}
            >
              <option value="">선택</option>
              <option value="대">대</option>
              <option value="면">면</option>
              <option value="EA">EA</option>
              <option value="KG">KG</option>
              <option value="M">M</option>
              <option value="SET">SET</option>
            </select>
          </div>
          <div style={fieldRow}>
            <label style={labelStyle}>기준단가 *</label>
            <input
              style={inputStyle}
              type="number"
              value={drawerForm.stdPrice}
              onChange={(e) => setDrawerForm((f) => ({ ...f, stdPrice: e.target.value }))}
              placeholder="기준단가 입력"
              disabled={drawerMode === "edit" && selectedItem?.active === false}
            />
          </div>
          <div style={fieldRow}>
            <label style={labelStyle}>상태 *</label>
            <div style={{ display: "flex", gap: 16 }}>
              {[true, false].map((v) => (
                <label key={String(v)} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 16 }}>
                  <input
                    type="radio"
                    checked={drawerForm.active === v}
                    onChange={() => setDrawerForm((f) => ({ ...f, active: v }))}
                  />
                  {v ? "ACTIVE (활성)" : "INACTIVE (폐기)"}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button style={btnOutline} onClick={() => setDrawerOpen(false)}>취소</button>
            {drawerMode === "edit" && selectedItem?.active && (
              <button style={btnDanger} onClick={handleInactive}>폐기 처리</button>
            )}
            <button
              style={btnPrimary}
              onClick={handleDrawerSave}
              disabled={drawerMode === "edit" && selectedItem?.active === false}
            >
              저장
            </button>
          </div>
        </div>

        {/* 단가 이력 섹션 */}
        {drawerMode === "edit" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: "#333" }}>
                표준단가 이력
                {priceHistory.length > 0 && (
                  <span style={{ marginLeft: 8, fontSize: 15, color: "#00a7ea", fontWeight: 400 }}>
                    현재 유효 단가: {priceHistory[0].price.toLocaleString()} 원
                  </span>
                )}
              </div>
              <button
                style={{ ...btnPrimary, padding: "4px 10px", fontSize: 12 }}
                onClick={() => setPriceModalOpen(true)}
              >
                + 신규 단가 등록
              </button>
            </div>
            {priceHistory.length === 0 ? (
              <EmptyState message="등록된 단가 이력이 없습니다." />
            ) : (
              <div style={{ overflowX: "auto", border: "1px solid #e0e0e0", borderRadius: 4 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "center" }}>적용시작일</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "center" }}>적용종료일</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "right" }}>단가(원)</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "center" }}>등록자·등록일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceHistory.map((p, idx) => (
                      <tr key={idx} style={{ background: idx === 0 ? "#e6f6fd" : "#fff" }}>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>{p.from}</td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>
                          {p.to ?? <span style={{ color: "#00a7ea", fontWeight: 600 }}>(현재 유효)</span>}
                        </td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "right" }}>
                          {p.price.toLocaleString()}
                        </td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>{p.by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* ── Modal: 폐기 확인 ─────────────────────────────────────────────── */}
      <Modal
        open={inactiveModalOpen}
        onClose={() => setInactiveModalOpen(false)}
        title="폐기 처리 확인"
        width={480}
        footer={
          <>
            <button style={btnOutline} onClick={() => setInactiveModalOpen(false)}>취소</button>
            <button style={btnDanger} onClick={confirmInactive}>폐기 처리</button>
          </>
        }
      >
        <p style={{ fontSize: 17, color: "#333", lineHeight: 1.7 }}>
          현재 해당 품목이 일부 입찰공고에서 참조 중일 수 있습니다.
          <br />
          폐기(INACTIVE) 처리 시 신규 사용이 불가합니다.
          <br />
          <strong>진행하시겠습니까?</strong>
        </p>
      </Modal>

      {/* ── Modal: 품목 추가 ─────────────────────────────────────────────── */}
      <Modal
        open={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        title="품목 추가"
        width={480}
        footer={
          <>
            <button style={btnOutline} onClick={() => setItemModalOpen(false)}>취소</button>
            <button style={btnPrimary} onClick={handleItemModalSave}>저장</button>
          </>
        }
      >
        <div style={fieldRow}>
          <label style={labelStyle}>품목명 *</label>
          <input
            style={inputStyle}
            value={itemForm.name}
            onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="품목명 입력"
          />
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>단위 *</label>
          <select
            style={inputStyle}
            value={itemForm.unit}
            onChange={(e) => setItemForm((f) => ({ ...f, unit: e.target.value }))}
          >
            <option value="">선택</option>
            <option value="대">대</option>
            <option value="면">면</option>
            <option value="EA">EA</option>
            <option value="KG">KG</option>
            <option value="M">M</option>
            <option value="SET">SET</option>
          </select>
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>기준단가 *</label>
          <input
            style={inputStyle}
            type="number"
            value={itemForm.stdPrice}
            onChange={(e) => setItemForm((f) => ({ ...f, stdPrice: e.target.value }))}
            placeholder="기준단가 (원)"
          />
        </div>
      </Modal>

      {/* ── Modal: 대분류 추가 ───────────────────────────────────────────── */}
      <Modal
        open={lModalOpen}
        onClose={() => setLModalOpen(false)}
        title="대분류 추가"
        width={400}
        footer={
          <>
            <button style={btnOutline} onClick={() => setLModalOpen(false)}>취소</button>
            <button style={btnPrimary} onClick={handleLModalSave}>저장</button>
          </>
        }
      >
        <div style={fieldRow}>
          <label style={labelStyle}>대분류명 *</label>
          <input
            style={inputStyle}
            value={lForm.name}
            onChange={(e) => setLForm({ name: e.target.value })}
            placeholder="대분류명 입력"
          />
        </div>
      </Modal>

      {/* ── Modal: 중분류 추가 ───────────────────────────────────────────── */}
      <Modal
        open={mModalOpen}
        onClose={() => setMModalOpen(false)}
        title="중분류 추가"
        width={400}
        footer={
          <>
            <button style={btnOutline} onClick={() => setMModalOpen(false)}>취소</button>
            <button style={btnPrimary} onClick={handleMModalSave}>저장</button>
          </>
        }
      >
        <div style={{ marginBottom: 12, fontSize: 16, color: "#555" }}>
          대분류: <strong>{selectedL?.name}</strong>
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>중분류명 *</label>
          <input
            style={inputStyle}
            value={mForm.name}
            onChange={(e) => setMForm({ name: e.target.value })}
            placeholder="중분류명 입력"
          />
        </div>
      </Modal>

      {/* ── Modal: 단가 등록 ─────────────────────────────────────────────── */}
      <Modal
        open={priceModalOpen}
        onClose={() => setPriceModalOpen(false)}
        title="신규 단가 등록"
        width={440}
        footer={
          <>
            <button style={btnOutline} onClick={() => setPriceModalOpen(false)}>취소</button>
            <button style={btnPrimary} onClick={handlePriceSave}>등록</button>
          </>
        }
      >
        <div style={fieldRow}>
          <label style={labelStyle}>단가 *</label>
          <input
            style={inputStyle}
            type="number"
            value={priceForm.price}
            onChange={(e) => setPriceForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="단가 (원)"
          />
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>적용시작일 *</label>
          <input
            style={inputStyle}
            type="date"
            value={priceForm.from}
            onChange={(e) => setPriceForm((f) => ({ ...f, from: e.target.value }))}
          />
        </div>
      </Modal>

      {/* ── Modal: Excel 업로드 ──────────────────────────────────────────── */}
      <Modal
        open={excelModalOpen}
        onClose={() => setExcelModalOpen(false)}
        title="품목 일괄 업로드"
        width={680}
        footer={
          <>
            <button style={btnOutline} onClick={() => setExcelModalOpen(false)}>취소</button>
            <button
              style={btnPrimary}
              onClick={() => {
                setTimeout(() => {
                  setExcelModalOpen(false);
                  setExcelFile(null);
                  show("2건 등록 완료 / 1건 오류");
                }, 4000);
              }}
            >
              최종 등록 (유효 건만)
            </button>
          </>
        }
      >
        <div
          style={{
            border: "2px dashed #ccc",
            borderRadius: 6,
            padding: "24px",
            textAlign: "center",
            marginBottom: 16,
            color: "#888",
            fontSize: 16,
          }}
        >
          <div style={{ marginBottom: 8 }}>Excel 파일을 이곳에 드래그&드롭 하거나</div>
          <label
            style={{
              display: "inline-block",
              ...btnPrimary,
              cursor: "pointer",
            }}
          >
            파일 선택 (xlsx, 최대 5MB)
            <input
              type="file"
              accept=".xlsx"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && f.size > 5 * 1024 * 1024) {
                  show("파일 크기는 5MB 이하여야 합니다.", "error");
                  return;
                }
                setExcelFile(f ?? null);
              }}
            />
          </label>
          {excelFile && (
            <p style={{ marginTop: 8, color: "#333" }}>{excelFile.name}</p>
          )}
        </div>

        {/* 검증 결과 미리보기 */}
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#333" }}>
          검증 결과 미리보기
        </div>
        <div style={{ overflowX: "auto", border: "1px solid #e0e0e0", borderRadius: 4 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                {["행", "대분류", "중분류", "품목명", "단위", "오류"].map((h) => (
                  <th key={h} style={{ padding: "7px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>2</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee" }}>전기자재</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee" }}>변압기</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee" }}>변압기 TR200</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>EA</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee", color: "#16a34a" }}>—</td>
              </tr>
              <tr style={{ background: "#FEF2F2" }}>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>3</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee" }}>전기자재</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee", color: "#dc2626" }}>???</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee" }}>측정기기류</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>EA</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee", color: "#dc2626", fontSize: 14 }}>소분류 없음</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 8, fontSize: 15, color: "#555" }}>
          유효 <strong style={{ color: "#16a34a" }}>1건</strong> / 오류{" "}
          <strong style={{ color: "#dc2626" }}>1건</strong>
        </div>
      </Modal>
    </div>
  );
}
