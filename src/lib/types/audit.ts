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
  statusDetail: string;
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
  firstContactsRead: string;
  totalContacted: number;
  totalContactedRead: string;
  replied: number;
  repliedRead: string;
  replyRate: string;
  replyRateRead: string;
  opportunitiesCreated: number;
  opportunitiesCreatedRead: string;
  opportunityRate: string;
  opportunityRateRead: string;
}

export interface ForwardFocusItem {
  title: string;
  description: string;
}

export interface AuditReportData {
  dealershipName: string;
  dealershipLocation: string;
  auditPeriod: string;
  sourceReviewed: string;
  audience: string;
  executiveSummary: string;
  performanceMetrics: PerformanceMetrics;
  executiveInterpretation: string;
  additionalStoreNote: string;
  leads: LeadEntry[];
  overallDistribution: {
    missedOpportunity: number;
    missedOpportunityMeaning: string;
    atRisk: number;
    atRiskMeaning: string;
    bestPractice: number;
    bestPracticeMeaning: string;
  };
  communicationSummary: string;
  finalExecutiveTakeaway: string;
  forwardFocus: ForwardFocusItem[];
  closingSummary: string;
}
