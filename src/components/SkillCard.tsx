"use client";

import { useState } from "react";
import Link from "next/link";
import { Skill, SourcePlatform } from "@/lib/types";

const PLATFORM_CONFIG: Record<SourcePlatform, { label: string; color: string; bg: string }> = {
  github:      { label: "开源平台", color: "#8b949e", bg: "rgba(139,148,158,0.1)" },
  npm:         { label: "开源平台", color: "#8b949e", bg: "rgba(139,148,158,0.1)" },
  pypi:        { label: "开源平台", color: "#8b949e", bg: "rgba(139,148,158,0.1)" },
  huggingface: { label: "开源平台", color: "#8b949e", bg: "rgba(139,148,158,0.1)" },
  smithery:    { label: "开源平台", color: "#8b949e", bg: "rgba(139,148,158,0.1)" },
};

function PlatformChip({ platform }: { platform: SourcePlatform }) {
  const cfg = PLATFORM_CONFIG[platform];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 10,
        fontWeight: 600,
        color: cfg.color,
        backgroundColor: cfg.bg,
        padding: "1px 6px",
        borderRadius: 4,
        letterSpacing: "0.01em",
        flexShrink: 0,
      }}
    >
      {cfg.label}
    </span>
  );
}


const CERT_STEPS = [
  { key: "safety",        label: "安全性",  desc: "拦截高危操作指令，评估 Prompt Injection 防护与权限收敛能力" },
  { key: "completeness",  label: "完整性",  desc: "依赖树遍历，验证前置依赖包、环境变量与 OS 约束声明" },
  { key: "executability", label: "可执行性", desc: "沙盒环境实际运行，捕获工具调用幻觉与运行时崩溃" },
] as const;

function SafetyBadge({ steps }: { steps: Skill["certifiedSteps"] }) {
  const [hovered, setHovered] = useState(false);
  const count = [steps.safety, steps.completeness, steps.executability].filter(s => s === "passed").length;
  const cfg =
    count === 3 ? { color: "#4CAF82", bg: "rgba(76,175,130,0.12)", label: `认证 ${count}/3` } :
    count === 2 ? { color: "#5B8FAA", bg: "rgba(91,143,170,0.12)", label: `认证 ${count}/3` } :
    count === 1 ? { color: "#C9A227", bg: "rgba(201,162,39,0.12)",  label: `认证 ${count}/3` } :
                  { color: "#9B9B9B", bg: "rgba(155,155,155,0.10)", label: "待认证" };

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 10, fontWeight: 600, color: cfg.color,
        backgroundColor: cfg.bg, padding: "2px 7px",
        borderRadius: 20, flexShrink: 0, letterSpacing: "0.01em",
      }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: cfg.color, display: "inline-block" }} />
        {cfg.label}
      </span>
      {/* Info icon */}
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => e.preventDefault()}
        style={{ fontSize: 11, color: "var(--text-muted)", cursor: "default", lineHeight: 1, userSelect: "none" }}
      >ⓘ</span>
      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 999,
          backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "8px 12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          pointerEvents: "none",
          display: "flex", flexDirection: "column", gap: 5,
        }}>
          {CERT_STEPS.map((s) => {
            const st = steps[s.key];
            const icon = st === "passed" ? "✅" : st === "failed" ? "❌" : "⏳";
            const color = st === "passed" ? "#4CAF82" : st === "failed" ? "#E05C5C" : "#9B9B9B";
            return (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 11, flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 12, color, fontWeight: st === "passed" ? 500 : 400 }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


interface SkillCardProps {
  skill: Skill;
  compact?: boolean;
}

export default function SkillCard({ skill, compact = false }: SkillCardProps) {
  return (
    <Link href={`/skills/${skill.id}`}>
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: compact ? "14px 16px" : "18px 20px",
          cursor: "pointer",
          transition: "all 0.15s",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          height: "100%",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--border-focus)";
          el.style.boxShadow = "0 2px 12px rgba(91,143,170,0.12)";
          el.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--border)";
          el.style.boxShadow = "none";
          el.style.transform = "translateY(0)";
        }}
      >
        {/* Top row: title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <SafetyBadge steps={skill.certifiedSteps} />
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>v{skill.version}</span>
          </div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {skill.displayName}
          </h3>
          <div style={{ marginTop: 5 }}>
            <PlatformChip platform={skill.sourcePlatform} />
          </div>
        </div>

        {/* Description */}
        {!compact && (
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flex: 1,
            }}
          >
            {skill.description}
          </p>
        )}

        {/* Tags */}
        {!compact && skill.tags.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {skill.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  backgroundColor: "var(--bg-secondary)",
                  padding: "2px 7px",
                  borderRadius: 4,
                  border: "1px solid var(--border-light)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            borderTop: "1px solid var(--border-light)",
            paddingTop: 10,
            marginTop: "auto",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {skill.totalStars}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {skill.installs.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
