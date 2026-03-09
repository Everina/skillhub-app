"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SKILLS, VISIBLE_SKILLS } from "@/lib/mock-data";
import { SafetyStatus, SkillDependency, SkillScore, SourcePlatform } from "@/lib/types";
import SkillCard from "@/components/SkillCard";

const PLATFORM_CONFIG: Record<SourcePlatform, { label: string; color: string; bg: string }> = {
  github:       { label: "GitHub",       color: "#c9d1d9", bg: "#21262d" },
  skillssh:     { label: "Skills.sh",    color: "#00D26A", bg: "#0d1117" },
  clawhub:      { label: "ClawHub",      color: "#a5b4fc", bg: "#1e1b4b" },
  openclaw_cn:  { label: "OpenClaw CN",  color: "#f87171", bg: "#2d1515" },
  openclawmp:   { label: "OpenClaw MP",  color: "#c4b5fd", bg: "#1e1232" },
};
function AuthorAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const colors = ["#5B8FAA", "#7A6FAA", "#6AAA7A", "#AA8A5B", "#AA5B6A"];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        backgroundColor: colors[colorIndex], color: "#fff",
        fontSize: size * 0.42, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}
    >
      {name.slice(0, 1)}
    </div>
  );
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      if (!inCode) { inCode = true; codeLines = []; }
      else {
        inCode = false;
        elements.push(
          <pre key={i} style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px", overflowX: "auto", margin: "12px 0" }}>
            <code style={{ fontSize: 13, color: "var(--text-primary)", fontFamily: "monospace" }}>{codeLines.join("\n")}</code>
          </pre>
        );
      }
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }
    if (line.startsWith("# ")) elements.push(<h1 key={i} style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "24px 0 12px", letterSpacing: "-0.02em" }}>{line.slice(2)}</h1>);
    else if (line.startsWith("## ")) elements.push(<h2 key={i} style={{ fontSize: 17, fontWeight: 600, color: "var(--text-primary)", margin: "20px 0 10px", letterSpacing: "-0.01em" }}>{line.slice(3)}</h2>);
    else if (line.startsWith("### ")) elements.push(<h3 key={i} style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: "16px 0 8px" }}>{line.slice(4)}</h3>);
    else if (line.startsWith("- ")) elements.push(<li key={i} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginLeft: 20, marginBottom: 4 }}>{line.slice(2)}</li>);
    else if (line.trim() === "") elements.push(<div key={i} style={{ height: 8 }} />);
    else elements.push(<p key={i} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 8 }}>{line}</p>);
  }
  return <div>{elements}</div>;
}

function ScoreGauge({ score }: { score: SkillScore }) {
  const size = 88;
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score.overall / 100) * circ;
  const color = score.overall >= 85 ? "#4CAF82" : score.overall >= 70 ? "#5B8FAA" : "#9B9B9B";

  const dims = [
    { key: "安全性", val: score.safety, desc: "拦截高危操作指令，评估 Prompt Injection 防护与权限收敛能力" },
    { key: "完整性", val: score.completeness, desc: "依赖树遍历，验证前置依赖包、环境变量与 OS 约束声明" },
    { key: "可执行性", val: score.executability, desc: "沙盒环境实际运行，捕获工具调用幻觉与运行时崩溃" },
  ];

  return (
    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 16 }}>
        技能评分
      </div>

      {/* Gauge */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={5} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
              strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round" />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: "-0.04em", lineHeight: 1 }}>{score.overall}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>/ 100</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
            {score.overall >= 85 ? "优质技能" : score.overall >= 70 ? "良好技能" : "需要改进"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            综合安全性、完整性、可用性三维度评估
          </div>
        </div>
      </div>

      {/* Sub-dimensions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {dims.map(({ key, val, desc }) => {
          const c = val >= 85 ? "#4CAF82" : val >= 70 ? "#5B8FAA" : "#9B9B9B";
          return (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{key}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{val}</span>
              </div>
              <div style={{ height: 5, backgroundColor: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${val}%`, backgroundColor: c, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SafetyPanel({ status }: { status: SafetyStatus }) {
  const configs = {
    verified: {
      label: "完整认证", color: "#4CAF82", bg: "rgba(76,175,130,0.08)", border: "rgba(76,175,130,0.25)",
      title: "已通过完整认证",
      items: [
        "安全性：拦截 rm -rf 等高危指令，通过 Prompt Injection 边界测试",
        "完整性：语法层依赖树遍历，验证所有前置依赖、环境变量与 OS 约束",
        "可执行性：沙盒容器实际运行，捕获工具调用幻觉与运行时崩溃",
      ],
    },
    reviewed: {
      label: "重点审查", color: "#5B8FAA", bg: "rgba(91,143,170,0.08)", border: "rgba(91,143,170,0.25)",
      title: "已完成重点审查",
      items: [
        "安全性：已完成高危指令拦截测试 ✓",
        "完整性：依赖声明经语法层扫描验证 ✓",
        "可执行性：沙盒运行验证排队中",
      ],
    },
    basic: {
      label: "基础审核", color: "#C9A227", bg: "rgba(201,162,39,0.08)", border: "rgba(201,162,39,0.25)",
      title: "已完成基础审核",
      items: [
        "安全性：已完成高危指令拦截测试 ✓",
        "完整性：依赖树扫描排队中",
        "可执行性：沙盒运行验证排队中",
      ],
    },
    pending: {
      label: "待审核", color: "#9B9B9B", bg: "rgba(155,155,155,0.06)", border: "rgba(155,155,155,0.2)",
      title: "等待进入审核队列",
      items: [
        "安全性测试：排队中",
        "完整性扫描：排队中",
        "可执行性沙盒验证：排队中",
      ],
    },
  };
  const config = configs[status];

  return (
    <div style={{ backgroundColor: config.bg, border: `1px solid ${config.border}`, borderRadius: 10, padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: config.color, backgroundColor: `${config.bg}`, border: `1px solid ${config.border}`, padding: "2px 8px", borderRadius: 20 }}>
          {config.label}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{config.title}</span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
        {config.items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <span style={{ color: config.color, flexShrink: 0, marginTop: 1 }}>
              {status === "pending" ? "·" : "✓"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const DEP_TYPE_CONFIG: Record<SkillDependency["type"], { icon: string; label: string; color: string }> = {
  env:     { icon: "🔑", label: "ENV",  color: "#C9A227" },
  package: { icon: "📦", label: "PKG",  color: "#5B8FAA" },
  tool:    { icon: "🔧", label: "TOOL", color: "#7A6FAA" },
};

function DependencyTree({ deps }: { deps: SkillDependency[] }) {
  const required = deps.filter((d) => d.required);
  const optional = deps.filter((d) => !d.required);

  const renderItem = (dep: SkillDependency, isLast: boolean) => {
    const cfg = DEP_TYPE_CONFIG[dep.type];
    return (
      <div key={dep.name} style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
        {/* Tree connector */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 12, paddingTop: 2, flexShrink: 0, width: 16 }}>
          <span style={{ fontSize: 13, color: "var(--border)", lineHeight: 1 }}>{isLast ? "└" : "├"}</span>
          {!isLast && <div style={{ width: 1, flex: 1, backgroundColor: "var(--border)", minHeight: 16 }} />}
        </div>
        {/* Content */}
        <div style={{ flex: 1, paddingBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
            <span style={{ fontSize: 12 }}>{cfg.icon}</span>
            <code style={{ fontSize: 12, fontWeight: 600, color: cfg.color, fontFamily: "monospace" }}>{dep.name}</code>
            <span style={{
              fontSize: 10, fontWeight: 600, color: cfg.color,
              border: `1px solid ${cfg.color}`, borderRadius: 3,
              padding: "0 4px", opacity: 0.7,
            }}>{cfg.label}</span>
            {!dep.required && (
              <span style={{ fontSize: 10, color: "var(--text-muted)", backgroundColor: "var(--bg-secondary)", padding: "0 5px", borderRadius: 3 }}>可选</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, paddingLeft: 20 }}>
            {dep.description}
            {dep.default && (
              <span style={{ color: "var(--text-muted)" }}> · 默认：{dep.default}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {required.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
            必填依赖 · {required.length} 项
          </div>
          <div style={{ paddingLeft: 8 }}>
            {required.map((d, i) => renderItem(d, i === required.length - 1))}
          </div>
        </div>
      )}
      {optional.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
            可选依赖 · {optional.length} 项
          </div>
          <div style={{ paddingLeft: 8 }}>
            {optional.map((d, i) => renderItem(d, i === optional.length - 1))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const skill = SKILLS.find((s) => s.id === id);
  if (!skill) notFound();

  const related = VISIBLE_SKILLS.filter((s) => s.id !== skill.id && s.category === skill.category).slice(0, 3);

  const defaultReadme = `# ${skill.displayName}\n\n${skill.description}\n\n## 安装\n\`\`\`bash\n${skill.installCommand}\n\`\`\`\n\n## 功能\n- 功能描述 1\n- 功能描述 2\n- 功能描述 3\n\n## 使用示例\n\`\`\`\n示例指令或代码\n\`\`\`\n\n## 权限声明\n- 请查阅技能文档了解所需权限\n\n## 作者\n${skill.author} · 信誉 ${skill.authorReputation.toLocaleString()}`;

  const mockFiles = [
    { name: "skill.md",      size: "4.2 KB",  updated: "3天前" },
    { name: "config.json",   size: "1.1 KB",  updated: "3天前" },
    { name: "README.md",     size: "2.8 KB",  updated: "5天前" },
  ];

  const mockComments = [
    { author: "林晓薇", avatar: "林", time: "1天前",  body: "用了一周，稳定性不错，推荐！" },
    { author: "张远航", avatar: "张", time: "3天前",  body: "安装很顺畅，期待后续支持更多场景。" },
  ];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [activeTab, setActiveTab] = useState<"overview" | "files" | "deps" | "comments">("overview");
  const deps = skill.dependencies ?? [];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(skill.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px 80px" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13, color: "var(--text-muted)" }}>
        <Link href="/" style={{ color: "var(--text-muted)" }}>首页</Link>
        <span>/</span>
        <Link href="/explore" style={{ color: "var(--text-muted)" }}>探索</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{skill.displayName}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 288px", gap: 32 }}>

        {/* ── Left ── */}
        <div>
          {/* Header */}
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "28px 32px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                backgroundColor: "var(--accent-dim)", color: "var(--accent)",
                fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, border: "1px solid var(--border)",
              }}>
                ⚡
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)" }}>v{skill.version}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· 更新于 {skill.updatedAt}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {skill.category}</span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 8 }}>
                  {skill.displayName}
                </h1>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  {skill.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
              {skill.tags.map((tag) => (
                <span key={tag} style={{ fontSize: 12, color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)", padding: "3px 9px", borderRadius: 5, border: "1px solid var(--border-light)" }}>
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {/* Safety panel */}
          <div style={{ marginBottom: 20 }}>
            <SafetyPanel status={skill.safetyStatus} />
          </div>

          {/* Install command */}
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>安装</span>
              <code style={{ fontSize: 13, fontWeight: 500, color: "var(--accent)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {skill.installCommand}
              </code>
            </div>
            <button
              onClick={handleCopy}
              style={{
                flexShrink: 0, background: "none", border: "1px solid var(--border)",
                borderRadius: 6, padding: "5px 12px", cursor: "pointer",
                fontSize: 12, fontWeight: 500,
                color: copied ? "#4CAF82" : "var(--text-secondary)",
                borderColor: copied ? "#4CAF82" : "var(--border)",
                transition: "all 0.15s",
              }}
            >
              {copied ? "已复制 ✓" : "复制"}
            </button>
          </div>

          {/* Tabs */}
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            {/* Tab bar */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 24px" }}>
              {([
                { key: "overview",  label: "概览",  count: null },
                { key: "files",     label: "文件",  count: mockFiles.length },
                { key: "deps",      label: "依赖",  count: deps.length || null },
                { key: "comments",  label: "评论",  count: mockComments.length },
              ] as const).map(({ key, label, count }) => {
                const active = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: "14px 16px", fontSize: 13, fontWeight: active ? 600 : 400,
                      color: active ? "var(--text-primary)" : "var(--text-muted)",
                      borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
                      marginBottom: -1, display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    {label}
                    {count !== null && (
                      <span style={{
                        fontSize: 11, fontWeight: 500,
                        backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)",
                        padding: "1px 6px", borderRadius: 10,
                      }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div style={{ padding: "24px 32px" }}>
              {activeTab === "overview" && (
                <SimpleMarkdown content={skill.readme || defaultReadme} />
              )}

              {activeTab === "files" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {mockFiles.map((file, i) => (
                    <div key={file.name} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: i < mockFiles.length - 1 ? "1px solid var(--border-light)" : "none",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, opacity: 0.5 }}>📄</span>
                        <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>{file.name}</span>
                      </div>
                      <div style={{ display: "flex", gap: 24 }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{file.updated}</span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 48, textAlign: "right" }}>{file.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "deps" && (
                deps.length > 0
                  ? <DependencyTree deps={deps} />
                  : <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>该技能无外部依赖。</p>
              )}

              {activeTab === "comments" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {mockComments.map((c) => (
                    <div key={c.author} style={{ display: "flex", gap: 12 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        backgroundColor: "var(--accent-dim)", color: "var(--accent)",
                        fontSize: 13, fontWeight: 600,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{c.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{c.author}</span>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.time}</span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{c.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Score gauge */}
          <ScoreGauge score={skill.score} />

          {/* Author */}
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>作者</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AuthorAvatar name={skill.author} size={36} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{skill.author}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>信誉 {skill.authorReputation.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "版本", value: `v${skill.version}` },
              { label: "分类", value: skill.category },
              { label: "最近更新", value: skill.updatedAt },
              { label: "安装量", value: skill.installs.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>来源平台</span>
              <a
                href={skill.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: PLATFORM_CONFIG[skill.sourcePlatform].color,
                  backgroundColor: PLATFORM_CONFIG[skill.sourcePlatform].bg,
                  padding: "2px 8px", borderRadius: 4,
                }}>
                  {PLATFORM_CONFIG[skill.sourcePlatform].label}
                </span>
              </a>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 10 }}>同类技能</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {related.map((r) => (
                  <SkillCard key={r.id} skill={r} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
