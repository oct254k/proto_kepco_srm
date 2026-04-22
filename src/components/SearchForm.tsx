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
    flex: 1,
    padding: "5px 8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "13px",
    fontFamily: "inherit",
    background: "#fff",
    height: "30px",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        padding: "16px 24px",
        marginBottom: "16px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row items-start gap-4">
          {/* Fields Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px_20px]">
            {fields.map((field) => (
              <div
                key={field.name}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label
                  className="min-w-[80px] lg:min-w-[90px]"
                  style={{
                    fontSize: "13px",
                    color: "#555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    value={values[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">전체</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "daterange" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                    <input
                      type="date"
                      value={values[field.name + "_from"] || ""}
                      onChange={(e) => handleChange(field.name + "_from", e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <span style={{ fontSize: "12px", color: "#888" }}>~</span>
                    <input
                      type="date"
                      value={values[field.name + "_to"] || ""}
                      onChange={(e) => handleChange(field.name + "_to", e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={values[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    style={inputStyle}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-row lg:flex-col gap-[6px] flex-shrink-0 w-full lg:w-auto justify-end">
            <button
              type="submit"
              style={{
                background: "#01ACC8",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "0 16px",
                height: "30px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                whiteSpace: "nowrap",
              }}
            >
              <Search size={14} />
              검색
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: "#fff",
                color: "#01ACC8",
                border: "1px solid #01ACC8",
                borderRadius: "4px",
                padding: "0 16px",
                height: "30px",
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                whiteSpace: "nowrap",
              }}
            >
              <RefreshCw size={13} />
              초기화
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
