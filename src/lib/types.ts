export type SourcePlatform = "github" | "npm" | "pypi" | "huggingface" | "smithery";

export type CertStepStatus = "passed" | "pending" | "failed";

export interface CertifiedSteps {
  safety: CertStepStatus;       // 安全性：拦截高危指令 + Prompt Injection 防护
  completeness: CertStepStatus; // 完整性：依赖树遍历 + 环境声明验证
  executability: CertStepStatus;// 可执行性：沙盒容器实际运行验证
}

// 从 certifiedSteps 派生，方便过滤和显示
export type SafetyStatus = "verified" | "reviewed" | "basic" | "pending";

export function deriveStatus(steps: CertifiedSteps): SafetyStatus {
  const count = [steps.safety, steps.completeness, steps.executability].filter(s => s === "passed").length;
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
