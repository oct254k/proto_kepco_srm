import React from "react";

interface Step { label: string; }
interface StepperProps {
  steps: Step[];
  current: number; // 0-based
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? "#01ACC8" : active ? "#01ACC8" : "#e0e0e0",
                  color: done || active ? "#fff" : "#888",
                  fontSize: 16, fontWeight: 700,
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 15, marginTop: 6, color: active ? "#01ACC8" : done ? "#01ACC8" : "#888", fontWeight: active ? 700 : 400, textAlign: "center" }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? "#01ACC8" : "#e0e0e0", margin: "0 4px", marginBottom: 24 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
