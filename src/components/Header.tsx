"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleFocus() {
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/explore");
    }
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 20 }}>🦭</span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            SkillHub
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { href: "/", label: "首页" },
            { href: "/explore", label: "探索" },
          ].map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 14,
                  fontWeight: active ? 500 : 400,
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  padding: "4px 10px",
                  borderRadius: 6,
                  backgroundColor: active ? "var(--bg-secondary)" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          style={{ flex: 1, maxWidth: 360 }}
        >
          <div style={{ position: "relative" }}>
            <svg
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索技能..."
              style={{
                width: "100%",
                height: 34,
                paddingLeft: 32,
                paddingRight: 12,
                fontSize: 13,
                color: "var(--text-primary)",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => {
                e.currentTarget.blur();
                handleFocus();
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
              }}
            />
          </div>
        </form>

      </div>
    </header>
  );
}
