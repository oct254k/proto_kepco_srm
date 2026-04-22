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
  return (
    <div>
      {/* Table Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>
            ▶ {sectionLabel} (총{" "}
            <span style={{ color: "#01ACC8", fontWeight: 700 }}>
              {(totalCount ?? data.length).toLocaleString()}
            </span>
            건)
          </span>
          {notice && (
            <span
              style={{
                fontSize: "12px",
                color: "#e8840a",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ⚠️ {notice}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {actionButton}
          {showExcel && (
            <button
              style={{
                background: "#fff",
                color: "#01ACC8",
                border: "1px solid #01ACC8",
                borderRadius: "4px",
                padding: "5px 14px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              엑셀다운로드
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          overflowX: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
            minWidth: "600px",
          }}
        >
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              {showCheckbox && (
                <th
                  style={{
                    width: "40px",
                    padding: "10px 8px",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  <input type="checkbox" />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: col.align || "center",
                    fontWeight: 600,
                    color: "#444",
                    whiteSpace: "nowrap",
                    width: col.width,
                    fontSize: "13px",
                    background: "#f5f5f5",
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
                    height: "44px",
                    padding: "32px",
                    textAlign: "center",
                    color: "#888",
                    fontSize: "13px",
                  }}
                >
                  No Found Data.
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    background: "#fff",
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = "#f0f8fb";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = "#fff";
                  }}
                >
                  {showCheckbox && (
                    <td
                      style={{
                        height: "44px",
                        padding: "0 8px",
                        borderBottom: "1px solid #eee",
                        textAlign: "center",
                      }}
                    >
                      <input type="checkbox" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        height: "44px",
                        padding: "0 12px",
                        borderBottom: "1px solid #eee",
                        textAlign: col.align || "center",
                        color: "#444",
                        whiteSpace: "nowrap",
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
