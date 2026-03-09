export type SourcePlatform = "github" | "skillssh" | "clawhub" | "openclaw_cn" | "openclawmp";

export interface SkillScore {
  overall: number;       // 0–100 composite
  safety: number;        // 安全性 0–100
  completeness: number;  // 完整性 0–100
  executability: number; // 可执行性 0–100
}

export interface CertifiedSteps {
  safety: boolean;       // 安全性：拦截高危指令 + Prompt Injection 防护
  completeness: boolean; // 完整性：依赖树遍历 + 环境声明验证
  executability: boolean;// 可执行性：沙盒容器实际运行验证
}

// 从 certifiedSteps 派生，方便过滤和显示
export type SafetyStatus = "verified" | "reviewed" | "basic" | "pending";

export function deriveStatus(steps: CertifiedSteps): SafetyStatus {
  const count = [steps.safety, steps.completeness, steps.executability].filter(Boolean).length;
  if (count === 3) return "verified";
  if (count === 2) return "reviewed";
  if (count === 1) return "basic";
  return "pending";
}

export interface SkillDependency {
  name: string;
  type: "env" | "package" | "tool";
  required: boolean;
  description: string;
  default?: string;
}

export interface Skill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  tags: string[];
  installs: number;
  totalStars: number;
  author: string;
  authorId: string;
  authorAvatar: string;
  authorReputation: number;
  version: string;
  installCommand: string;
  updatedAt: string;
  category: string;
  readme?: string;
  sourcePlatform: SourcePlatform;
  sourceUrl: string;
  ecosystems: string[];  // 对接的生态平台，如飞书、小红书、GitHub
  dependencies?: SkillDependency[];
  score: SkillScore;
  certifiedSteps: CertifiedSteps;
  safetyStatus: SafetyStatus; // derived from certifiedSteps for filtering
}

export interface Contributor {
  id: string;
  name: string;
  avatar: string;
  reputation: number;
  skillCount: number;
}

export interface ActivityItem {
  id: string;
  type: "publish" | "update";
  skillName: string;
  skillId: string;
  author: string;
  authorAvatar: string;
  time: string;
  version?: string;
}

export interface Stats {
  totalSkills: number;
  totalInstalls: number;
  weeklyAdditions: number;
  verifiedCount: number;  // 3/3
  reviewedCount: number;  // 2/3
  basicCount: number;     // 1/3
}
