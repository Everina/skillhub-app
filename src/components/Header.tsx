"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Pixellobster from "@/components/Pixellobster";

export default function Header() {
  const pathname = usePathname();
  const [showContact, setShowContact] = useState(false);

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
          <Pixellobster
            width={28}
            height="auto"
            aria-label="Pixel lobster logo"
            style={{ display: "block", width: 28, height: "auto", flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            虾小宝
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
          <Link
            href="/community"
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 14, fontWeight: pathname === "/community" ? 500 : 400,
              color: pathname === "/community" ? "var(--text-primary)" : "var(--text-secondary)",
              padding: "4px 10px", borderRadius: 6,
              backgroundColor: pathname === "/community" ? "var(--bg-secondary)" : "transparent",
              transition: "all 0.15s",
            }}
          >
            社区
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
              color: "#4CAF82", backgroundColor: "rgba(76,175,130,0.12)",
              border: "1px solid rgba(76,175,130,0.3)",
              padding: "1px 5px", borderRadius: 4, lineHeight: 1.4,
            }}>
              NEW
            </span>
          </Link>
        </nav>

        {/* Contact us */}
        <div
          style={{ position: "relative", flexShrink: 0, marginLeft: "auto" }}
          onMouseEnter={() => setShowContact(true)}
          onMouseLeave={() => setShowContact(false)}
        >
          <button
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer",
              padding: "5px 8px", borderRadius: 8,
              color: showContact ? "var(--accent)" : "var(--text-muted)",
              backgroundColor: showContact ? "var(--accent-dim)" : "transparent",
              transition: "all 0.15s",
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 500 }}>联系我们</span>
          </button>

          {/* Popover */}
          {showContact && (
            <div style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 100,
              width: 172,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              pointerEvents: "none",
            }}>
              {/* Arrow */}
              <div style={{
                position: "absolute", top: -5, right: 22,
                width: 10, height: 10,
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRight: "none", borderBottom: "none",
                transform: "rotate(45deg)",
              }} />
              <div style={{
                width: 120, height: 120,
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                <img
                  src="/qrcode.png"
                  alt="进群二维码"
                  width={120}
                  height={120}
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    (e.currentTarget.parentElement as HTMLElement).innerHTML =
                      `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="5" y="5" width="3" height="3" fill="var(--text-muted)"/><rect x="16" y="5" width="3" height="3" fill="var(--text-muted)"/><rect x="5" y="16" width="3" height="3" fill="var(--text-muted)"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg>`;
                  }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>扫码加入社群</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>获取最新技能更新<br />与开发者交流</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
