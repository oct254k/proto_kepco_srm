"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import SearchForm from "@/components/SearchForm";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import Tabs from "@/components/Tabs";
import { useToast } from "@/components/Toast";
import { MOCK_VENDORS, PENDING_VENDORS } from "@/lib/mock/admin_users";
import type { Vendor } from "@/lib/types";

// ── 공통 버튼 ──────────────────────────────────────────────────────
function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "danger" | "success" | "warning";
  disabled?: boolean;
  small?: boolean;
}) {
  const base: React.CSSProperties = {
    borderRadius: 4,
    padding: small ? "4px 10px" : "6px 16px",
    fontSize: small ? 12 : 13,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    opacity: disabled ? 0.5 : 1,
    border: "1px solid transparent",
    whiteSpace: "nowrap" as const,
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "#654024", color: "#fff", borderColor: "#654024" },
    outline: { background: "#fff", color: "#00a7ea", borderColor: "#654024" },
    danger: { background: "#fff", color: "#DC2626", borderColor: "#DC2626" },
    success: { background: "#059669", color: "#fff", borderColor: "#059669" },
    warning: { background: "#D97706", color: "#fff", borderColor: "#D97706" },
  };
  return (
    <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ── 상세 행 ──────────────────────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        gap: 8,
        padding: "8px 0",
        borderBottom: "1px solid #f0f0f0",
        alignItems: "start",
      }}
    >
      <span style={{ fontSize: 15, color: "#888", fontWeight: 500, paddingTop: 2 }}>{label}</span>
      <span style={{ fontSize: 17, color: "#222" }}>{value}</span>
    </div>
  );
}

// ── 승인 탭 Drawer ──────────────────────────────────────────────────
function PendingVendorDrawer({
  vendor,
  open,
  onClose,
  onApprove,
  onReject,
}: {
  vendor: Vendor | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [niceLoading, setNiceLoading] = useState(false);
  const [niceResult, setNiceResult] = useState<{ grade: string; score: string } | null>(null);

  const handleNice = () => {
    setNiceLoading(true);
    setTimeout(() => {
      setNiceLoading(false);
      setNiceResult({ grade: "BB+", score: "680" });
    }, 1500);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      setRejectError("반려 사유를 입력해주세요.");
      return;
    }
    setRejectError("");
    setRejectModalOpen(false);
    setRejectReason("");
    if (vendor) onReject(vendor.id, rejectReason);
  };

  const handleRejectClose = () => {
    setRejectModalOpen(false);
    setRejectReason("");
    setRejectError("");
  };

  if (!vendor) return null;

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title={`${vendor.name} — 신청 상세`}
        width={700}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
            padding: "10px 14px",
            background: "#FEF3C7",
            borderRadius: 6,
            border: "1px solid #FDE68A",
          }}
        >
          <span style={{ fontSize: 16, color: "#92400E" }}>
            승인 상태:
          </span>
          <StatusBadge status="PENDING" />
          <span style={{ fontSize: 15, color: "#92400E", marginLeft: "auto" }}>
            신청일: {vendor.joinedAt}
          </span>
        </div>

        <Tabs
          tabs={[
            { id: "info", label: "기업정보" },
            { id: "account", label: "계정관리" },
            { id: "nice", label: "NICE 신용평가" },
          ]}
        >
          {(tab) => (
            <>
              {tab === "info" && (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0 20px",
                      marginBottom: 20,
                    }}
                  >
                    <DetailRow label="업체명" value={vendor.name} />
                    <DetailRow label="사업자번호" value={vendor.bizNo} />
                    <DetailRow label="업종" value={vendor.category} />
                    <DetailRow label="대표자명" value={vendor.contactName} />
                    <DetailRow
                      label="주계정 이메일"
                      value={<span style={{ fontSize: 16 }}>{vendor.contactEmail}</span>}
                    />
                    <DetailRow label="신청일" value={vendor.joinedAt} />
                    <DetailRow
                      label="사업자등록증"
                      value={
                        <span style={{ fontSize: 16, color: "#00a7ea", cursor: "pointer" }}>
                          📎 사업자등록증.pdf [다운로드]
                        </span>
                      }
                    />
                  </div>

                  {/* 승인/반려 처리 */}
                  <div
                    style={{
                      borderTop: "1px solid #e0e0e0",
                      paddingTop: 16,
                      marginTop: 8,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#444",
                        marginBottom: 12,
                      }}
                    >
                      승인/반려 처리
                    </p>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <Btn variant="outline" onClick={handleNice}>
                        {niceLoading ? "조회 중..." : "NICE 신용평가 조회 (선택)"}
                      </Btn>
                    </div>
                    {niceResult && (
                      <div
                        style={{
                          background: "#F0FFF4",
                          border: "1px solid #A7F3D0",
                          borderRadius: 6,
                          padding: "10px 14px",
                          marginBottom: 12,
                          fontSize: 16,
                          color: "#065F46",
                        }}
                      >
                        신용등급: <strong>{niceResult.grade}</strong> / 신용점수:{" "}
                        <strong>{niceResult.score}</strong>점 (NICE 평가 기준)
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 10 }}>
                      <Btn variant="danger" onClick={() => setRejectModalOpen(true)}>
                        반려 처리
                      </Btn>
                      <Btn variant="success" onClick={() => setApproveConfirmOpen(true)}>
                        승인 처리
                      </Btn>
                    </div>
                  </div>
                </div>
              )}

              {tab === "account" && (
                <div>
                  <p
                    style={{
                      fontSize: 16,
                      color: "#888",
                      marginBottom: 12,
                      background: "#FEF3C7",
                      border: "1px solid #FDE68A",
                      borderRadius: 6,
                      padding: "8px 12px",
                    }}
                  >
                    ⚠️ 승인 완료 후 계정이 활성화됩니다.
                  </p>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        {["계정ID", "이름", "이메일", "직책", "주계정", "액션"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "7px 10px",
                              border: "1px solid #e0e0e0",
                              textAlign: "center",
                              fontWeight: 600,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", fontSize: 15 }}>
                          {vendor.bizNo.replace(/-/g, "")}_01
                        </td>
                        <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0" }}>
                          {vendor.contactName} 🔒
                        </td>
                        <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", fontSize: 15 }}>
                          {vendor.contactEmail}
                        </td>
                        <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          대표담당자
                        </td>
                        <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          Y
                        </td>
                        <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          <span style={{ fontSize: 15, color: "#888" }}>이메일변경</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {tab === "nice" && (
                <div>
                  {niceResult ? (
                    <div>
                      <div
                        style={{
                          background: "#F0FFF4",
                          border: "1px solid #A7F3D0",
                          borderRadius: 6,
                          padding: "12px 16px",
                          marginBottom: 16,
                        }}
                      >
                        <p style={{ fontSize: 16, fontWeight: 600, color: "#065F46", marginBottom: 8 }}>
                          NICE 신용평가 결과 (참조용 — SRM 미저장)
                        </p>
                        <DetailRow label="업체명" value={vendor.name} />
                        <DetailRow label="사업자번호" value={vendor.bizNo} />
                        <DetailRow label="신용등급" value={<strong>{niceResult.grade}</strong>} />
                        <DetailRow label="신용점수" value={`${niceResult.score}점`} />
                        <DetailRow label="조회일시" value="2026-04-22 14:30:00" />
                      </div>
                      <p style={{ fontSize: 15, color: "#888" }}>
                        ※ 조회 결과는 SRM DB에 저장되지 않으며, 조회 이력만 감사 로그에 기록됩니다.
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        color: "#888",
                        fontSize: 16,
                      }}
                    >
                      <p style={{ marginBottom: 12 }}>NICE 신용평가 결과가 없습니다.</p>
                      <Btn variant="outline" onClick={handleNice}>
                        {niceLoading ? "조회 중..." : "NICE 신용평가 조회"}
                      </Btn>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </Tabs>
      </Drawer>

      {/* 승인 확인 Modal */}
      <Modal
        open={approveConfirmOpen}
        onClose={() => setApproveConfirmOpen(false)}
        title="협력업체 승인 처리"
        width={440}
        footer={
          <>
            <Btn variant="outline" onClick={() => setApproveConfirmOpen(false)}>
              취소
            </Btn>
            <Btn
              variant="success"
              onClick={() => {
                setApproveConfirmOpen(false);
                onApprove(vendor.id);
              }}
            >
              승인 처리
            </Btn>
          </>
        }
      >
        <div style={{ fontSize: 17, color: "#444", lineHeight: 1.7 }}>
          <p>
            <strong>{vendor.name}</strong>을(를) 협력업체로 승인 처리하시겠습니까?
          </p>
          <p style={{ fontSize: 16, color: "#888", marginTop: 8 }}>
            승인 시 협력업체에 승인 완료 이메일이 자동 발송되며, 계정이 활성화됩니다.
          </p>
        </div>
      </Modal>

      {/* 반려 사유 Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={handleRejectClose}
        title="반려 사유 입력"
        width={480}
        footer={
          <>
            <Btn variant="outline" onClick={handleRejectClose}>
              취소
            </Btn>
            <Btn
              variant="danger"
              disabled={!rejectReason.trim()}
              onClick={handleRejectSubmit}
            >
              반려 처리
            </Btn>
          </>
        }
      >
        <div>
          <p style={{ fontSize: 16, color: "#555", marginBottom: 8 }}>
            반려 사유 (필수, 최대 500자)
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => {
              setRejectReason(e.target.value.slice(0, 500));
              if (e.target.value.trim()) setRejectError("");
            }}
            placeholder="반려 사유를 입력하세요."
            rows={5}
            style={{
              width: "100%",
              padding: "8px 10px",
              border: `1px solid ${rejectError ? "#DC2626" : "#ccc"}`,
              borderRadius: 4,
              fontSize: 16,
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {rejectError ? (
              <span style={{ fontSize: 15, color: "#DC2626" }}>{rejectError}</span>
            ) : (
              <span />
            )}
            <span style={{ fontSize: 15, color: "#888" }}>{rejectReason.length}/500</span>
          </div>
        </div>
      </Modal>
    </>
  );
}

// ── 업체목록 탭 Drawer ──────────────────────────────────────────────
function VendorListDrawer({
  vendor,
  open,
  onClose,
  onToggleStatus,
}: {
  vendor: Vendor | null;
  open: boolean;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
}) {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [pwResetModalOpen, setPwResetModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailChangeReason, setEmailChangeReason] = useState("");
  const [niceLoading, setNiceLoading] = useState(false);
  const [niceResult, setNiceResult] = useState<{ grade: string; score: string } | null>(null);
  const { show } = useToast();

  if (!vendor) return null;

  const handleNice = () => {
    setNiceLoading(true);
    setTimeout(() => {
      setNiceResult({ grade: "BBB", score: "720" });
      setNiceLoading(false);
      show("NICE 신용평가 조회가 완료되었습니다.", "info");
    }, 4000);
  };

  const handlePwReset = () => {
    setPwResetModalOpen(false);
    setTimeout(() => {
      show("임시 비밀번호가 발급되었습니다.", "info");
    }, 4000);
  };

  const handleEmailChange = () => {
    setEmailModalOpen(false);
    setNewEmail("");
    setEmailChangeReason("");
    show("이메일이 변경되었습니다.", "success");
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title={`${vendor.name} — 업체 상세`}
        width={700}
      >
        <Tabs
          tabs={[
            { id: "info", label: "기업정보" },
            { id: "account", label: "계정관리" },
            { id: "nice", label: "NICE 신용평가" },
          ]}
        >
          {(tab) => (
            <>
              {tab === "info" && (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0 20px",
                      marginBottom: 20,
                    }}
                  >
                    <DetailRow label="업체명" value={vendor.name} />
                    <DetailRow label="사업자번호" value={vendor.bizNo} />
                    <DetailRow label="업종" value={vendor.category} />
                    <DetailRow label="담당자명" value={vendor.contactName} />
                    <DetailRow
                      label="담당자 이메일"
                      value={<span style={{ fontSize: 16 }}>{vendor.contactEmail}</span>}
                    />
                    <DetailRow label="가입일" value={vendor.joinedAt} />
                    <DetailRow
                      label="계정 상태"
                      value={<StatusBadge status={vendor.status} />}
                    />
                  </div>

                  <div
                    style={{
                      background: "#f9f9f9",
                      border: "1px solid #e0e0e0",
                      borderRadius: 6,
                      padding: 16,
                      marginBottom: 20,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#444",
                        marginBottom: 12,
                      }}
                    >
                      거래실적 요약
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                      {[
                        { label: "참여 공고", value: "18건" },
                        { label: "낙찰 건수", value: "9건" },
                        { label: "계약 체결", value: "7건" },
                        { label: "완료 계약", value: "5건" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          style={{
                            background: "#FAF7F2",
                            border: "1px solid #e0e0e0",
                            borderRadius: 6,
                            padding: "10px",
                            textAlign: "center",
                          }}
                        >
                          <p style={{ fontSize: 14, color: "#888", marginBottom: 3 }}>{s.label}</p>
                          <p style={{ fontSize: 21, fontWeight: 700, color: "#00a7ea" }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    {vendor.status === "ACTIVE" ? (
                      <Btn variant="danger" onClick={() => onToggleStatus(vendor.id)}>
                        계정 정지
                      </Btn>
                    ) : (
                      <Btn variant="outline" onClick={() => onToggleStatus(vendor.id)}>
                        계정 복원
                      </Btn>
                    )}
                  </div>
                </div>
              )}

              {tab === "account" && (
                <div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        {["계정ID", "이름", "이메일", "직책", "주계정", "액션"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "7px 10px",
                              border: "1px solid #e0e0e0",
                              textAlign: "center",
                              fontWeight: 600,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0", fontSize: 14 }}>
                          {vendor.bizNo.replace(/-/g, "")}_01
                        </td>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0" }}>
                          {vendor.contactName} 🔒
                        </td>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0", fontSize: 15 }}>
                          {vendor.contactEmail}
                        </td>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          팀장
                        </td>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          Y
                        </td>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          <Btn small variant="outline" onClick={() => setEmailModalOpen(true)}>
                            이메일변경
                          </Btn>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0", fontSize: 14 }}>
                          {vendor.bizNo.replace(/-/g, "")}_02
                        </td>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0" }}>
                          서브담당자
                        </td>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0", fontSize: 15 }}>
                          sub@example.com
                        </td>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          대리
                        </td>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          N
                        </td>
                        <td style={{ padding: "7px 8px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                            <Btn small variant="warning" onClick={() => setPwResetModalOpen(true)}>
                              PW초기화
                            </Btn>
                            <Btn small variant="danger">
                              삭제
                            </Btn>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {tab === "nice" && (
                <div>
                  {niceResult ? (
                    <div>
                      <div
                        style={{
                          background: "#F0FFF4",
                          border: "1px solid #A7F3D0",
                          borderRadius: 6,
                          padding: "12px 16px",
                          marginBottom: 16,
                        }}
                      >
                        <p style={{ fontSize: 16, fontWeight: 600, color: "#065F46", marginBottom: 8 }}>
                          NICE 신용평가 결과 (참조용 — SRM 미저장)
                        </p>
                        <DetailRow label="업체명" value={vendor.name} />
                        <DetailRow label="사업자번호" value={vendor.bizNo} />
                        <DetailRow label="신용등급" value={<strong>{niceResult.grade}</strong>} />
                        <DetailRow label="신용점수" value={`${niceResult.score}점`} />
                        <DetailRow label="조회일시" value="2026-04-22 14:30:00" />
                      </div>
                      <p style={{ fontSize: 15, color: "#888" }}>
                        ※ 조회 결과는 SRM DB에 저장되지 않으며, 조회 이력만 감사 로그에 기록됩니다.
                      </p>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#888", fontSize: 16 }}>
                      <p style={{ marginBottom: 12 }}>NICE 신용평가 결과가 없습니다.</p>
                      <Btn variant="outline" onClick={handleNice}>
                        {niceLoading ? "조회 중..." : "NICE 신용평가 조회"}
                      </Btn>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </Tabs>
      </Drawer>

      {/* 이메일 변경 Modal */}
      <Modal
        open={emailModalOpen}
        onClose={() => { setEmailModalOpen(false); setNewEmail(""); setEmailChangeReason(""); }}
        title="이메일 변경"
        width={480}
        footer={
          <>
            <Btn variant="outline" onClick={() => { setEmailModalOpen(false); setNewEmail(""); setEmailChangeReason(""); }}>
              취소
            </Btn>
            <Btn
              disabled={!newEmail.trim() || !emailChangeReason.trim()}
              onClick={handleEmailChange}
            >
              변경
            </Btn>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 16, fontWeight: 500, color: "#555", display: "block", marginBottom: 4 }}>
              신규 이메일 *
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="신규 이메일 주소 입력"
              style={{
                width: "100%",
                padding: "7px 10px",
                border: "1px solid #ccc",
                borderRadius: 4,
                fontSize: 16,
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 16, fontWeight: 500, color: "#555", display: "block", marginBottom: 4 }}>
              변경 사유 *
            </label>
            <textarea
              value={emailChangeReason}
              onChange={(e) => setEmailChangeReason(e.target.value.slice(0, 500))}
              placeholder="변경 사유 입력 (최대 500자)"
              rows={3}
              style={{
                width: "100%",
                padding: "7px 10px",
                border: "1px solid #ccc",
                borderRadius: 4,
                fontSize: 16,
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </Modal>

      {/* PW 초기화 확인 Modal */}
      <Modal
        open={pwResetModalOpen}
        onClose={() => setPwResetModalOpen(false)}
        title="임시 비밀번호 발급"
        width={440}
        footer={
          <>
            <Btn variant="outline" onClick={() => setPwResetModalOpen(false)}>
              취소
            </Btn>
            <Btn onClick={handlePwReset}>발급 확인</Btn>
          </>
        }
      >
        <div style={{ fontSize: 17, color: "#444", lineHeight: 1.7 }}>
          <p>해당 계정의 임시 비밀번호를 발급하시겠습니까?</p>
          <p style={{ fontSize: 16, color: "#888", marginTop: 8 }}>
            임시 비밀번호가 계정 이메일로 발송되며, 초기 로그인 후 비밀번호 변경이 강제됩니다.
          </p>
        </div>
      </Modal>
    </>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────────────
export default function AdminVendorsPage() {
  const { show } = useToast();

  // 승인 관리 탭 상태
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>(PENDING_VENDORS);
  const [selectedPending, setSelectedPending] = useState<Vendor | null>(null);
  const [pendingDrawerOpen, setPendingDrawerOpen] = useState(false);

  // 업체 목록 탭 상태
  const [allVendors, setAllVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorListDrawerOpen, setVendorListDrawerOpen] = useState(false);

  // 승인 처리
  const handleApprove = (id: string) => {
    const vendor = pendingVendors.find((v) => v.id === id);
    setPendingVendors((prev) => prev.filter((v) => v.id !== id));
    if (vendor) {
      setAllVendors((prev) => [...prev, { ...vendor, status: "ACTIVE" }]);
    }
    setPendingDrawerOpen(false);
    setTimeout(() => {
      const name = vendor?.name ?? "";
      show(
        `${name} 협력업체 승인이 완료되었습니다. 협력업체에 승인 이메일이 발송되었습니다.`,
        "info"
      );
    }, 4000);
  };

  // 반려 처리
  const handleReject = (id: string, _reason: string) => {
    const vendor = pendingVendors.find((v) => v.id === id);
    setPendingVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "REJECTED" } : v))
    );
    setPendingDrawerOpen(false);
    setTimeout(() => {
      const name = vendor?.name ?? "";
      show(`${name} 반려 처리되었습니다. 협력업체에 반려 사유가 발송되었습니다.`, "error");
    }, 4000);
  };

  // 계정 정지/복원
  const handleToggleStatus = (id: string) => {
    setAllVendors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: v.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
          : v
      )
    );
    setVendorListDrawerOpen(false);
    show("계정 상태가 변경되었습니다.", "success");
  };

  // ── 컬럼 정의 ──
  const pendingColumns: Column[] = [
    { key: "joinedAt", label: "신청일", width: "100px", align: "center" },
    { key: "name", label: "업체명", align: "left" },
    { key: "bizNo", label: "사업자번호", width: "130px", align: "center" },
    { key: "contactName", label: "담당자", width: "80px", align: "center" },
    { key: "category", label: "업종", width: "110px", align: "center" },
    {
      key: "status",
      label: "상태",
      width: "90px",
      align: "center",
      render: (val) => <StatusBadge status={String(val)} />,
    },
    {
      key: "id",
      label: "액션",
      width: "160px",
      align: "center",
      render: (_val, row) => (
        <div
          style={{ display: "flex", gap: 6, justifyContent: "center" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Btn
            small
            variant="danger"
            onClick={() => {
              const vendor = pendingVendors.find((v) => v.id === String(row.id));
              if (vendor) {
                setSelectedPending(vendor);
                setPendingDrawerOpen(true);
              }
            }}
          >
            반려
          </Btn>
          <Btn
            small
            variant="success"
            onClick={() => {
              handleApprove(String(row.id));
            }}
          >
            승인
          </Btn>
        </div>
      ),
    },
  ];

  const allVendorColumns: Column[] = [
    { key: "id", label: "업체 ID", width: "80px", align: "center" },
    { key: "name", label: "업체명", align: "left" },
    { key: "bizNo", label: "사업자번호", width: "130px", align: "center" },
    { key: "category", label: "업종", width: "110px", align: "center" },
    { key: "contactName", label: "담당자", width: "80px", align: "center" },
    {
      key: "status",
      label: "상태",
      width: "90px",
      align: "center",
      render: (val) => <StatusBadge status={String(val)} />,
    },
    { key: "joinedAt", label: "가입일", width: "100px", align: "center" },
  ];

  const activePendingCount = pendingVendors.filter((v) => v.status === "PENDING").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader title="협력업체 승인 관리 (SCR-S-16)" />

      <Tabs
        tabs={[
          {
            id: "approval",
            label: `승인 관리${activePendingCount > 0 ? ` (●${activePendingCount})` : ""}`,
          },
          { id: "list", label: "업체 목록" },
        ]}
      >
        {(tab) => (
          <>
            {/* ── Tab 1: 승인 관리 ── */}
            {tab === "approval" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* 승인 대기 강조 카드 */}
                {activePendingCount > 0 && (
                  <div
                    style={{
                      background: "#FFF7ED",
                      border: "2px solid #F97316",
                      borderRadius: 8,
                      padding: "14px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        background: "#F97316",
                        color: "#fff",
                        borderRadius: 999,
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 23,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {activePendingCount}
                    </div>
                    <div>
                      <p style={{ fontSize: 18, fontWeight: 700, color: "#92400E" }}>
                        승인 대기 {activePendingCount}건
                      </p>
                      <p style={{ fontSize: 16, color: "#B45309" }}>
                        처리가 필요한 협력업체 등록 신청이 있습니다.
                      </p>
                    </div>
                  </div>
                )}

                <SearchForm
                  fields={[
                    { label: "업체명", name: "name", type: "text", placeholder: "업체명 검색" },
                    {
                      label: "사업자번호",
                      name: "bizNo",
                      type: "text",
                      placeholder: "사업자번호",
                    },
                    {
                      label: "상태",
                      name: "status",
                      type: "select",
                      options: [
                        { label: "승인대기", value: "PENDING" },
                        { label: "승인완료", value: "APPROVED" },
                        { label: "반려", value: "REJECTED" },
                      ],
                    },
                    { label: "신청일", name: "appliedAt", type: "daterange" },
                  ]}
                />

                {pendingVendors.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      background: "#FAF7F2",
                      border: "1px solid #e0e0e0",
                      borderRadius: 6,
                      color: "#888",
                      fontSize: 17,
                    }}
                  >
                    처리할 신청이 없습니다.
                  </div>
                ) : (
                  <DataTable
                    columns={pendingColumns}
                    data={pendingVendors as unknown as Record<string, unknown>[]}
                    sectionLabel={`신청 목록 (승인대기 ${activePendingCount}건 / 전체 ${pendingVendors.length}건)`}
                    showExcel={false}
                    onRowClick={(row) => {
                      const vendor = pendingVendors.find((v) => v.id === String(row.id));
                      if (vendor) {
                        setSelectedPending(vendor);
                        setPendingDrawerOpen(true);
                      }
                    }}
                  />
                )}
              </div>
            )}

            {/* ── Tab 2: 업체 목록 ── */}
            {tab === "list" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <SearchForm
                  fields={[
                    { label: "업체명", name: "name", type: "text", placeholder: "업체명 검색" },
                    {
                      label: "사업자번호",
                      name: "bizNo",
                      type: "text",
                      placeholder: "사업자번호",
                    },
                    { label: "업종", name: "category", type: "text", placeholder: "업종" },
                    {
                      label: "상태",
                      name: "status",
                      type: "select",
                      options: [
                        { label: "활성", value: "ACTIVE" },
                        { label: "비활성", value: "INACTIVE" },
                      ],
                    },
                  ]}
                />
                <DataTable
                  columns={allVendorColumns}
                  data={allVendors as unknown as Record<string, unknown>[]}
                  sectionLabel="협력업체 전체 목록"
                  onRowClick={(row) => {
                    const vendor = allVendors.find((v) => v.id === String(row.id));
                    if (vendor) {
                      setSelectedVendor(vendor);
                      setVendorListDrawerOpen(true);
                    }
                  }}
                />
              </div>
            )}
          </>
        )}
      </Tabs>

      {/* Drawers */}
      <PendingVendorDrawer
        vendor={selectedPending}
        open={pendingDrawerOpen}
        onClose={() => setPendingDrawerOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <VendorListDrawer
        vendor={selectedVendor}
        open={vendorListDrawerOpen}
        onClose={() => setVendorListDrawerOpen(false)}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
