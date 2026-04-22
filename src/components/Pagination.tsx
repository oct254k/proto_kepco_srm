"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
    background: "#fff",
    color: "#444",
    fontFamily: "inherit",
  };

  const activeStyle: React.CSSProperties = {
    ...btnBase,
    background: "#01ACC8",
    color: "#fff",
    border: "1px solid #01ACC8",
    fontWeight: 600,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        marginTop: "16px",
      }}
    >
      <button
        style={btnBase}
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {pages.map((p) => (
        <button
          key={p}
          style={p === currentPage ? activeStyle : btnBase}
          onClick={() => onPageChange?.(p)}
        >
          {p}
        </button>
      ))}
      <button
        style={btnBase}
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
}
