export type LeadStatus = "missed-opportunity" | "at-risk" | "best-practice";

export interface TimelineEntry {
  date: string;
  event: string;
}

export interface LeadEntry {
  id: string;
  name: string;
  phone: string;
  status: LeadStatus;
  executiveSummary: string;
  timeline: TimelineEntry[];
  inflectionPoint: string;
  whatWorkedWell: string[];
  missedOpportunities: string[];
  whatToDoNext: string;
  bestPracticeQuote: string;
}

export interface PerformanceMetrics {
  firstContacts: number;
  totalContacted: number;
  replied: number;
  replyRate: string;
  opportunitiesCreated: number;
  opportunityRate: string;
}

export interface ForwardFocusItem {
  title: string;
  description: string;
}

export interface AuditReportData {
  dealershipName: string;
  dealershipLocation: string;
  auditPeriod: string;
  executiveSummary: string;
  performanceMetrics: PerformanceMetrics;
  executiveInterpretation: string;
  leads: LeadEntry[];
  overallDistribution: {
    missedOpportunity: number;
    atRisk: number;
    bestPractice: number;
  };
  finalExecutiveTakeaway: string;
  forwardFocus: ForwardFocusItem[];
  closingSummary: string;
}
