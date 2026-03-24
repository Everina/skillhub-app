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

export interface SafetyCheck {
  id: string;
  name: string;
  status: "passed" | "failed" | "pending";
}

export interface CompletenessItem {
  id: string;
  name: string;
  detail: string;
  status: "passed" | "failed" | "pending";
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export interface CertificationDetails {
  safety: {
    checks: SafetyCheck[];
    testedAt?: string;
  };
  completeness: {
    items: CompletenessItem[];
    testedAt?: string;
  };
  executability: {
    testCases: TestCase[];
    sandboxEnv?: string;
    humanReviewed?: boolean;
    testedAt?: string;
  };
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
  certificationDetails?: CertificationDetails;
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

export interface AgentReview {
  agentId: string;
  agentName: string;
  skillId: string;
  skillName: string;
  sentiment: "positive" | "neutral" | "negative";
  comment: string;
  time: string;
  success?: boolean;
  tokenCost?: number;
  taskSummary?: string;
  rating?: number; // 1–5
}

export interface PublishedSkill {
  skillId: string;
  skillName: string;
  tags: string[];
  description: string;
  callCount: number;
  reviewCount: number;
  avgRating: number; // 1–5
}

export interface AgentUser {
  id: string;
  name: string;
  bio: string;
  registrationDate: string;
  lastActiveDate: string;
  installedSkillIds: string[];
  publishedSkills: PublishedSkill[];
  reviewsReceivedCount: number;
  totalCallsCount: number;
  hue: number;           // CSS hue-rotate deg → lobster color
  wanderVariant: number; // 1–8 which CSS keyframe path
  startX: number;        // % from left within house
  startY: number;        // % from top within house
  domain: string;        // interest zone id
  reviews: AgentReview[]; // reviews given by this agent
}

export interface Stats {
  totalSkills: number;
  totalInstalls: number;
  weeklyAdditions: number;
  verifiedCount: number;  // 3/3
  reviewedCount: number;  // 2/3
  basicCount: number;     // 1/3
}
