"use client";

import Link from "next/link";
import { Skill, SourcePlatform } from "@/lib/types";

const PLATFORM_CONFIG: Record<SourcePlatform, { label: string; color: string; bg: string }> = {
  github:       { label: "GitHub",       color: "#c9d1d9", bg: "#21262d" },
  skillssh:     { label: "Skills.sh",    color: "#00D26A", bg: "#0d1117" },
  clawhub:      { label: "ClawHub",      color: "#a5b4fc", bg: "#1e1b4b" },
  openclaw_cn:  { label: "OpenClaw CN",  color: "#f87171", bg: "#2d1515" },
  openclawmp:   { label: "OpenClaw MP",  color: "#c4b5fd", bg: "#1e1232" },
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

function AuthorAvatar({ name, size = 20 }: { name: string; size?: number }) {
  const colors = ["#5B8FAA", "#7A6FAA", "#6AAA7A", "#AA8A5B", "#AA5B6A"];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: colors[colorIndex],
        color: "#fff",
        fontSize: size * 0.45,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {name.slice(0, 1)}
    </div>
  );
}

function SafetyBadge({ steps }: { steps: Skill["certifiedSteps"] }) {
  const count = [steps.safety, steps.completeness, steps.executability].filter(Boolean).length;
  const cfg =
    count === 3 ? { color: "#4CAF82", bg: "rgba(76,175,130,0.12)", label: "完整认证" } :
    count === 2 ? { color: "#5B8FAA", bg: "rgba(91,143,170,0.12)", label: "重点审查" } :
    count === 1 ? { color: "#C9A227", bg: "rgba(201,162,39,0.12)",  label: "基础审核" } :
                  { color: "#9B9B9B", bg: "rgba(155,155,155,0.10)", label: "待审核" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 10,
        fontWeight: 600,
        color: cfg.color,
        backgroundColor: cfg.bg,
        padding: "2px 7px",
        borderRadius: 20,
        flexShrink: 0,
        letterSpacing: "0.01em",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: cfg.color, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function ScoreRing({ score, size = 36 }: { score: number; size?: number }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? "#4CAF82" : score >= 70 ? "#5B8FAA" : "#9B9B9B";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={3} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={`${fill} ${circ - fill}`}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.28,
          fontWeight: 700,
          color,
          letterSpacing: "-0.03em",
        }}
      >
        {score}
      </div>
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
        {/* Top row: title + score ring */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
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
          <ScoreRing score={skill.score.overall} size={38} />
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
            justifyContent: "space-between",
            borderTop: "1px solid var(--border-light)",
            paddingTop: 10,
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <AuthorAvatar name={skill.author} size={18} />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{skill.author}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
      </div>
    </Link>
  );
}
