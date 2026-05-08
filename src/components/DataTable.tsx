"use client";

import React from "react";

export interface Column {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  totalCount?: number;
  notice?: string;
  showExcel?: boolean;
  showCheckbox?: boolean;
  sectionLabel?: string;
  actionButton?: React.ReactNode;
  onRowClick?: (row: Record<string, unknown>) => void;
}

export default function DataTable({
  columns,
  data,
  totalCount,
  notice,
  showExcel = true,
  showCheckbox = true,
  sectionLabel = "목록",
  actionButton,
  onRowClick,
}: DataTableProps) {
  const count = totalCount ?? data.length;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E8E8",
        borderRadius: 12,
        padding: 24,
        minWidth: 0,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a" }}>{sectionLabel}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#D58040" }}>
            {count.toLocaleString()}건
          </span>
          {notice && (
            <span style={{ fontSize: 12, color: "#fd7e14", marginLeft: 8 }}>⚠ {notice}</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {actionButton}
          {showExcel && (
            <button
              type="button"
              style={{
                background: "#ffffff",
                color: "#1a1a1a",
                border: "1px solid #CFCFCF",
                borderRadius: 6,
                height: 32,
                padding: "0 12px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 18,
                  height: 18,
                  borderRadius: 3,
                  background: "#16A34A",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                X
              </span>
              다운로드
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
            minWidth: 600,
          }}
        >
          <thead>
            <tr style={{ borderTop: "1px solid #E8E8E8", borderBottom: "2px solid #1a1a1a" }}>
              {showCheckbox && (
                <th
                  style={{
                    width: 40,
                    padding: "12px 8px",
                    textAlign: "center",
                    fontWeight: 500,
                    color: "#555",
                    fontSize: 13,
                  }}
                >
                  <input type="checkbox" />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: "12px 12px",
                    textAlign: col.align || "center",
                    fontWeight: 500,
                    color: "#555",
                    whiteSpace: "nowrap",
                    width: col.width,
                    fontSize: 13,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showCheckbox ? 1 : 0)}
                  style={{
                    height: 48,
                    padding: 32,
                    textAlign: "center",
                    color: "#9CA3AF",
                    fontSize: 13,
                  }}
                >
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    background: "#fff",
                    cursor: onRowClick ? "pointer" : "default",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = "#FBF7F0";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = "#fff";
                  }}
                >
                  {showCheckbox && (
                    <td
                      style={{
                        height: 48,
                        padding: "0 8px",
                        textAlign: "center",
                      }}
                    >
                      <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        height: 48,
                        padding: "0 12px",
                        textAlign: col.align || "center",
                        color: "#1a1a1a",
                        whiteSpace: "nowrap",
                        fontSize: 13,
                      }}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
