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
        const circleBorder = done ? "#198754" : active ? "#00a7ea" : "#dee2e6";
        const circleBg = done ? "#198754" : active ? "#e6f6fd" : "#fff";
        const circleColor = done ? "#fff" : active ? "#00a7ea" : "#aaa";
        const labelColor = done ? "#198754" : active ? "#00a7ea" : "#aaa";
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `2px solid ${circleBorder}`,
                  background: circleBg,
                  color: circleColor,
                  fontSize: 11, fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, marginTop: 6, color: labelColor, fontWeight: active ? 700 : 400, textAlign: "center", whiteSpace: "nowrap" }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? "#198754" : "#dee2e6", margin: "0 0.5rem", marginBottom: 22 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
