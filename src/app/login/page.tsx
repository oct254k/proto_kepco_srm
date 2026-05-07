"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";
import { setRole } from "@/lib/role";
import Tabs from "@/components/Tabs";
import Stepper from "@/components/Stepper";

const ROLES: Role[] = ["B", "V", "C", "A"];
const SIGNUP_STEPS = [
  { label: "기본정보" },
  { label: "계정정보" },
  { label: "동의" },
  { label: "신청" },
];

const inputBaseStyle: React.CSSProperties = {
  padding: "0 9px",
  height: 28,
  border: "1px solid #becacf",
  borderRadius: 4,
  fontSize: 12,
  fontFamily: "inherit",
  outline: "none",
  background: "#ffffff",
};

const primaryBtnStyle: React.CSSProperties = {
  height: 32,
  padding: "0 16px",
  background: "#654024",
  color: "#fff",
  border: "1px solid #DFE8F0",
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};

const secondaryBtnStyle: React.CSSProperties = {
  height: 28,
  padding: "0 12px",
  background: "#ffffff",
  color: "#654024",
  border: "1px solid #CFCFCF",
  borderRadius: 4,
  fontSize: 12,
  cursor: "pointer",
  fontFamily: "inherit",
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("B");
  const [showSignup, setShowSignup] = useState(false);
  const [signupStep, setSignupStep] = useState(0);

  function handleLogin() {
    setRole(selectedRole);
    router.push(`/${selectedRole.toLowerCase()}/dashboard/`);
  }

  if (showSignup) {
    return (
      <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#FAF7F2", border: "1px solid #E8E8E8", borderRadius: 12, padding: 32, width: 480, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
              <Image src="/logo.png" alt="KEPCO-ES 로고" width={120} height={32} style={{ objectFit: "contain" }} priority />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginTop: 6 }}>협력업체 신규 가입</div>
          </div>
          <Stepper steps={SIGNUP_STEPS} current={signupStep} />
          <div style={{ minHeight: 140, padding: "16px 0", fontSize: 12, color: "#555", textAlign: "center" }}>
            {signupStep === 0 && <div>이용약관에 동의해주세요.<br /><br /><label><input type="checkbox" /> 이용약관에 동의합니다 (필수)</label></div>}
            {signupStep === 1 && <div>기업정보를 입력해주세요.<br /><br /><input placeholder="사업자등록번호" style={{ ...inputBaseStyle, width: "100%" }} /></div>}
            {signupStep === 2 && <div>담당자 정보를 입력해주세요.<br /><br /><input placeholder="담당자명" style={{ ...inputBaseStyle, width: "100%" }} /></div>}
            {signupStep === 3 && <div style={{ color: "#00a7ea", fontWeight: 700, fontSize: 15 }}>🎉 가입이 완료되었습니다!<br /><br />관리자 승인 후 로그인 가능합니다.</div>}
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 16 }}>
            {signupStep > 0 && signupStep < 3 && <button onClick={() => setSignupStep((s) => s - 1)} style={secondaryBtnStyle}>이전</button>}
            {signupStep < 3 && <button onClick={() => setSignupStep((s) => s + 1)} style={{ ...primaryBtnStyle, height: 28, fontWeight: 400 }}>{signupStep === 2 ? "가입 신청" : "다음"}</button>}
            {signupStep === 3 && <button onClick={() => { setShowSignup(false); setSignupStep(0); }} style={{ ...primaryBtnStyle, height: 28, fontWeight: 400 }}>로그인으로</button>}
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => setShowSignup(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6c757d", fontSize: 12 }}>← 로그인으로 돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#FAF7F2", border: "1px solid #E8E8E8", borderRadius: 12, padding: 32, width: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Image src="/logo.png" alt="KEPCO-ES 로고" width={130} height={36} style={{ objectFit: "contain" }} priority />
          </div>
          <div style={{ fontSize: 12, color: "#6c757d" }}>구매시스템</div>
        </div>

        <Tabs
          tabs={[
            { id: "login", label: "로그인" },
            { id: "find-id", label: "아이디 찾기" },
            { id: "reset-pw", label: "비밀번호 초기화" },
          ]}
        >
          {(tab) => (
            <>
              {tab === "login" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input placeholder="이메일 (아이디)" style={{ ...inputBaseStyle, height: 32 }} />
                  <input type="password" placeholder="비밀번호" style={{ ...inputBaseStyle, height: 32 }} />

                  <div>
                    <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>역할 선택 (시연용)</div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {ROLES.map((r) => (
                        <label key={r} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 12 }}>
                          <input type="radio" name="role" value={r} checked={selectedRole === r} onChange={() => setSelectedRole(r)} />
                          {ROLE_LABELS[r]}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleLogin}
                    style={primaryBtnStyle}
                  >
                    로그인
                  </button>

                  {selectedRole === "V" && (
                    <div style={{ textAlign: "center" }}>
                      <button onClick={() => setShowSignup(true)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#00a7ea", fontSize: 12, textDecoration: "underline" }}>
                        신규 협력업체 가입 신청
                      </button>
                    </div>
                  )}
                </div>
              )}
              {tab === "find-id" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontSize: 12, color: "#555" }}>가입 시 등록한 이메일로 아이디를 찾을 수 있습니다.</p>
                  <input placeholder="등록 이메일" style={{ ...inputBaseStyle, height: 32 }} />
                  <button style={primaryBtnStyle}>아이디 찾기</button>
                </div>
              )}
              {tab === "reset-pw" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontSize: 12, color: "#555" }}>등록된 이메일로 비밀번호 재설정 링크가 발송됩니다.</p>
                  <input placeholder="이메일 (아이디)" style={{ ...inputBaseStyle, height: 32 }} />
                  <button style={primaryBtnStyle}>재설정 링크 발송</button>
                </div>
              )}
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
