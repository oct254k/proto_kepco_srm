"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";
import { setRole } from "@/lib/role";
import Tabs from "@/components/Tabs";
import Stepper from "@/components/Stepper";

const ROLES: Role[] = ["B", "V", "C", "A"];
const SIGNUP_STEPS = [
  { label: "이용약관 동의" },
  { label: "기업정보 입력" },
  { label: "담당자 정보" },
  { label: "가입 완료" },
];

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
      <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 40, width: 520, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 23, fontWeight: 700, color: "#01ACC8" }}>🔷 SRM 켑코이에스 전자입찰시스템</div>
            <div style={{ fontSize: 19, fontWeight: 600, color: "#222", marginTop: 8 }}>협력업체 신규 가입</div>
          </div>
          <Stepper steps={SIGNUP_STEPS} current={signupStep} />
          <div style={{ minHeight: 160, padding: "20px 0", fontSize: 17, color: "#555", textAlign: "center" }}>
            {signupStep === 0 && <div>이용약관에 동의해주세요.<br /><br /><label><input type="checkbox" /> 이용약관에 동의합니다 (필수)</label></div>}
            {signupStep === 1 && <div>기업정보를 입력해주세요.<br /><br /><input placeholder="사업자등록번호" style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 17 }} /></div>}
            {signupStep === 2 && <div>담당자 정보를 입력해주세요.<br /><br /><input placeholder="담당자명" style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 17 }} /></div>}
            {signupStep === 3 && <div style={{ color: "#01ACC8", fontWeight: 700, fontSize: 21 }}>🎉 가입이 완료되었습니다!<br /><br />관리자 승인 후 로그인 가능합니다.</div>}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
            {signupStep > 0 && signupStep < 3 && <button onClick={() => setSignupStep((s) => s - 1)} style={{ padding: "8px 20px", border: "1px solid #ddd", borderRadius: 4, background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>이전</button>}
            {signupStep < 3 && <button onClick={() => setSignupStep((s) => s + 1)} style={{ padding: "8px 20px", background: "#01ACC8", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}>{signupStep === 2 ? "가입 신청" : "다음"}</button>}
            {signupStep === 3 && <button onClick={() => { setShowSignup(false); setSignupStep(0); }} style={{ padding: "8px 20px", background: "#01ACC8", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}>로그인으로</button>}
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => setShowSignup(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#888", fontSize: 16 }}>← 로그인으로 돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 40, width: 440, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 25, fontWeight: 700, color: "#01ACC8" }}>🔷 SRM</div>
          <div style={{ fontSize: 17, color: "#555", marginTop: 4 }}>켑코이에스 전자입찰시스템</div>
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
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input placeholder="이메일 (아이디)" style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 17, fontFamily: "inherit" }} />
                  <input type="password" placeholder="비밀번호" style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 17, fontFamily: "inherit" }} />

                  <div>
                    <div style={{ fontSize: 15, color: "#555", marginBottom: 6 }}>역할 선택 (시연용)</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {ROLES.map((r) => (
                        <label key={r} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 16 }}>
                          <input type="radio" name="role" value={r} checked={selectedRole === r} onChange={() => setSelectedRole(r)} />
                          {ROLE_LABELS[r]}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleLogin}
                    style={{ padding: "11px", background: "#01ACC8", color: "#fff", border: "none", borderRadius: 6, fontSize: 18, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    로그인
                  </button>

                  {selectedRole === "V" && (
                    <div style={{ textAlign: "center" }}>
                      <button onClick={() => setShowSignup(true)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#01ACC8", fontSize: 16, textDecoration: "underline" }}>
                        신규 협력업체 가입 신청
                      </button>
                    </div>
                  )}
                </div>
              )}
              {tab === "find-id" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontSize: 16, color: "#555" }}>가입 시 등록한 이메일로 아이디를 찾을 수 있습니다.</p>
                  <input placeholder="등록 이메일" style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 17, fontFamily: "inherit" }} />
                  <button style={{ padding: "10px", background: "#01ACC8", color: "#fff", border: "none", borderRadius: 6, fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>아이디 찾기</button>
                </div>
              )}
              {tab === "reset-pw" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontSize: 16, color: "#555" }}>등록된 이메일로 비밀번호 재설정 링크가 발송됩니다.</p>
                  <input placeholder="이메일 (아이디)" style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 17, fontFamily: "inherit" }} />
                  <button style={{ padding: "10px", background: "#01ACC8", color: "#fff", border: "none", borderRadius: 6, fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>재설정 링크 발송</button>
                </div>
              )}
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
