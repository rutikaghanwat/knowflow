export type HandoverStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'completed';
export type SourceType = 'pdf' | 'docx' | 'github';
export type SourceStatus = 'processed' | 'indexing' | 'pending' | 'failed';
export type EvidenceType = 'verified_fact' | 'ai_inference' | 'recommendation' | 'unknown_missing';

export type HandoverRole =
  | 'Project Manager'
  | 'Backend Developer'
  | 'Frontend Developer'
  | 'DevOps Engineer'
  | 'UI/UX Designer'
  | 'QA Engineer';

export type UserPerspective = 'project_manager' | 'departing_employee' | 'incoming_employee';

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  objectives?: string;
  startDate?: string;
  expectedCompletionDate?: string;
  status: 'active' | 'in_progress' | 'archived' | 'on_hold';
  owner: string;
  ownerAvatar?: string;
  membersCount: number;
  sourcesCount: number;
  handoversCount: number;
  lastUpdated: string;
  repoUrl?: string;
  permissions?: {
    [role in HandoverRole]?: string[];
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: HandoverRole;
  department: string;
  avatar: string;
  projects: string[];
  responsibilities: string[];
  accessPermissions: string[];
  status: 'active' | 'onboarding' | 'departing' | 'alumni';
  handoversCount: number;
  joinedAt: string;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: SourceType;
  size?: string;
  projectId: string;
  projectName: string;
  status: SourceStatus;
  progress?: number;
  extractedFactsCount: number;
  lastSynced: string;
  addedBy: string;
  url?: string;
  branch?: string;
  authorizedAccess?: string;
  errorReason?: string;
}

export interface EvidenceItem {
  id: string;
  claim: string;
  type: EvidenceType;
  sourceId: string;
  sourceName: string;
  sourceRef: string; // e.g. "Page 14, Section 3.2" or "Commit a8f912c"
  quote: string;
  confidenceScore: number; // 0 to 1
  verifiedBy?: string;
  verificationStatus?: 'verified' | 'unverified' | 'flagged';
  managerComment?: string;
  timestamp: string;
}

export interface KnowledgeFinding {
  id: string;
  title: string;
  description: string;
  category:
    | 'completed_task'
    | 'pending_task'
    | 'decision'
    | 'responsibility'
    | 'risk'
    | 'blocker'
    | 'dependency'
    | 'unresolved_question'
    | 'recommendation';
  classification: EvidenceType;
  targetRole?: HandoverRole;
  projectName: string;
  sourceName: string;
  sourceRef: string;
  quote: string;
  confidenceScore: number;
  verificationStatus: 'verified' | 'unverified' | 'flagged';
  managerComment?: string;
  lastUpdated: string;
}

export interface ProjectStateItem {
  id: string;
  title: string;
  category: 'work_status' | 'decision' | 'responsibility' | 'dependency' | 'knowledge_gap';
  status: 'completed' | 'pending' | 'in_progress' | 'blocked';
  owner: string;
  reasoning?: string;
  dependencies?: string[];
  flagType?: 'missing' | 'outdated' | 'contradictory' | 'incomplete';
  conflictDescription?: string;
  sourceReference: string;
  lastVerified: string;
}

export interface InformationConflict {
  id: string;
  title: string;
  category: string;
  recordA: { source: string; claim: string; date: string };
  recordB: { source: string; claim: string; date: string };
  impact: string;
  status: 'unresolved' | 'resolved';
  managerResolution?: string;
}

export interface ReportFinding {
  id: string;
  title: string;
  description: string;
  type: EvidenceType;
  targetRoles?: HandoverRole[];
  evidence: EvidenceItem[];
  actionRequired?: string;
  owner?: string;
}

export interface ReportSection {
  id: string;
  key:
    | 'executive_summary'
    | 'completed_work'
    | 'pending_tasks'
    | 'key_decisions'
    | 'responsibilities'
    | 'risks_and_blockers'
    | 'dependencies'
    | 'unresolved_questions'
    | 'recommended_actions';
  title: string;
  description: string;
  findings: ReportFinding[];
}

export interface HandoverReport {
  id: string;
  handoverId: string;
  title: string;
  projectName: string;
  departingMember: TeamMember;
  incomingMember: TeamMember;
  manager: TeamMember;
  status: HandoverStatus;
  version: string;
  generatedAt: string;
  updatedAt: string;
  targetRole: HandoverRole;
  accessCheckPassed: boolean;
  roleRelevanceScore: number;
  verifiedFactsCount: number;
  aiInferencesCount: number;
  recommendationsCount: number;
  unresolvedCount: number;
  completionScore: number; // 0 to 100
  summary: string;
  sections: ReportSection[];
  approvalHistory?: {
    id: string;
    action: 'approved' | 'rejected' | 'requested_changes';
    reviewer: string;
    reviewerRole: string;
    comment: string;
    timestamp: string;
  }[];
  acknowledgment?: {
    isAcknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
    digitalSignature?: string;
    checklistAnswers?: { id: string; label: string; confirmed: boolean }[];
  };
}

export interface HandoverStepInfo {
  stepNumber: number;
  key: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface Handover {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  targetRole: HandoverRole;
  departingMemberId: string;
  departingMember: TeamMember;
  incomingMemberId: string;
  incomingMember: TeamMember;
  reviewerId: string;
  reviewer: TeamMember;
  status: HandoverStatus;
  currentStep: number; // 1 to 10
  progressPercentage: number;
  createdAt: string;
  targetDate: string;
  reportId?: string;
  sourcesIncluded: number;
  factsExtracted: number;
  summary: string;
  steps: HandoverStepInfo[];
  transferAcknowledged: boolean;
}

export interface ApprovalRequest {
  id: string;
  reportId: string;
  handoverTitle: string;
  projectName: string;
  departingMember: string;
  incomingMember: string;
  targetRole: HandoverRole;
  submittedAt: string;
  status: 'pending' | 'approved' | 'changes_requested';
  priority: 'high' | 'medium' | 'normal';
  unresolvedQuestions: number;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'approval' | 'source' | 'handover' | 'system';
  link?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: HandoverRole;
  organization: string;
  avatar: string;
  timezone: string;
  notificationsEnabled: boolean;
  aiSensitivity: 'high' | 'balanced' | 'strict';
}
