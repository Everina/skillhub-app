"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const MY_AGENT = { id: "a-005", name: "金甲虾", hue: 45 };

type Message = {
  id: number;
  role: "user" | "agent";
  type: "text" | "skill-card" | "profile-card";
  content?: string;
  skill?: { name: string; version: string; rating: number; status: string };
};

const SCRIPT: Message[] = [
  {
    id: 1,
    role: "user",
    type: "text",
    content: "帮我找一个能整理飞书文档的 Skill，安装好之后试用一下",
  },
  {
    id: 2,
    role: "agent",
    type: "text",
    content: "好的，我去虾小宝搜一下，稍等片刻。",
  },
  {
    id: 3,
    role: "agent",
    type: "skill-card",
    skill: { name: "feishu-doc-organizer", version: "1.2.0", rating: 4.8, status: "verified" },
  },
  {
    id: 4,
    role: "agent",
    type: "text",
    content: "已找到匹配技能，完整认证，评分 4.8。正在安装并试运行……",
  },
  {
    id: 5,
    role: "agent",
    type: "text",
    content: "✅ 安装成功，试运行正常。已整理了你最近 7 天的飞书文档，生成目录结构如下：\n\n📁 产品设计\n  └ PRD v2.3、竞品分析\n📁 技术文档\n  └ 架构图、API 手册\n📁 会议纪要\n  └ 周会 ×4、评审 ×2",
  },
  {
    id: 6,
    role: "agent",
    type: "profile-card",
  },
];

const DELAYS = [0, 800, 1800, 3200, 4000, 6000, 8000];

function SkillChip({ skill }: { skill: NonNullable<Message["skill"]> }) {
  return (
    <div style={{
      backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "12px 14px",
      display: "flex", alignItems: "center", gap: 12, maxWidth: 300,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        backgroundColor: "var(--accent-dim)", color: "var(--accent)",
        fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
      }}>⚡</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
          {skill.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>v{skill.version}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
            color: "#4CAF82", backgroundColor: "rgba(76,175,130,0.12)",
            border: "1px solid rgba(76,175,130,0.25)",
            padding: "1px 6px", borderRadius: 4,
          }}>完整认证</span>
          <span style={{ fontSize: 11, color: "#F5A623" }}>★ {skill.rating}</span>
        </div>
      </div>
    </div>
  );
}

function ProfileCard() {
  return (
    <div style={{
      backgroundColor: "var(--bg-card)", border: "1px solid rgba(76,175,130,0.3)",
      borderRadius: 12, padding: "14px 16px", maxWidth: 300,
      background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(76,175,130,0.04) 100%)",
    }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
        本次操作已同步到我的 Agent 档案
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
        {[
          { icon: "📦", text: "安装记录：feishu-doc-organizer v1.2.0" },
          { icon: "⭐", text: "已自动提交使用评价（评分 5 / 成功）" },
          { icon: "📊", text: "累计技能调用 +1，本月共 47 次" },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
            <span style={{ fontSize: 13, flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>
      <Link
        href={`/agents/${MY_AGENT.id}`}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "7px 0", borderRadius: 7,
          backgroundColor: "rgba(76,175,130,0.12)", border: "1px solid rgba(76,175,130,0.3)",
          color: "#4CAF82", fontSize: 13, fontWeight: 600,
          textDecoration: "none", transition: "all 0.15s",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pixellobster.svg" width={16} height={16} alt="" style={{ filter: `hue-rotate(${MY_AGENT.hue}deg)` }} />
        查看{MY_AGENT.name}的 Agent 档案 →
      </Link>
    </div>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex", gap: 10, alignItems: "flex-end",
      flexDirection: isUser ? "row-reverse" : "row",
    }}>
      {/* Avatar */}
      {!isUser && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/pixellobster.svg" width={28} height={28} alt={MY_AGENT.name}
          style={{ flexShrink: 0, filter: `hue-rotate(${MY_AGENT.hue}deg)`, marginBottom: 2 }}
        />
      )}

      {/* Content */}
      {msg.type === "text" && (
        <div style={{
          maxWidth: "70%", padding: "10px 14px", borderRadius: 14,
          borderBottomRightRadius: isUser ? 4 : 14,
          borderBottomLeftRadius: isUser ? 14 : 4,
          backgroundColor: isUser ? "var(--accent)" : "var(--bg-card)",
          border: isUser ? "none" : "1px solid var(--border)",
          fontSize: 14, color: isUser ? "#fff" : "var(--text-primary)",
          lineHeight: 1.65, whiteSpace: "pre-wrap",
        }}>
          {msg.content}
        </div>
      )}
      {msg.type === "skill-card" && msg.skill && <SkillChip skill={msg.skill} />}
      {msg.type === "profile-card" && <ProfileCard />}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/pixellobster.svg" width={28} height={28} alt="" style={{ flexShrink: 0, filter: `hue-rotate(${MY_AGENT.hue}deg)`, marginBottom: 2 }} />
      <div style={{
        padding: "10px 16px", borderRadius: 14, borderBottomLeftRadius: 4,
        backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            backgroundColor: "var(--text-muted)",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [visible, setVisible] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    SCRIPT.forEach((msg, i) => {
      if (msg.role === "agent" && i > 0) {
        // show typing before agent message
        timers.push(setTimeout(() => setTyping(true), DELAYS[i] - 600));
      }
      timers.push(setTimeout(() => {
        setTyping(false);
        setVisible(v => [...v, msg.id]);
      }, DELAYS[i]));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visible, typing]);

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      <div style={{
        maxWidth: 720, margin: "0 auto", padding: "0 24px 80px",
        display: "flex", flexDirection: "column", height: "calc(100vh - 56px)",
      }}>

        {/* Chat header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "20px 0 16px", borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pixellobster.svg" width={36} height={36} alt={MY_AGENT.name}
            style={{ filter: `hue-rotate(${MY_AGENT.hue}deg)` }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{MY_AGENT.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#4CAF82" }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>在线 · Agent 模式</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", paddingTop: 24,
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          {SCRIPT.filter(m => visible.includes(m.id)).map(msg => (
            <Bubble key={msg.id} msg={msg} />
          ))}
          {typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input bar (decorative) */}
        <div style={{
          flexShrink: 0, paddingTop: 16,
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)",
            borderRadius: 12, padding: "10px 16px",
          }}>
            <span style={{ flex: 1, fontSize: 14, color: "var(--text-muted)" }}>
              向 {MY_AGENT.name} 发送消息…
            </span>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2}>
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
        </div>

      </div>
    </>
  );
}
