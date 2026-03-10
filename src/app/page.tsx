"use client";

import { useState } from "react";
import Link from "next/link";
import { STATS, FEATURED_SKILL_IDS, VISIBLE_SKILLS } from "@/lib/mock-data";
import SkillCard from "@/components/SkillCard";
import Pixellobster from "@/components/Pixellobster";

const AGENT_INSTALL_CMD = `帮我安装技能，命令行指令是 curl -sL https://openclawmp.cc/api/v1/install.sh | sh`;

function AgentInstallBanner() {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(AGENT_INSTALL_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
        把下面的指令发给 Agent，就能让它直接安装并使用 虾王 上的技能了
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "9px 12px",
          maxWidth: 480,
        }}
      >
        <code
          style={{
            flex: 1,
            fontSize: 12,
            color: "var(--text-secondary)",
            fontFamily: "monospace",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {AGENT_INSTALL_CMD}
        </code>
        <button
          onClick={handleCopy}
          title="复制指令"
          style={{
            flexShrink: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: copied ? "var(--accent)" : "var(--text-muted)",
            padding: "2px 4px",
            display: "flex",
            alignItems: "center",
            transition: "color 0.15s",
          }}
        >
          {copied ? (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function InlineStat({ value, label, color, tooltip }: { value: string; label: string; color?: string; tooltip?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 28, fontWeight: 800, color: color || "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>
        {value}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</span>
        {tooltip && (
          <span
            style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: "var(--text-muted)", cursor: "default", flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            {hovered && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "var(--text-secondary)",
                whiteSpace: "nowrap",
                zIndex: 999,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                pointerEvents: "none",
                lineHeight: 1.5,
              }}>
                {tooltip}
              </div>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const featured = FEATURED_SKILL_IDS.map((id) => VISIBLE_SKILLS.find((s) => s.id === id)).filter(Boolean) as typeof VISIBLE_SKILLS;
  const collectedSkillCount = STATS.verifiedCount + STATS.reviewedCount + STATS.basicCount;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>

      {/* ── Hero ── */}
      <div
        style={{
          padding: "72px 32px 20px",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.35fr) auto",
            gap: 56,
            alignItems: "center",
          }}
        >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#4CAF82",
              backgroundColor: "rgba(76,175,130,0.12)",
              padding: "4px 10px",
              borderRadius: 20,
              marginBottom: 22,
              fontWeight: 400,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#4CAF82", display: "inline-block" }} />
            {STATS.verifiedCount} 个技能已通过安全认证
          </div>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.05em",
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            虾王 <br />安全可用 Skill 合集
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              maxWidth: 760,
              marginBottom: 22,
            }}
          >
            围绕飞书、小红书、抖音、GitHub 等生态精选可直接使用的技能，帮助你更快找到成熟、可靠的能力组件。
          </p>

          {/* Three dimension sentences */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28, maxWidth: 920 }}>
            {[
              { label: "安全性", desc: "拦截 rm -rf 等高危指令，并通过边界测试评估 Prompt Injection 防护与权限收敛能力" },
              { label: "完整性", desc: "语法层依赖树遍历，确保技能显式声明所有前置依赖包、环境变量及 OS 约束条件" },
              { label: "可执行性", desc: "在隔离沙盒容器中真实挂载并运行技能，捕获工具调用幻觉与运行时崩溃" },
            ].map(({ label, desc }) => (
              <div key={label} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "nowrap" }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: "#4CAF82",
                  backgroundColor: "rgba(76,175,130,0.10)",
                  padding: "2px 8px", borderRadius: 999,
                  flexShrink: 0,
                }}>
                  {label}
                </span>
                <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, whiteSpace: "nowrap" }}>{desc}</span>
              </div>
            ))}
          </div>

          {/* Agent install */}
          <AgentInstallBanner />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16 }}>
          <Pixellobster
            width={500}
            height="auto"
            aria-label="Pixel lobster"
            style={{ display: "block", maxWidth: "100%", height: "auto" }}
          />
        </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.25fr repeat(4, minmax(0, 1fr))",
          marginBottom: 52,
          paddingTop: 12,
        }}
      >
        <div
          style={{
            padding: "0 24px 0 0",
            borderRight: "1px solid var(--border-light)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.05em", lineHeight: 1 }}>
            {collectedSkillCount.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
            已收录技能
          </div>
        </div>

        {[
          { value: STATS.verifiedCount.toString(), label: "完整认证", color: "#4CAF82", tooltip: "通过安全性、完整性、可执行性三项认证" },
          { value: STATS.reviewedCount.toString(), label: "重点审查", color: "#5B8FAA", tooltip: "通过安全性、完整性两项认证" },
          { value: STATS.basicCount.toString(), label: "基础审核", color: "#C9A227", tooltip: "通过安全性一项认证" },
          { value: FEATURED_SKILL_IDS.length.toString(), label: "数据来源" },
        ].map(({ value, label, color, tooltip }, idx) => (
          <div
            key={label}
            style={{
              padding: "0 24px",
              borderRight: idx < 3 ? "1px solid var(--border-light)" : "none",
            }}
          >
            <InlineStat value={value} label={label} color={color} tooltip={tooltip} />
          </div>
        ))}
      </div>

      {/* ── Main 2-col layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32 }}>

        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

          {/* Featured */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                精选技能
              </h2>
              <Link href="/explore" style={{ fontSize: 13, color: "var(--accent)" }}>查看全部 →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {featured.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </section>

        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Safety summary */}
          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 14 }}>
              安全审核状态
            </h2>
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px" }}>
              {[
                { label: "完整认证", count: STATS.verifiedCount, color: "#4CAF82", bg: "rgba(76,175,130,0.12)" },
                { label: "重点审查", count: STATS.reviewedCount, color: "#5B8FAA", bg: "rgba(91,143,170,0.12)" },
                { label: "基础审核", count: STATS.basicCount,    color: "#C9A227", bg: "rgba(201,162,39,0.12)" },
              ].map(({ label, count, color, bg }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color, backgroundColor: bg, padding: "2px 8px", borderRadius: 20, flexShrink: 0, minWidth: 52, textAlign: "center" }}>
                    {label}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 4, backgroundColor: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(count / VISIBLE_SKILLS.length) * 100}%`, backgroundColor: color, borderRadius: 2 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", flexShrink: 0, minWidth: 28, textAlign: "right" }}>{count}</span>
                </div>
              ))}
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>
                当前首页只展示已收录且可直接浏览的技能
              </p>
            </div>
          </section>


        </div>
      </div>
    </div>
  );
}
