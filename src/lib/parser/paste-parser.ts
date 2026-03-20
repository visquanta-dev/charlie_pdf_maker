import type { AuditReportData, LeadEntry, LeadStatus, TimelineEntry } from "@/lib/types/audit";

export function parseGPTOutput(text: string): AuditReportData {
  const lines = text.split("\n");

  // Extract dealership info from header
  const dealershipName = extractAfter(text, /dealership[:\s]*name[:\s]*/i) ||
    extractAfter(text, /^#+\s*(.+?)\s*[-–—]\s*/m) || "";
  const dealershipLocation = extractAfter(text, /location[:\s]*/i) || "";
  const auditPeriod = extractAfter(text, /audit\s*period[:\s]*/i) ||
    extractAfter(text, /period[:\s]*/i) || "";

  // Extract executive summary
  const executiveSummary = extractSection(text, /executive\s*summary/i) || "";

  // Extract metrics
  const performanceMetrics = {
    firstContacts: extractNumber(text, /1st\s*contacts?[:\s]*/i) ||
      extractNumber(text, /first\s*contacts?[:\s]*/i) || 0,
    totalContacted: extractNumber(text, /total\s*contacted[:\s]*/i) || 0,
    replied: extractNumber(text, /replied[:\s]*/i) || 0,
    replyRate: extractPercentage(text, /reply\s*rate[:\s]*/i) || "0%",
    opportunitiesCreated: extractNumber(text, /opportunities?\s*created[:\s]*/i) || 0,
    opportunityRate: extractPercentage(text, /opportunity\s*rate[:\s]*/i) || "0%",
  };

  // Extract executive interpretation
  const executiveInterpretation = extractSection(text, /executive\s*interpretation/i) || "";

  // Extract leads
  const leads = extractLeads(text);

  // Distribution
  const overallDistribution = {
    missedOpportunity: leads.filter((l) => l.status === "missed-opportunity").length,
    atRisk: leads.filter((l) => l.status === "at-risk").length,
    bestPractice: leads.filter((l) => l.status === "best-practice").length,
  };

  // Final takeaway
  const finalExecutiveTakeaway = extractSection(text, /final\s*executive\s*takeaway/i) || "";

  // Forward focus
  const forwardFocus = extractForwardFocus(text);

  // Closing summary
  const closingSummary = extractSection(text, /closing\s*summary/i) || "";

  return {
    dealershipName,
    dealershipLocation,
    auditPeriod,
    executiveSummary,
    performanceMetrics,
    executiveInterpretation,
    leads: leads.length > 0 ? leads : [createEmptyLead()],
    overallDistribution,
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

  return result.join(" ").replace(/\*\*/g, "").trim();
}

function extractLeads(text: string): LeadEntry[] {
  const leads: LeadEntry[] = [];

  // Split on lead headers like "### Lead 1:" or "**Lead 1:**" or "## 1."
  const leadBlocks = text.split(/(?=#{2,4}\s*(?:Lead\s*\d+|[0-9]+\.)\s*[:\-–—])/i);

  for (const block of leadBlocks) {
    if (!/(lead\s*\d+|^#{2,4}\s*\d+\.)/im.test(block)) continue;

    const lead = createEmptyLead();

    // Name
    const nameMatch = block.match(/(?:lead\s*\d+[:\-–—\s]*)?([A-Z][a-zA-Z\s.]+?)(?:\s*[-–—(]|\s*$)/m);
    if (nameMatch) lead.name = nameMatch[1].trim();

    // Phone
    const phoneMatch = block.match(/(?:phone|tel|#)[:\s]*([(\d\s\-+)]+)/i);
    if (phoneMatch) lead.phone = phoneMatch[1].trim();

    // Status
    if (/missed\s*opportunit/i.test(block)) lead.status = "missed-opportunity";
    else if (/at[\s-]*risk/i.test(block)) lead.status = "at-risk";
    else if (/best[\s-]*practice/i.test(block)) lead.status = "best-practice";

    // Summary
    const summary = extractSection(block, /(?:executive\s*)?summary/i);
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

    // What to do next
    const next = extractSection(block, /what\s*to\s*do\s*next/i);
    if (next) lead.whatToDoNext = next;

    // Best practice quote
    const quote = extractSection(block, /best[\s-]*practice\s*quote/i);
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
      // Match "- Date: event" or "• Date — event" or "Date: event"
      const match = line.match(/^[\s\-•*]*(\w[\w\s/,]+?)[\s:–—]+(.+)/);
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

  for (const line of lines) {
    if (/forward\s*focus/i.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (/^#{1,3}\s/.test(line.trim()) && !/forward/i.test(line)) break;
      // Match "1. **Title**: Description" or "- Title: Description"
      const match = line.match(/^[\s\d.\-•*]*\*?\*?([^:*]+?)\*?\*?[:\-–—]\s*(.+)/);
      if (match) {
        items.push({ title: match[1].trim(), description: match[2].trim() });
      }
    }
  }

  return items;
}
