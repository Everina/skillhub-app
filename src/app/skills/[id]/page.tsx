"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SKILLS, VISIBLE_SKILLS } from "@/lib/mock-data";
import { SafetyStatus, CertStepStatus, SkillDependency, SourcePlatform } from "@/lib/types";
import SkillCard from "@/components/SkillCard";

const PLATFORM_CONFIG: Record<SourcePlatform, { label: string; color: string; bg: string }> = {
  github:      { label: "开源平台", color: "#8b949e", bg: "rgba(139,148,158,0.1)" },
  npm:         { label: "开源平台", color: "#8b949e", bg: "rgba(139,148,158,0.1)" },
  pypi:        { label: "开源平台", color: "#8b949e", bg: "rgba(139,148,158,0.1)" },
  huggingface: { label: "开源平台", color: "#8b949e", bg: "rgba(139,148,158,0.1)" },
  smithery:    { label: "开源平台", color: "#8b949e", bg: "rgba(139,148,158,0.1)" },
};

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


const CERT_STEPS = [
  { key: "safety",        label: "安全性" },
  { key: "completeness",  label: "完整性" },
  { key: "executability", label: "可执行性" },
] as const;

function stepDesc(st: CertStepStatus, label: string): string {
  if (st === "passed") return `${label}已验证`;
  if (st === "failed") return `${label}未通过`;
  return `${label}审核进行中`;
}

function SafetyPanel({ skill }: { skill: { safetyStatus: SafetyStatus; certifiedSteps: { safety: CertStepStatus; completeness: CertStepStatus; executability: CertStepStatus } } }) {
  const status = skill.safetyStatus;
  const steps = skill.certifiedSteps;

  const sub = CERT_STEPS.map((s) => stepDesc(steps[s.key], s.label)).join("，");

  const cfg =
    status === "verified" ? {
      label: "完整认证", color: "#4CAF82", bg: "rgba(76,175,130,0.08)", border: "rgba(76,175,130,0.25)",
      headline: "已通过全部 3 项认证",
      recommend: "非常推荐",
      recommendBg: "rgba(76,175,130,0.15)",
    } :
    status === "reviewed" ? {
      label: "重点审查", color: "#5B8FAA", bg: "rgba(91,143,170,0.08)", border: "rgba(91,143,170,0.25)",
      headline: "已通过 2 项认证",
      recommend: "推荐使用",
      recommendBg: "rgba(91,143,170,0.15)",
    } :
    status === "basic" ? {
      label: "基础审核", color: "#C9A227", bg: "rgba(201,162,39,0.08)", border: "rgba(201,162,39,0.25)",
      headline: "已通过 1 项认证",
      recommend: "谨慎使用",
      recommendBg: "rgba(201,162,39,0.15)",
    } : {
      label: "待审核", color: "#9B9B9B", bg: "rgba(155,155,155,0.06)", border: "rgba(155,155,155,0.2)",
      headline: "尚未进入审核队列",
      recommend: "暂不推荐",
      recommendBg: "rgba(155,155,155,0.12)",
    };

  return (
    <div style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, overflow: "hidden" }}>
      {/* Header bar */}
      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${cfg.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
            color: cfg.color, backgroundColor: cfg.recommendBg,
            padding: "3px 9px", borderRadius: 20,
          }}>
            {cfg.label}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, color: cfg.color,
            backgroundColor: cfg.recommendBg, padding: "3px 9px", borderRadius: 20,
          }}>
            {cfg.recommend}
          </span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>{cfg.headline}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{sub}</div>
      </div>

      {/* Steps */}
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {CERT_STEPS.map((s) => {
          const st = steps[s.key];
          const isPassed = st === "passed";
          const isFailed = st === "failed";
          const iconColor = isPassed ? cfg.color : isFailed ? "#E05C5C" : "#9B9B9B";
          const statusLabel = isPassed ? "已通过" : isFailed ? "未通过" : "审核中";
          const bgColor = isPassed ? cfg.recommendBg : isFailed ? "rgba(224,92,92,0.1)" : "rgba(155,155,155,0.1)";
          const borderColor = isPassed ? cfg.border : isFailed ? "rgba(224,92,92,0.3)" : "rgba(155,155,155,0.2)";
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                backgroundColor: bgColor, border: `1px solid ${borderColor}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {isPassed && <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>}
                {isFailed && <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="#E05C5C" strokeWidth={3}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
                {st === "pending" && <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#9B9B9B", opacity: 0.5 }} />}
              </div>
              <span style={{ fontSize: 13, color: isPassed ? "var(--text-primary)" : "var(--text-muted)", fontWeight: isPassed ? 500 : 400 }}>
                {s.label}
              </span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: iconColor, fontWeight: 500 }}>
                {statusLabel}
              </span>
            </div>
          );
        })}
      </div>
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [framework, setFramework] = useState<"openclaw" | "copaw">("openclaw");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [bundleSkillFinder, setBundleSkillFinder] = useState(true);

  const isSkillFinder = skill.name === "skill-finder";
  const skillFinderCmd = framework === "openclaw" ? `/skill install skill-finder` : `copaw add skill-finder`;
  const currentCommand = framework === "openclaw"
    ? `/skill install ${skill.name}`
    : `copaw add ${skill.name}`;
  const handleCopy = () => {
    const textToCopy = (!isSkillFinder && bundleSkillFinder)
      ? `${skillFinderCmd}\n${currentCommand}`
      : currentCommand;
    navigator.clipboard.writeText(textToCopy);
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


          {/* Install command */}
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px", marginBottom: 20 }}>
            {/* Framework selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, marginRight: 2 }}>框架</span>
              {(["openclaw", "copaw"] as const).map((fw) => {
                const active = framework === fw;
                return (
                  <button
                    key={fw}
                    onClick={() => setFramework(fw)}
                    style={{
                      background: active ? "var(--accent-dim)" : "none",
                      border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                      fontSize: 12, fontWeight: active ? 600 : 400,
                      color: active ? "var(--accent)" : "var(--text-muted)",
                      transition: "all 0.12s",
                    }}
                  >
                    {fw === "openclaw" ? "OpenClaw" : "CoPaw"}
                  </button>
                );
              })}
            </div>

            {/* SkillFinder bundle checkbox */}
            {!isSkillFinder && (
              <label style={{
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 10, cursor: "pointer",
                padding: "7px 10px",
                backgroundColor: bundleSkillFinder ? "rgba(76,175,130,0.07)" : "var(--bg-secondary)",
                border: `1px solid ${bundleSkillFinder ? "rgba(76,175,130,0.3)" : "var(--border-light)"}`,
                borderRadius: 8,
                transition: "all 0.15s",
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                  border: `1.5px solid ${bundleSkillFinder ? "#4CAF82" : "var(--border)"}`,
                  backgroundColor: bundleSkillFinder ? "#4CAF82" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}>
                  {bundleSkillFinder && (
                    <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={bundleSkillFinder}
                  onChange={(e) => setBundleSkillFinder(e.target.checked)}
                  style={{ display: "none" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: bundleSkillFinder ? "#4CAF82" : "var(--text-secondary)" }}>
                    让小龙虾变得更强！
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>
                    自动发现并推荐最适合任务的 Skills
                  </span>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
                  color: "#4CAF82", backgroundColor: "rgba(76,175,130,0.12)",
                  padding: "2px 7px", borderRadius: 10, flexShrink: 0,
                }}>
                  推荐
                </span>
              </label>
            )}

            {/* Command row(s) */}
            <div style={{
              backgroundColor: "var(--accent-dim)", borderRadius: 8, padding: "8px 14px",
              display: "flex", flexDirection: "column", gap: 6,
            }}>
              {!isSkillFinder && bundleSkillFinder && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0, minWidth: 24 }}>安装</span>
                  <code style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "var(--accent)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {skillFinderCmd}
                  </code>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0, minWidth: 24 }}>
                  {!isSkillFinder && bundleSkillFinder ? "　　" : "安装"}
                </span>
                <code style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "var(--accent)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {currentCommand}
                </code>
                <button
                  onClick={handleCopy}
                  title={copied ? "已复制" : "复制"}
                  style={{
                    flexShrink: 0, background: "none", border: "none",
                    padding: 2, cursor: "pointer",
                    color: copied ? "#4CAF82" : "var(--accent)",
                    display: "flex", alignItems: "center",
                    transition: "color 0.15s",
                  }}
                >
                  {copied ? (
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
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

          {/* Safety panel */}
          <SafetyPanel skill={skill} />

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
