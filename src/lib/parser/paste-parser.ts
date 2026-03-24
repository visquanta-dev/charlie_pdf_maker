import type { AuditReportData, LeadEntry, LeadStatus, TimelineEntry } from "@/lib/types/audit";

export function parseGPTOutput(text: string): AuditReportData {
  // Extract dealership info from header
  const dealershipName = extractAfter(text, /dealership[:\s]*name[:\s]*/i) ||
    extractAfter(text, /^#+\s*(.+?)\s*[-–—]\s*/m) || "";
  const dealershipLocation = extractAfter(text, /location[:\s-]*/i) || "";
  const auditPeriod = extractAfter(text, /audit\s*period[:\s-]*/i) ||
    extractAfter(text, /period[:\s-]*/i) || "";
  const sourceReviewed = extractAfter(text, /source\s*reviewed[:\s-]*/i) || "";
  const audience = extractAfter(text, /audience[:\s-]*/i) || "";

  // Extract executive summary
  const executiveSummary = extractSection(text, /executive\s*summary/i) || "";

  // Extract metrics with executive reads
  const performanceMetrics = {
    firstContacts: extractNumber(text, /1st\s*contacts?[:\s]*/i) ||
      extractNumber(text, /first\s*contacts?[:\s]*/i) || 0,
    firstContactsRead: extractMetricRead(text, /1st\s*contacts?|first\s*contacts?/i) || "",
    totalContacted: extractNumber(text, /total\s*contacted[:\s]*/i) || 0,
    totalContactedRead: extractMetricRead(text, /total\s*contacted/i) || "",
    replied: extractNumber(text, /replied[:\s]*/i) || 0,
    repliedRead: extractMetricRead(text, /replied/i) || "",
    replyRate: extractPercentage(text, /reply\s*rate[:\s]*/i) || "0%",
    replyRateRead: extractMetricRead(text, /reply\s*rate/i) || "",
    opportunitiesCreated: extractNumber(text, /opportunities?\s*created[:\s]*/i) || 0,
    opportunitiesCreatedRead: extractMetricRead(text, /opportunities?\s*created/i) || "",
    opportunityRate: extractPercentage(text, /opportunity\s*rate[:\s]*/i) || "0%",
    opportunityRateRead: extractMetricRead(text, /opportunity\s*rate/i) || "",
  };

  // Extract executive interpretation
  const executiveInterpretation = extractSection(text, /executive\s*interpretation/i) || "";

  // Additional store note
  const additionalStoreNote = extractSection(text, /additional\s*store\s*note/i) || "";

  // Extract leads
  const leads = extractLeads(text);

  // Distribution
  const overallDistribution = {
    missedOpportunity: leads.filter((l) => l.status === "missed-opportunity").length,
    missedOpportunityMeaning: extractDistributionMeaning(text, /missed\s*opportunit/i) || "",
    atRisk: leads.filter((l) => l.status === "at-risk").length,
    atRiskMeaning: extractDistributionMeaning(text, /at[\s-]*risk/i) || "",
    bestPractice: leads.filter((l) => l.status === "best-practice").length,
    bestPracticeMeaning: extractDistributionMeaning(text, /best[\s-]*practice/i) || "",
  };

  // Communication summary
  const communicationSummary = extractSection(text, /communication\s*summary/i) || "";

  // Final takeaway
  const finalExecutiveTakeaway = extractSection(text, /final\s*executive\s*takeaway/i) || "";

  // Forward focus / Training focus areas
  const forwardFocus = extractForwardFocus(text);

  // Closing summary
  const closingSummary = extractSection(text, /closing\s*summary/i) || "";

  return {
    dealershipName,
    dealershipLocation,
    auditPeriod,
    sourceReviewed,
    audience,
    executiveSummary,
    performanceMetrics,
    executiveInterpretation,
    additionalStoreNote,
    leads: leads.length > 0 ? leads : [createEmptyLead()],
    overallDistribution,
    communicationSummary,
    finalExecutiveTakeaway,
    forwardFocus: forwardFocus.length > 0 ? forwardFocus : [{ title: "", description: "" }],
    closingSummary,
  };
}

function createEmptyLead(): LeadEntry {
  return {
    id: crypto.randomUUID(),
    name: "",
    phone: "",
    status: "at-risk",
    statusDetail: "",
    executiveSummary: "",
    timeline: [{ date: "", event: "" }],
    inflectionPoint: "",
    whatWorkedWell: [""],
    missedOpportunities: [""],
    whatToDoNext: "",
    bestPracticeQuote: "",
  };
}

function extractAfter(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  if (!match) return null;
  const start = match.index! + match[0].length;
  const rest = text.slice(start);
  const line = rest.split("\n")[0].trim();
  return line || null;
}

function extractNumber(text: string, pattern: RegExp): number {
  const val = extractAfter(text, pattern);
  if (!val) return 0;
  const num = parseInt(val.replace(/,/g, ""), 10);
  return isNaN(num) ? 0 : num;
}

function extractPercentage(text: string, pattern: RegExp): string {
  const val = extractAfter(text, pattern);
  if (!val) return "0%";
  const match = val.match(/[\d.]+%?/);
  if (!match) return "0%";
  return match[0].endsWith("%") ? match[0] : match[0] + "%";
}

function extractSection(text: string, headerPattern: RegExp): string {
  const lines = text.split("\n");
  let capturing = false;
  const result: string[] = [];

  for (const line of lines) {
    if (headerPattern.test(line)) {
      capturing = true;
      continue;
    }
    if (capturing) {
      // Stop at next header
      if (/^#{1,4}\s/.test(line) || /^[A-Z][A-Z\s]{3,}:?\s*$/.test(line.trim())) {
        break;
      }
      if (line.trim()) result.push(line.trim());
    }
  }

  return result.join("\n").replace(/\*\*/g, "").trim();
}

/**
 * Extract executive read for a metric by looking for the metric row in table format
 * Looks for patterns like: "Metric | Value | Executive Read description"
 */
function extractMetricRead(text: string, metricPattern: RegExp): string {
  const lines = text.split("\n");
  for (const line of lines) {
    if (metricPattern.test(line)) {
      // Try table format: Metric | Value | Read
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length >= 3) {
        return parts[parts.length - 1].replace(/\*\*/g, "").trim();
      }
      // Try tab/multi-space separated
      const tabParts = line.split(/\t+|\s{2,}/).map((p) => p.trim()).filter(Boolean);
      if (tabParts.length >= 3) {
        return tabParts[tabParts.length - 1].replace(/\*\*/g, "").trim();
      }
    }
  }
  return "";
}

/**
 * Extract distribution meaning from a table-format line
 */
function extractDistributionMeaning(text: string, statusPattern: RegExp): string {
  // Look in the "Overall Lead Distribution" or "Overall Distribution" section
  const distSection = extractSection(text, /overall\s*(lead\s*)?distribution/i);
  if (!distSection) return "";

  const lines = distSection.split("\n");
  for (const line of lines) {
    if (statusPattern.test(line)) {
      // Try table format
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length >= 3) {
        return parts[parts.length - 1].replace(/\*\*/g, "").trim();
      }
      // Try tab/space separated: skip the status and number to get the meaning
      const tabParts = line.split(/\t+|\s{2,}/).map((p) => p.trim()).filter(Boolean);
      if (tabParts.length >= 3) {
        return tabParts.slice(2).join(" ").replace(/\*\*/g, "").trim();
      }
    }
  }
  return "";
}

function extractLeads(text: string): LeadEntry[] {
  const leads: LeadEntry[] = [];

  // Split on lead headers like "## 1) Name | Phone" or "### Lead 1:" or "## 1."
  const leadBlocks = text.split(/(?=#{2,4}\s*(?:Lead\s*\d+|\d+[.)]\s))/i);

  for (const block of leadBlocks) {
    if (!/(lead\s*\d+|^#{2,4}\s*\d+[.)])/im.test(block)) continue;

    const lead = createEmptyLead();

    // Name — try "N) Name | Phone" pattern first
    const namePhoneMatch = block.match(/\d+[.)]\s*([A-Za-z][A-Za-z\s.]+?)\s*\|\s*([\d\-+()\s]+)/m);
    if (namePhoneMatch) {
      lead.name = namePhoneMatch[1].trim();
      lead.phone = namePhoneMatch[2].trim();
    } else {
      // Fallback: just name
      const nameMatch = block.match(/(?:lead\s*\d+[:\-–—\s]*)?([A-Z][a-zA-Z\s.]+?)(?:\s*[-–—(]|\s*$)/m);
      if (nameMatch) lead.name = nameMatch[1].trim();
      // Phone
      const phoneMatch = block.match(/(?:phone|tel|#)[:\s]*([(\d\s\-+)]+)/i);
      if (phoneMatch) lead.phone = phoneMatch[1].trim();
    }

    // Status
    if (/missed\s*opportunit/i.test(block)) lead.status = "missed-opportunity";
    else if (/at[\s-]*risk/i.test(block)) lead.status = "at-risk";
    else if (/best[\s-]*practice/i.test(block)) lead.status = "best-practice";

    // Status detail — extract parenthetical after status
    const detailMatch = block.match(/(?:missed\s*opportunity|at[\s-]*risk|best[\s-]*practice)\s*\(([^)]+)\)/i);
    if (detailMatch) lead.statusDetail = detailMatch[1].trim();

    // Summary (look for "Opportunity Summary" first, then "Summary")
    const summary = extractSection(block, /opportunity\s*summary/i) ||
      extractSection(block, /(?:executive\s*)?summary/i);
    if (summary) lead.executiveSummary = summary;

    // Timeline
    const timelineEntries = extractTimeline(block);
    if (timelineEntries.length > 0) lead.timeline = timelineEntries;

    // Inflection point
    const inflection = extractSection(block, /inflection\s*point/i);
    if (inflection) lead.inflectionPoint = inflection;

    // What worked well
    const worked = extractBullets(block, /what\s*worked\s*well/i);
    if (worked.length > 0) lead.whatWorkedWell = worked;

    // Missed opportunities
    const missed = extractBullets(block, /missed\s*opportunit/i);
    if (missed.length > 0) lead.missedOpportunities = missed;

    // What should have happened / What to do next
    const next = extractSection(block, /what\s*should\s*have\s*happened/i) ||
      extractSection(block, /what\s*to\s*do\s*next/i);
    if (next) lead.whatToDoNext = next;

    // Best practice quote
    const quote = extractSection(block, /best[\s-]*practice\s*(?:quote)?/i);
    if (quote) lead.bestPracticeQuote = quote.replace(/^[""]|[""]$/g, "");

    leads.push(lead);
  }

  return leads;
}

function extractTimeline(block: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const lines = block.split("\n");
  let inTimeline = false;

  for (const line of lines) {
    if (/timeline/i.test(line)) {
      inTimeline = true;
      continue;
    }
    if (inTimeline) {
      if (/^#{1,4}\s|^\*\*[A-Z]/m.test(line.trim())) break;
      // Match "• MM/DD/YYYY - event" or "- Date: event" or "Date — event"
      const match = line.match(/^[\s\-•*]*(\d[\d\s/,\-to]+?)[\s:–—-]+(.+)/);
      if (match) {
        entries.push({ date: match[1].trim(), event: match[2].trim() });
      }
    }
  }

  return entries;
}

function extractBullets(block: string, headerPattern: RegExp): string[] {
  const items: string[] = [];
  const lines = block.split("\n");
  let capturing = false;

  for (const line of lines) {
    if (headerPattern.test(line)) {
      capturing = true;
      continue;
    }
    if (capturing) {
      if (/^#{1,4}\s|^\*\*[A-Z]/.test(line.trim())) break;
      const match = line.match(/^[\s\-•*]+(.+)/);
      if (match) items.push(match[1].trim().replace(/\*\*/g, ""));
    }
  }

  return items;
}

function extractForwardFocus(text: string): { title: string; description: string }[] {
  const items: { title: string; description: string }[] = [];
  const lines = text.split("\n");
  let inSection = false;

  // Try both "Forward Focus" and "Critical Training Focus Areas"
  for (const line of lines) {
    if (/forward\s*focus|critical\s*training\s*focus/i.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (/^#{1,3}\s/.test(line.trim()) && !/forward|focus|training/i.test(line)) break;
      // Match "• **Title** - Description" or "1. Title: Description"
      const bulletMatch = line.match(/^[\s\d.\-•*]*\*?\*?([^:*\-–—]+?)\*?\*?\s*[:\-–—]\s*(.+)/);
      if (bulletMatch) {
        items.push({ title: bulletMatch[1].trim(), description: bulletMatch[2].trim() });
      } else if (line.trim() && !/^[\s\-•*\d.]/.test(line)) {
        // Plain paragraph text — add as description-only item
        items.push({ title: "", description: line.trim().replace(/\*\*/g, "") });
      }
    }
  }

  return items;
}
