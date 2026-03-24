"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const MY_AGENT = { id: "a-005", name: "金甲虾", hue: 45 };
const CHAT_AVATAR_SRC = "/chat-xiaxiaobao.png";

type SkillInfo = { name: string; version: string; rating: number; status: string };

type Message = {
  id: number;
  role: "user" | "agent";
  type: "text" | "skill-card" | "skillset-card" | "profile-card";
  content?: string;
  skill?: SkillInfo;
  skillset?: { skill1: SkillInfo; skill2: SkillInfo; reason: string };
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
  {
    id: 7,
    role: "user",
    type: "text",
    content: "再帮我找一个 Skill，能把整理好的飞书文档翻译成英文，然后同步到 Notion",
  },
  {
    id: 8,
    role: "agent",
    type: "text",
    content: "好的，我搜一下有没有能同时做到翻译 + Notion 同步的 Skill……",
  },
  {
    id: 9,
    role: "agent",
    type: "text",
    content: "搜了一圈，没有单个 Skill 能完整覆盖「翻译 + Notion 发布」这个需求。不过我找到了一个现成的组合方案，两者配合可以完全满足你：",
  },
  {
    id: 10,
    role: "agent",
    type: "skillset-card",
    skillset: {
      skill1: { name: "feishu-translator", version: "2.0.1", rating: 4.7, status: "verified" },
      skill2: { name: "notion-publisher", version: "1.5.3", rating: 4.9, status: "verified" },
      reason: "feishu-translator 将飞书文档翻译为英文，notion-publisher 将结果同步至 Notion 工作区，两者通过标准输出管道衔接。",
    },
  },
  {
    id: 11,
    role: "agent",
    type: "text",
    content: "两个 Skill 均已通过完整认证，可以放心安装。需要我帮你一键安装这个 Skillset 吗？",
  },
];

const DELAYS = [0, 800, 1800, 3200, 4000, 6000, 8000, 10500, 11300, 12800, 14200, 16500];

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

function MiniSkillRow({ skill }: { skill: SkillInfo }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      backgroundColor: "var(--bg-secondary)", borderRadius: 8, padding: "9px 12px",
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 7, flexShrink: 0,
        backgroundColor: "var(--accent-dim)", color: "var(--accent)",
        fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center",
      }}>⚡</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{skill.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>v{skill.version}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.04em",
            color: "#4CAF82", backgroundColor: "rgba(76,175,130,0.12)",
            border: "1px solid rgba(76,175,130,0.25)",
            padding: "1px 5px", borderRadius: 3,
          }}>完整认证</span>
          <span style={{ fontSize: 10, color: "#F5A623" }}>★ {skill.rating}</span>
        </div>
      </div>
    </div>
  );
}

function SkillsetCard({ skillset }: { skillset: NonNullable<Message["skillset"]> }) {
  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid rgba(139,92,246,0.35)",
      borderRadius: 12, padding: "14px 16px", maxWidth: 340,
      background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(139,92,246,0.04) 100%)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
          color: "#8B5CF6", backgroundColor: "rgba(139,92,246,0.12)",
          border: "1px solid rgba(139,92,246,0.3)",
          padding: "2px 8px", borderRadius: 4,
        }}>SKILLSET 推荐</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>2 个技能组合</span>
      </div>

      {/* Skills */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <MiniSkillRow skill={skillset.skill1} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
          <span style={{
            fontSize: 11, fontWeight: 700, color: "#8B5CF6",
            backgroundColor: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: "50%", width: 22, height: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>+</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
        </div>
        <MiniSkillRow skill={skillset.skill2} />
      </div>

      {/* Reason */}
      <div style={{
        marginTop: 10, padding: "8px 10px",
        backgroundColor: "rgba(139,92,246,0.06)",
        borderRadius: 7, borderLeft: "2px solid rgba(139,92,246,0.4)",
        fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6,
      }}>
        {skillset.reason}
      </div>

      {/* Install button */}
      <button style={{
        marginTop: 10, width: "100%",
        padding: "8px 0", borderRadius: 7,
        backgroundColor: "rgba(139,92,246,0.12)",
        border: "1px solid rgba(139,92,246,0.35)",
        color: "#8B5CF6", fontSize: 13, fontWeight: 600,
        cursor: "pointer",
      }}>
        一键安装 Skillset →
      </button>
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
        <img src={CHAT_AVATAR_SRC} width={16} height={16} alt="" style={{ borderRadius: "50%" }} />
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
          src={CHAT_AVATAR_SRC} width={28} height={28} alt={MY_AGENT.name}
          style={{ flexShrink: 0, marginBottom: 2, borderRadius: "50%" }}
        />
      )}

      {/* Content */}
      {msg.type === "text" && (
        <div style={{
          maxWidth: "78%", padding: "10px 14px", borderRadius: 14,
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
      {msg.type === "skillset-card" && msg.skillset && <SkillsetCard skillset={msg.skillset} />}
      {msg.type === "profile-card" && <ProfileCard />}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={CHAT_AVATAR_SRC} width={28} height={28} alt="" style={{ flexShrink: 0, marginBottom: 2, borderRadius: "50%" }} />
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
        maxWidth: 860, margin: "0 auto", padding: "0 24px 80px",
        display: "flex", flexDirection: "column", height: "calc(100vh - 56px)",
      }}>

        {/* Chat header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "20px 0 16px", borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CHAT_AVATAR_SRC} width={36} height={36} alt={MY_AGENT.name}
            style={{ borderRadius: "50%" }} />
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
