"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";

export interface StatusGuideItem {
  code: string;
  label?: string;
  meaning: string;
  owner: string;
  actions: string;
  next: string;
  limit: string;
}

export interface StatusGuideSection {
  title: string;
  description?: string;
  items: StatusGuideItem[];
}

interface StatusGuideProps {
  screenName: string;
  sections: StatusGuideSection[];
}

export default function StatusGuide({ screenName, sections }: StatusGuideProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "#fff",
          border: "1px solid #BFDBFE",
          color: "#1D4ED8",
          borderRadius: 999,
          padding: "8px 14px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        상태 가이드
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`${screenName} 상태 가이드`}
        width={880}
        footer={
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "#01ACC8",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            닫기
          </button>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              background: "#F0F9FF",
              border: "1px solid #BAE6FD",
              borderRadius: 10,
              padding: "14px 16px",
              fontSize: 15,
              color: "#075985",
              lineHeight: 1.6,
            }}
          >
            고객사 요구사항 강조포인트: 화면에 보이는 상태명과 실제 가능 액션을 같이 설명해,
            업무 검토 시 상태 해석 오류가 없도록 표현합니다.
          </div>
          {sections.map((section) => (
            <section key={section.title} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{section.title}</div>
                {section.description && (
                  <div style={{ fontSize: 15, color: "#475569", marginTop: 4 }}>{section.description}</div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {section.items.map((item) => (
                  <div
                    key={`${section.title}-${item.code}-${item.label ?? ""}`}
                    style={{
                      background: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <StatusBadge status={item.code} label={item.label} />
                      <span style={{ fontSize: 14, color: "#94A3B8" }}>{item.code}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px", fontSize: 15 }}>
                      <span style={{ color: "#64748B", fontWeight: 700 }}>상태 의미</span>
                      <span style={{ color: "#0F172A" }}>{item.meaning}</span>
                      <span style={{ color: "#64748B", fontWeight: 700 }}>처리 주체</span>
                      <span style={{ color: "#0F172A" }}>{item.owner}</span>
                      <span style={{ color: "#64748B", fontWeight: 700 }}>가능 액션</span>
                      <span style={{ color: "#0F172A" }}>{item.actions}</span>
                      <span style={{ color: "#64748B", fontWeight: 700 }}>다음 단계</span>
                      <span style={{ color: "#0F172A" }}>{item.next}</span>
                      <span style={{ color: "#64748B", fontWeight: 700 }}>제한 사항</span>
                      <span style={{ color: "#0F172A" }}>{item.limit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Modal>
    </>
  );
}
