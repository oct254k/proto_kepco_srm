"use client";

import React, { useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { MOCK_ORDERS } from "@/lib/mock/orders";

export default function BOrdersPage() {
  const searchFields = [
    { label: "기간", type: "daterange" as const, name: "period" },
    {
      label: "진행상태",
      type: "select" as const,
      name: "progress",
      options: [
        { label: "계획", value: "계획" },
        { label: "입찰공고", value: "입찰공고" },
        { label: "업체평가", value: "업체평가" },
        { label: "개찰", value: "개찰" },
      ],
    },
    {
      label: "체크리스트",
      type: "select" as const,
      name: "checklist",
      options: [
        { label: "작성중", value: "작성중" },
        { label: "완료", value: "완료" },
      ],
    },
    { label: "키워드", type: "text" as const, name: "keyword" },
  ];

  const columns = useMemo(
    () => [
      { key: "id", label: "요청번호", width: "130px", align: "center" as const },
      { key: "title", label: "계약명", align: "left" as const },
      { key: "category", label: "구분", width: "80px", align: "center" as const },
      { key: "requestedAt", label: "요청일", width: "100px", align: "center" as const },
      { key: "contractNo", label: "수주계약번호", width: "130px", align: "center" as const },
      { key: "contractName", label: "수주계약명", align: "left" as const },
      {
        key: "checklistStatus",
        label: "체크리스트",
        width: "90px",
        align: "center" as const,
        render: (value: unknown) => <StatusBadge status={String(value)} />,
      },
      {
        key: "progressStatus",
        label: "진행상태",
        width: "90px",
        align: "center" as const,
        render: (value: unknown) => <StatusBadge status={String(value)} />,
      },
    ],
    [],
  );

  const actionButton = (
    <button
      type="button"
      style={{
        background: "#654024",
        color: "#ffffff",
        border: "1px solid #DFE8F0",
        borderRadius: 8,
        height: 36,
        padding: "0 14px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      체크리스트 작성
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <PageHeader title="발주계약 관리" />
      <SearchForm fields={searchFields} onSearch={() => {}} />
      <DataTable
        columns={columns}
        data={MOCK_ORDERS as unknown as Record<string, unknown>[]}
        totalCount={MOCK_ORDERS.length}
        sectionLabel="발주계약요청 목록"
        showExcel
        showCheckbox
        actionButton={actionButton}
      />
    </div>
  );
}
