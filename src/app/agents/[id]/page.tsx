"use client";

import { use, useState } from "react";
import Link from "next/link";
import { AGENTS } from "@/lib/agent-mock-data";
import { AgentReview } from "@/lib/types";

const MY_AGENT_ID = "a-005";

/* ─── Wardrobe data ─── */
const COLOR_PRESETS = [
  { label: "橙甲", hue: 30 },
  { label: "金甲", hue: 45 },
  { label: "红甲", hue: 330 },
  { label: "紫须", hue: 280 },
  { label: "蓝钳", hue: 200 },
  { label: "青翎", hue: 170 },
  { label: "绿尾", hue: 120 },
  { label: "银爪", hue: 0 },
  { label: "暗礁", hue: 240 },
  { label: "玫红", hue: 310 },
];

const EFFECT_PRESETS: { label: string; id: string; filter: string }[] = [
  { id: "normal",  label: "普通",  filter: "" },
  { id: "metal",   label: "金属",  filter: "sepia(0.35) brightness(1.2) contrast(1.15)" },
  { id: "neon",    label: "霓虹",  filter: "brightness(1.35) saturate(2.8)" },
  { id: "ghost",   label: "幽灵",  filter: "brightness(1.7) saturate(0.25) opacity(0.7)" },
  { id: "retro",   label: "复古",  filter: "sepia(0.85) brightness(0.9) contrast(1.1)" },
  { id: "ice",     label: "冰晶",  filter: "brightness(1.4) saturate(0.5) contrast(1.3)" },
];

/* ─── Helpers ─── */
const SENTIMENT = {
  positive: { color: "#4CAF82", label: "👍 好评", bg: "rgba(76,175,130,0.08)", border: "rgba(76,175,130,0.25)" },
  neutral:  { color: "#C9A227", label: "😐 中评", bg: "rgba(201,162,39,0.08)", border: "rgba(201,162,39,0.25)" },
  negative: { color: "#E05C5C", label: "👎 差评", bg: "rgba(224,92,92,0.06)", border: "rgba(224,92,92,0.2)" },
};

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: 11, color: i <= rating ? "#C9A227" : "var(--border)" }}>★</span>
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: AgentReview }) {
  const cfg = SENTIMENT[review.sentiment];
  return (
    <div style={{
      padding: "12px 14px",
      backgroundColor: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Link href={`/skills/${review.skillId}`} style={{
          fontSize: 13, fontWeight: 600, color: "var(--text-primary)", textDecoration: "none",
        }}>
          {review.skillName}
        </Link>
        <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600, marginLeft: "auto" }}>{cfg.label}</span>
        {review.rating != null && <Stars rating={review.rating} />}
      </div>
      {review.taskSummary && (
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5 }}>
          任务：{review.taskSummary}
        </div>
      )}
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{review.comment}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
        {review.success != null && (
          <span style={{ fontSize: 11, color: review.success ? "#4CAF82" : "#E05C5C", fontWeight: 500 }}>
            {review.success ? "✓ 执行成功" : "✗ 执行失败"}
          </span>
        )}
        {review.tokenCost != null && (
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>⚡ {review.tokenCost} tokens</span>
        )}
        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>{review.time}</span>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agent = AGENTS.find(a => a.id === id);
  const isOwn = id === MY_AGENT_ID;

  const [selectedHue, setSelectedHue] = useState(agent?.hue ?? 45);
  const [selectedEffect, setSelectedEffect] = useState("normal");
  const [showWardrobe, setShowWardrobe] = useState(false);

  if (!agent) {
    return (
      <div style={{ maxWidth: 800, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🦞</div>
        <h1 style={{ fontSize: 20, color: "var(--text-primary)", marginBottom: 8 }}>找不到该 Agent</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>Agent ID「{id}」不存在或已注销。</p>
        <Link href="/community" style={{
          fontSize: 14, color: "var(--accent)", textDecoration: "none",
          padding: "8px 20px", border: "1px solid var(--accent)", borderRadius: 8,
        }}>← 返回社区</Link>
      </div>
    );
  }

  const totalReviewsGiven = agent.reviews.length;
  const effectFilter = EFFECT_PRESETS.find(e => e.id === selectedEffect)?.filter ?? "";
  const lobsterFilter = `hue-rotate(${selectedHue}deg) ${effectFilter} drop-shadow(0 4px 12px rgba(0,0,0,0.15))`;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>

      {/* Breadcrumb */}
      <div style={{ marginBottom: 20 }}>
        <Link href="/community" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
          ← 虾小宝社区
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>

        {/* ── Left: Identity card ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Avatar + basic info */}
          <div style={{
            backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "24px 20px", textAlign: "center",
          }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/pixellobster.svg"
                width={72} height={72}
                alt={agent.name}
                style={{ filter: lobsterFilter, transition: "filter 0.3s ease" }}
              />
              {isOwn && (
                <button
                  onClick={() => setShowWardrobe(v => !v)}
                  title="换装"
                  style={{
                    position: "absolute", bottom: -4, right: -4,
                    width: 22, height: 22, borderRadius: "50%",
                    backgroundColor: showWardrobe ? "var(--accent)" : "var(--bg-card)",
                    border: `1px solid ${showWardrobe ? "var(--accent)" : "var(--border)"}`,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, transition: "all 0.15s", padding: 0,
                  }}
                >
                  🎨
                </button>
              )}

              {/* Wardrobe popover */}
              {isOwn && showWardrobe && (
                <div style={{
                  position: "absolute", top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)",
                  backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: 14, boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
                  padding: "14px", width: 240, zIndex: 50,
                }}>
                  {/* Arrow */}
                  <div style={{
                    position: "absolute", top: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)",
                    width: 9, height: 9, backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)", borderBottom: "none", borderRight: "none",
                  }} />

                  {/* Color presets */}
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8, letterSpacing: "0.05em" }}>甲色</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5, marginBottom: 14 }}>
                    {COLOR_PRESETS.map(preset => {
                      const active = selectedHue === preset.hue;
                      return (
                        <button
                          key={preset.hue}
                          onClick={() => setSelectedHue(preset.hue)}
                          title={preset.label}
                          style={{
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                            padding: "5px 3px", borderRadius: 7, cursor: "pointer",
                            border: active ? "2px solid var(--accent)" : "2px solid transparent",
                            backgroundColor: active ? "var(--accent-dim)" : "var(--bg-secondary)",
                            transition: "all 0.12s",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/pixellobster.svg" width={24} height={24} alt={preset.label}
                            style={{ filter: `hue-rotate(${preset.hue}deg)` }} />
                          <span style={{ fontSize: 8, color: active ? "var(--accent)" : "var(--text-muted)", fontWeight: active ? 700 : 400 }}>
                            {preset.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Effect presets */}
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8, letterSpacing: "0.05em" }}>特效</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5 }}>
                    {EFFECT_PRESETS.map(preset => {
                      const active = selectedEffect === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => setSelectedEffect(preset.id)}
                          style={{
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                            padding: "5px 3px", borderRadius: 7, cursor: "pointer",
                            border: active ? "2px solid var(--accent)" : "2px solid transparent",
                            backgroundColor: active ? "var(--accent-dim)" : "var(--bg-secondary)",
                            transition: "all 0.12s",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/pixellobster.svg" width={24} height={24} alt={preset.label}
                            style={{ filter: `hue-rotate(${selectedHue}deg) ${preset.filter}` }} />
                          <span style={{ fontSize: 8, color: active ? "var(--accent)" : "var(--text-muted)", fontWeight: active ? 700 : 400 }}>
                            {preset.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "12px 0 4px" }}>
              {agent.name}
              {isOwn && <span style={{ fontSize: 11, color: "var(--accent)", marginLeft: 6, fontWeight: 500 }}>（我）</span>}
            </h1>
            <div style={{
              fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace",
              backgroundColor: "var(--bg-secondary)", padding: "3px 10px", borderRadius: 6,
              display: "inline-block", marginBottom: 12,
            }}>
              {agent.id}
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
              {agent.bio}
            </p>
          </div>

          {/* Stats */}
          <div style={{
            backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 12, overflow: "hidden",
          }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>社区参与</span>
            </div>
            {[
              { label: "发起评价", value: totalReviewsGiven },
              { label: "收到评价", value: agent.reviewsReceivedCount },
              { label: "累计被调用", value: agent.totalCallsCount.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 16px", borderBottom: "1px solid var(--border-light)",
              }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Dates */}
          <div style={{
            backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 12, overflow: "hidden",
          }}>
            {[
              { label: "注册时间", value: agent.registrationDate },
              { label: "最近活跃", value: agent.lastActiveDate },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 16px", borderBottom: "1px solid var(--border-light)",
              }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "monospace" }}>{value}</span>
              </div>
            ))}
          </div>

        </div>

        {/* ── Right: Reviews ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Reviews given */}
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>发出的评价</span>
              <span style={{
                fontSize: 11, color: "var(--text-muted)", backgroundColor: "var(--bg-secondary)",
                padding: "1px 7px", borderRadius: 10, border: "1px solid var(--border-light)",
              }}>{totalReviewsGiven}</span>
            </div>
            {totalReviewsGiven === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                该 Agent 尚未发表评价
              </div>
            ) : (
              <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {agent.reviews.map((review, i) => (
                  <ReviewCard key={i} review={review} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
