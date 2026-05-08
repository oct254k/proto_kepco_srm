"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export interface SearchField {
  label: string;
  type: "text" | "select" | "date" | "daterange";
  name: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
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

  const inputBaseStyle: React.CSSProperties = {
    width: "100%",
    height: 36,
    padding: "0 12px",
    border: "1px solid #becacf",
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "inherit",
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
    color: "#1a1a1a",
  };

  return (
    <div
      style={{
        background: "#FAF7F2",
        border: "1px solid #E8E8E8",
        borderRadius: 8,
        padding: "20px 24px",
        marginBottom: 16,
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, width: "100%", flexWrap: "wrap" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px 20px", flex: "1 1 auto", minWidth: 0 }}>
            {fields.map((field) => (
              <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                <label
                  style={{
                    fontSize: 12,
                    color: "#555",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {field.label}
                  {field.required && (
                    <span style={{ color: "#ff0b3a", marginLeft: 2 }}>*</span>
                  )}
                </label>

                {field.type === "select" ? (
                  <div style={{ position: "relative" }}>
                    <select
                      value={values[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      style={{
                        ...inputBaseStyle,
                        appearance: "none",
                        WebkitAppearance: "none",
                        paddingRight: 32,
                        cursor: "pointer",
                      }}
                    >
                      <option value="">전체</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      color="#6c757d"
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                ) : field.type === "daterange" ? (
                  (() => {
                    const fmt = (s: string) => (s ? s.replaceAll("-", ".") : "");
                    const from = values[field.name + "_from"] || "";
                    const to = values[field.name + "_to"] || "";
                    const display = from || to ? `${fmt(from)}~${fmt(to)}` : "";
                    return (
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          readOnly
                          value={display}
                          placeholder="기간 선택"
                          style={{ ...inputBaseStyle, paddingRight: 32, cursor: "pointer" }}
                        />
                        <Calendar
                          size={14}
                          color="#6c757d"
                          style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    );
                  })()
                ) : field.type === "date" ? (
                  <div style={{ position: "relative" }}>
                    <input
                      type="date"
                      value={values[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      style={{ ...inputBaseStyle, paddingRight: 32 }}
                    />
                    <Calendar
                      size={14}
                      color="#6c757d"
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={values[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    style={inputBaseStyle}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "row", gap: 8, flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: "#ffffff",
                color: "#654024",
                border: "1px solid #CFCFCF",
                borderRadius: 6,
                padding: "0 18px",
                height: 36,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              초기화
            </button>
            <button
              type="submit"
              style={{
                background: "#654024",
                color: "#fff",
                border: "1px solid #DFE8F0",
                borderRadius: 6,
                padding: "0 22px",
                height: 36,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              검색
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
