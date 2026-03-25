"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const MY_AGENT = { id: "a-005", name: "金甲虾", hue: 45 };
const CHAT_AVATAR_SRC = "/chat-xiaxiaobao.png";

type SkillInfo = { name: string; version: string; rating: number; status: string };

type Message = {
  id: number;
  role: "user" | "agent";
  type: "text" | "skill-card" | "skillset-card" | "profile-card" | "upload-form" | "upload-success";
  content?: string;
  skill?: SkillInfo;
  skillset?: { skill1: SkillInfo; skill2: SkillInfo; reason: string };
  uploadResult?: { slug: string; version: string };
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
  {
    id: 12,
    role: "user",
    type: "text",
    content: "好的，帮我安装吧。另外，我最近自己写了一个 Skill，想上传到虾小宝分享给大家",
  },
  {
    id: 13,
    role: "agent",
    type: "text",
    content: "Skillset 安装完成 ✅\n\n上传自己的 Skill 也完全没问题！填写基本信息并上传压缩包，我帮你提交到虾小宝 👇",
  },
  {
    id: 14,
    role: "agent",
    type: "upload-form",
  },
];

const DELAYS = [0, 800, 1800, 3200, 4000, 6000, 8000, 10500, 11300, 12800, 14200, 16500, 19000, 20200, 21400];

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

const INPUT_STYLE: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)",
  borderRadius: 7, padding: "7px 10px",
  fontSize: 13, color: "var(--text-primary)",
  outline: "none", transition: "border-color 0.15s",
};

function UploadFormCard({ onUploaded }: { onUploaded: (slug: string, version: string) => void }) {
  const [slug, setSlug]         = useState("");
  const [version, setVersion]   = useState("");
  const [desc, setDesc]         = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setDragOver] = useState(false);
  const [status, setStatus]     = useState<"idle" | "uploading" | "done">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.name.endsWith(".zip")) setFileName(file.name);
  };

  const handleSubmit = () => {
    if (!slug.trim() || !version.trim() || status !== "idle") return;
    setStatus("uploading");
    setTimeout(() => { setStatus("done"); onUploaded(slug.trim(), version.trim()); }, 1600);
  };

  if (status === "done") {
    return (
      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(76,175,130,0.4)",
        borderRadius: 12, padding: "14px 16px", maxWidth: 340,
        background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(76,175,130,0.04) 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>已提交上传</span>
        </div>
        <div style={{
          backgroundColor: "var(--bg-secondary)", borderRadius: 8, padding: "8px 12px",
          fontFamily: "monospace", fontSize: 13, color: "var(--text-primary)",
        }}>
          {slug}@{version}
        </div>
        {fileName && (
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
            📁 {fileName}
          </div>
        )}
      </div>
    );
  }

  const uploading = status === "uploading";

  return (
    <div style={{
      backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "16px", maxWidth: 340, width: "100%",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
          color: "var(--accent)", backgroundColor: "var(--accent-dim)",
          border: "1px solid rgba(var(--accent-rgb, 91,143,249),0.3)",
          padding: "2px 8px", borderRadius: 4,
        }}>上传 SKILL</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>填写信息并附上压缩包</span>
      </div>

      {/* Slug */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 4 }}>
          Slug <span style={{ color: "#E05C5C" }}>*</span>
        </label>
        <input
          value={slug} onChange={e => setSlug(e.target.value)}
          placeholder="my-awesome-skill"
          disabled={uploading}
          style={INPUT_STYLE}
          onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Version */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 4 }}>
          Version <span style={{ color: "#E05C5C" }}>*</span>
        </label>
        <input
          value={version} onChange={e => setVersion(e.target.value)}
          placeholder="1.0.0"
          disabled={uploading}
          style={INPUT_STYLE}
          onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 4 }}>
          简介 <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>（可选）</span>
        </label>
        <textarea
          value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="一句话描述这个 Skill 的用途…"
          rows={2}
          disabled={uploading}
          style={{ ...INPUT_STYLE, resize: "none", lineHeight: 1.55 }}
          onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Drop zone */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        style={{
          border: `1.5px dashed ${isDragOver ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 8, padding: "14px 12px",
          textAlign: "center", cursor: uploading ? "default" : "pointer",
          backgroundColor: isDragOver ? "var(--accent-dim)" : "var(--bg-secondary)",
          transition: "all 0.15s", marginBottom: 12,
        }}
      >
        <input ref={fileRef} type="file" accept=".zip" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {fileName ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <span style={{ fontSize: 16 }}>📦</span>
            <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{fileName}</span>
            <button onClick={e => { e.stopPropagation(); setFileName(null); }} style={{
              background: "none", border: "none", cursor: "pointer", padding: "0 2px",
              color: "var(--text-muted)", fontSize: 13, lineHeight: 1,
            }}>✕</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 20, marginBottom: 4 }}>📁</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>点击选择或拖入 .zip 压缩包</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>只支持 .zip 格式</div>
          </>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!slug.trim() || !version.trim() || uploading}
        style={{
          width: "100%", padding: "9px 0", borderRadius: 8,
          backgroundColor: (!slug.trim() || !version.trim() || uploading) ? "var(--bg-secondary)" : "var(--accent)",
          border: `1px solid ${(!slug.trim() || !version.trim() || uploading) ? "var(--border)" : "var(--accent)"}`,
          color: (!slug.trim() || !version.trim() || uploading) ? "var(--text-muted)" : "#fff",
          fontSize: 13, fontWeight: 600, cursor: (!slug.trim() || !version.trim() || uploading) ? "not-allowed" : "pointer",
          transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
      >
        {uploading ? (
          <>
            <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span>
            上传中…
          </>
        ) : "上传到虾小宝 →"}
      </button>
    </div>
  );
}

function UploadSuccessCard({ slug, version }: { slug: string; version: string }) {
  return (
    <div style={{
      backgroundColor: "var(--bg-card)", border: "1px solid rgba(76,175,130,0.35)",
      borderRadius: 12, padding: "14px 16px", maxWidth: 320,
      background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(76,175,130,0.04) 100%)",
    }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
        Skill 已提交，等待安全认证通过后上架
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
        {[
          { icon: "📦", text: `${slug}@${version} 已进入认证队列` },
          { icon: "🔒", text: "安全性检测中（通常 < 10 分钟）" },
          { icon: "🌐", text: "通过后自动发布至虾小宝市场" },
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
        <img src="/pixellobster.svg" width={14} height={14} alt="" style={{ filter: "hue-rotate(45deg)" }} />
        查看我的 Agent 主页 →
      </Link>
    </div>
  );
}

function Bubble({ msg, onUploaded }: { msg: Message; onUploaded?: (slug: string, version: string) => void }) {
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
      {msg.type === "upload-form" && onUploaded && <UploadFormCard onUploaded={onUploaded} />}
      {msg.type === "upload-success" && msg.uploadResult && (
        <UploadSuccessCard slug={msg.uploadResult.slug} version={msg.uploadResult.version} />
      )}
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
  const [extraMessages, setExtraMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    SCRIPT.forEach((msg, i) => {
      if (msg.role === "agent" && i > 0) {
        timers.push(setTimeout(() => setTyping(true), DELAYS[i] - 600));
      }
      timers.push(setTimeout(() => {
        setTyping(false);
        setVisible(v => [...v, msg.id]);
      }, DELAYS[i]));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleUploaded = (slug: string, version: string) => {
    const msgs: Message[] = [
      { id: 200, role: "agent", type: "text",
        content: `正在上传并校验 \`${slug}@${version}\`，稍等片刻……` },
      { id: 201, role: "agent", type: "text",
        content: `🎉 上传成功！\`${slug}@${version}\` 已提交认证队列，通过安全检测后自动上架到虾小宝。` },
      { id: 202, role: "agent", type: "upload-success", uploadResult: { slug, version } },
    ];
    setExtraMessages(msgs);
    setTimeout(() => setTyping(true), 100);
    setTimeout(() => { setTyping(false); setVisible(v => [...v, 200]); }, 1200);
    setTimeout(() => setTyping(true), 1800);
    setTimeout(() => { setTyping(false); setVisible(v => [...v, 201]); }, 3200);
    setTimeout(() => { setVisible(v => [...v, 202]); }, 3600);
  };

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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
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
          {[...SCRIPT, ...extraMessages].filter(m => visible.includes(m.id)).map(msg => (
            <Bubble key={msg.id} msg={msg} onUploaded={handleUploaded} />
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
