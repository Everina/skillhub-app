# 虾王 — 安全可用的 Claude Skills

虾王 是面向 Openclaw 生态的技能市集，提供技能的发现、安装与认证信息展示。所有上架技能均经过安全性审核。

## 认证体系

每个技能经过三步独立认证，结果决定其认证等级与推荐程度。

### 三步认证流程

| 步骤 | 名称 | 说明 |
|------|------|------|
| 1 | 安全性 | 拦截高危指令，防护 Prompt Injection，通过方可上架 |
| 2 | 完整性 | 遍历依赖树，验证前置依赖包、环境变量与 OS 约束 |
| 3 | 可执行性 | 沙盒容器实际运行，捕获幻觉输出与运行时崩溃 |

**上架规则：** 安全性必须通过，否则技能不予上架。完整性与可执行性不影响上架资格，仅影响认证等级。

### 步骤状态

完整性与可执行性各有三种状态：

| 状态 | 含义 |
|------|------|
| `passed`（已通过）| 该步骤审核完成，结果合格 |
| `pending`（审核中）| 已进入审核队列，尚未出结果 |
| `failed`（未通过）| 审核完成，发现问题，未能通过 |

### 认证等级

| 等级 | 条件 | 推荐程度 |
|------|------|----------|
| 完整认证 | 三步全部通过 | 非常推荐 |
| 重点审查 | 通过 2 步 | 推荐使用 |
| 基础审核 | 通过 1 步（安全性）| 谨慎使用 |
| 待审核 | 未通过任何步骤 | 暂不推荐（不上架）|

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
