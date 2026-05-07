"use client";

import React, { useState } from "react";
import { Search, RefreshCw } from "lucide-react";

export interface SearchField {
  label: string;
  type: "text" | "select" | "date" | "daterange";
  name: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface SearchFormProps {
  fields: SearchField[];
  onSearch?: (values: Record<string, string>) => void;
}

export default function SearchForm({ fields, onSearch }: SearchFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(values);
  };

  const handleReset = () => {
    setValues({});
  };

  const inputStyle: React.CSSProperties = {
    padding: "0 9px",
    border: "1px solid #becacf",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: "inherit",
    background: "#fff",
    height: "26px",
    boxSizing: "border-box",
    minWidth: 0,
    outline: "none",
  };

  return (
    <div
      style={{
        background: "#FAF7F2",
        border: "1px solid #E8E8E8",
        borderRadius: "8px",
        padding: "0.75rem 1rem",
        marginBottom: "1rem",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="srm-filter-row">
          {fields.map((field) => (
            <div key={field.name} className="srm-filter-item">
              <label
                style={{
                  fontSize: "12px",
                  color: "#555",
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                  flex: "0 0 auto",
                }}
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={values[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  style={{ ...inputStyle, width: 140 }}
                >
                  <option value="">전체</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "daterange" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="date"
                    value={values[field.name + "_from"] || ""}
                    onChange={(e) => handleChange(field.name + "_from", e.target.value)}
                    style={{ ...inputStyle, width: 130 }}
                  />
                  <span style={{ fontSize: "12px", color: "#888" }}>~</span>
                  <input
                    type="date"
                    value={values[field.name + "_to"] || ""}
                    onChange={(e) => handleChange(field.name + "_to", e.target.value)}
                    style={{ ...inputStyle, width: 130 }}
                  />
                </div>
              ) : (
                <input
                  type={field.type}
                  value={values[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  style={{ ...inputStyle, width: 160 }}
                />
              )}
            </div>
          ))}

          <div className="srm-filter-actions">
            <button
              type="submit"
              style={{
                background: "#654024",
                color: "#fff",
                border: "1px solid #DFE8F0",
                borderRadius: "4px",
                padding: "0 12px",
                height: "28px",
                fontSize: "12px",
                fontWeight: 400,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
                whiteSpace: "nowrap",
                minWidth: 54,
              }}
            >
              <Search size={12} />
              검색
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: "#ffffff",
                color: "#654024",
                border: "1px solid #CFCFCF",
                borderRadius: "4px",
                padding: "0 12px",
                height: "28px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
                whiteSpace: "nowrap",
                minWidth: 54,
              }}
            >
              <RefreshCw size={12} />
              초기화
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
