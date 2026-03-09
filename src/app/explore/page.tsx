"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { VISIBLE_SKILLS, CATEGORIES, ECOSYSTEMS } from "@/lib/mock-data";
import { SafetyStatus } from "@/lib/types";
import SkillCard from "@/components/SkillCard";

const SAFETY_OPTIONS: { value: SafetyStatus | "all"; label: string; color?: string }[] = [
  { value: "all", label: "全部" },
  { value: "verified", label: "完整认证", color: "#4CAF82" },
  { value: "reviewed", label: "重点审查", color: "#5B8FAA" },
  { value: "basic", label: "基础审核", color: "#C9A227" },
];

const SORT_OPTIONS = [
  { value: "score", label: "最高评分" },
  { value: "popular", label: "最受欢迎" },
  { value: "newest", label: "最新发布" },
  { value: "stars", label: "最多收藏" },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "score";

  const [query, setQuery] = useState(initialQuery);
  const [safetyFilter, setSafetyFilter] = useState<SafetyStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("全部");
  const [ecosystemFilter, setEcosystemFilter] = useState("全部");
  const [sort, setSort] = useState(initialSort);

  const results = useMemo(() => {
    let list = [...VISIBLE_SKILLS];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.displayName.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.ecosystems.some((ecosystem) => ecosystem.toLowerCase().includes(q)) ||
          s.author.toLowerCase().includes(q)
      );
    }

    if (safetyFilter !== "all") {
      list = list.filter((s) => s.safetyStatus === safetyFilter);
    }

    if (categoryFilter !== "全部") {
      list = list.filter((s) => s.category === categoryFilter);
    }

    if (ecosystemFilter !== "全部") {
      list = list.filter((s) => s.ecosystems.includes(ecosystemFilter));
    }

    if (sort === "score") list.sort((a, b) => b.score.overall - a.score.overall);
    else if (sort === "popular") list.sort((a, b) => b.installs - a.installs);
    else if (sort === "newest") list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    else if (sort === "stars") list.sort((a, b) => b.totalStars - a.totalStars);

    return list;
  }, [query, safetyFilter, categoryFilter, ecosystemFilter, sort]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px 80px" }}>

      {/* Page title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 6 }}>
          探索技能
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          {VISIBLE_SKILLS.length} 个技能，覆盖多平台生态的高质量 skill 合集
        </p>
      </div>

      {/* Search + sort */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 480 }}>
          <svg
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索技能名称、标签、作者..."
            style={{
              width: "100%", height: 38, paddingLeft: 36, paddingRight: 12,
              fontSize: 14, color: "var(--text-primary)",
              backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 16, lineHeight: 1 }}
            >×</button>
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            height: 38, padding: "0 12px", fontSize: 13,
            color: "var(--text-secondary)", backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)", borderRadius: 8, outline: "none", cursor: "pointer",
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <span style={{ fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          {results.length} 个结果
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>

        {/* ── Sidebar ── */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Safety filter */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              安全状态
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {SAFETY_OPTIONS.map((opt) => {
                const count = opt.value === "all" ? VISIBLE_SKILLS.length : VISIBLE_SKILLS.filter((s) => s.safetyStatus === opt.value).length;
                const active = safetyFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSafetyFilter(opt.value)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "6px 10px", borderRadius: 7, border: "none",
                      backgroundColor: active ? "var(--accent-dim)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                      fontSize: 13, fontWeight: active ? 500 : 400,
                      cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {opt.color && <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: opt.color, display: "inline-block" }} />}
                      {opt.label}
                    </span>
                    <span style={{ fontSize: 11, color: active ? "var(--accent)" : "var(--text-muted)" }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              分类
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {CATEGORIES.map((cat) => {
                const active = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      display: "block", width: "100%",
                      padding: "6px 10px", borderRadius: 7, border: "none",
                      backgroundColor: active ? "var(--accent-dim)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                      fontSize: 13, fontWeight: active ? 500 : 400,
                      cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              生态
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {ECOSYSTEMS.map((ecosystem) => {
                const active = ecosystemFilter === ecosystem;
                const count = ecosystem === "全部"
                  ? VISIBLE_SKILLS.length
                  : VISIBLE_SKILLS.filter((skill) => skill.ecosystems.includes(ecosystem)).length;

                return (
                  <button
                    key={ecosystem}
                    onClick={() => setEcosystemFilter(ecosystem)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "6px 10px", borderRadius: 7, border: "none",
                      backgroundColor: active ? "var(--accent-dim)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                      fontSize: 13, fontWeight: active ? 500 : 400,
                      cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <span>{ecosystem}</span>
                    <span style={{ fontSize: 11, color: active ? "var(--accent)" : "var(--text-muted)" }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Results grid ── */}
        <div>
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🦭</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>没有找到相关技能</div>
              <div style={{ fontSize: 13 }}>试试换个关键词或清除筛选条件</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {results.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: "var(--text-muted)" }}>加载中...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
