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
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "28px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#333",
              lineHeight: 1,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "8px",
                height: "8px",
                borderTop: "2px solid #00a7ea",
                borderRight: "2px solid #00a7ea",
                transform: "rotate(45deg)",
                display: "inline-block",
                flex: "0 0 auto",
              }}
            />
            <span>
            {sectionLabel} (총{" "}
            <span style={{ color: "#00a7ea", fontWeight: 700 }}>
              {(totalCount ?? data.length).toLocaleString()}
            </span>
            건)
            </span>
          </span>
          {notice && (
            <span
              style={{
                fontSize: "12px",
                color: "#fd7e14",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ⚠ {notice}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", minHeight: "28px" }}>
          {actionButton}
          {showExcel && (
            <button
              style={{
                background: "#ffffff",
                color: "#654024",
                border: "1px solid #CFCFCF",
                borderRadius: "4px",
                height: "28px",
                padding: "0 12px",
                fontSize: "12px",
                fontWeight: 400,
                cursor: "pointer",
                fontFamily: "inherit",
                minWidth: 84,
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
          border: "1px solid #dee2e6",
          borderRadius: "8px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            minWidth: "600px",
            background: "#fff",
          }}
        >
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {showCheckbox && (
                <th
                  style={{
                    width: "40px",
                    padding: "0.6rem 0.5rem",
                    borderBottom: "2px solid #dee2e6",
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
                    padding: "0.6rem 0.75rem",
                    borderBottom: "2px solid #dee2e6",
                    textAlign: col.align || "center",
                    fontWeight: 600,
                    color: "#333",
                    whiteSpace: "nowrap",
                    width: col.width,
                    fontSize: "12px",
                    background: "#f8f9fa",
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
                    padding: "2rem",
                    textAlign: "center",
                    color: "#6c757d",
                    fontSize: "12px",
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
                    (e.currentTarget as HTMLTableRowElement).style.background = "#f5f7fa";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = "#fff";
                  }}
                >
                  {showCheckbox && (
                    <td
                      style={{
                        padding: "0.5rem",
                        borderBottom: "1px solid #dee2e6",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <input type="checkbox" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderBottom: "1px solid #dee2e6",
                        textAlign: col.align || "center",
                        color: "#333",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
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
