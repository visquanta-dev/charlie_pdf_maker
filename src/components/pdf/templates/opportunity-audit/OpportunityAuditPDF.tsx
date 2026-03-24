import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { styles, colors } from "./styles";
import type { AuditReportData, LeadEntry } from "@/lib/types/audit";
import fs from "fs";
import path from "path";

function getLogoSrc(): string {
  const jpegPath = path.join(process.cwd(), "public", "visquanta-logo.jpeg");
  const pngPath = path.join(process.cwd(), "public", "visquanta-logo.png");
  const filePath = fs.existsSync(jpegPath) ? jpegPath : pngPath;
  const ext = filePath.endsWith(".jpeg") || filePath.endsWith(".jpg") ? "jpeg" : "png";
  const buf = fs.readFileSync(filePath);
  return `data:image/${ext};base64,${buf.toString("base64")}`;
}

const logoSrc = getLogoSrc();

/* ── Header (fixed on every page) ── */
function PDFHeader({ data }: { data: AuditReportData }) {
  const subLine = [data.sourceReviewed, data.auditPeriod]
    .filter(Boolean)
    .join(" | ");

  return (
    <View style={styles.headerContainer} fixed>
      <View style={styles.headerLeft}>
        <Image style={styles.headerLogo} src={logoSrc} />
        <View style={styles.headerLeftText}>
          <Text style={styles.headerBrand}>VISQUANTA</Text>
          <Text style={styles.headerSubtitle}>Opportunity Execution Audit</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.headerDealerName}>{data.dealershipName}</Text>
        {subLine ? (
          <Text style={styles.headerDealerSub}>{subLine}</Text>
        ) : null}
      </View>
    </View>
  );
}

/* ── Footer (fixed on every page) ── */
function PDFFooter({ dealershipName }: { dealershipName: string }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        Confidential - For internal use by {dealershipName} and VisQuanta  |  Generated {dateStr}
      </Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  );
}

/* ── Orange section bar ── */
function SectionBar({ title }: { title: string }) {
  return (
    <View style={styles.sectionBar}>
      <Text style={styles.sectionBarText}>{title}</Text>
    </View>
  );
}

/* ── Metadata table (bordered grid matching Corwin) ── */
function PDFMetadataTable({ data }: { data: AuditReportData }) {
  return (
    <View style={styles.metaTable}>
      <View style={styles.metaTableRow}>
        <Text style={styles.metaTableCell}>
          Location - {data.dealershipLocation}
        </Text>
        <Text style={styles.metaTableCellRight}>
          Audit Period - {data.auditPeriod}
        </Text>
      </View>
      {(data.sourceReviewed || data.audience) && (
        <View style={styles.metaTableRowLast}>
          <Text style={styles.metaTableCell}>
            {data.sourceReviewed
              ? `Source Reviewed - ${data.sourceReviewed}`
              : ""}
          </Text>
          <Text style={styles.metaTableCellRight}>
            {data.audience ? `Audience - ${data.audience}` : ""}
          </Text>
        </View>
      )}
    </View>
  );
}

/* ── Performance table (3 columns) ── */
function PDFPerformanceTable({ data }: { data: AuditReportData }) {
  const m = data.performanceMetrics;
  const rows = [
    { label: "1st Contact", value: String(m.firstContacts), read: m.firstContactsRead },
    { label: "Total Contacted", value: String(m.totalContacted), read: m.totalContactedRead },
    { label: "Replied", value: String(m.replied), read: m.repliedRead },
    { label: "Reply Rate", value: m.replyRate, read: m.replyRateRead },
    { label: "Opportunities\nCreated", value: String(m.opportunitiesCreated), read: m.opportunitiesCreatedRead },
    { label: "Opportunity Rate", value: m.opportunityRate, read: m.opportunityRateRead },
  ];

  return (
    <View>
      {/* Header row */}
      <View style={styles.metricsHeaderRow}>
        <Text style={[styles.metricsHeaderCell, { width: "25%" }]}>Metric</Text>
        <Text style={[styles.metricsHeaderCell, { width: "12%" }]}>Value</Text>
        <Text style={[styles.metricsHeaderCell, { width: "63%" }]}>Executive Read</Text>
      </View>
      {rows.map((row, i) => (
        <View
          key={i}
          style={[styles.metricsRow, i % 2 === 1 ? styles.metricsRowAlt : {}]}
        >
          <Text style={styles.metricsLabel}>{row.label}</Text>
          <Text style={styles.metricsValue}>{row.value}</Text>
          <Text style={styles.metricsRead}>{row.read}</Text>
        </View>
      ))}
    </View>
  );
}

/* ── Lead status definitions (static) ── */
function LeadStatusDefinitions() {
  const defs = [
    {
      label: "Best Practice",
      text: "The dealership executed with strong continuity, recognized buying signals quickly, and delivered on commitments with clarity.",
    },
    {
      label: "Missed Opportunity",
      text: "The customer showed clear intent, but execution gaps in timing, follow-through, relevance, or clarity reduced momentum or delayed progression.",
    },
    {
      label: "At-Risk",
      text: "The customer experienced a trust-eroding failure, such as compliance issues, lack of value reinforcement, or broken continuity, increasing the likelihood of disengagement.",
    },
  ];

  return (
    <View>
      {defs.map((d, i) => (
        <View style={styles.defRow} key={i}>
          <Text style={styles.defLabel}>{d.label}</Text>
          <Text style={styles.defText}>{d.text}</Text>
        </View>
      ))}
    </View>
  );
}

/* ── Status-specific style helpers ── */
function getLeadHeaderStyle(status: string) {
  switch (status) {
    case "best-practice":
      return styles.leadHeaderBestPractice;
    case "at-risk":
      return styles.leadHeaderAtRisk;
    default:
      return styles.leadHeaderMissedOpportunity;
  }
}
function getLeadStatusStyle(status: string) {
  switch (status) {
    case "best-practice":
      return styles.leadStatusBestPractice;
    case "at-risk":
      return styles.leadStatusAtRisk;
    default:
      return styles.leadStatusMissedOpportunity;
  }
}
function getLeadBodyStyle(status: string) {
  switch (status) {
    case "best-practice":
      return styles.leadBodyBestPractice;
    case "at-risk":
      return styles.leadBodyAtRisk;
    default:
      return styles.leadBodyMissedOpportunity;
  }
}

/* ── Single lead section (each on its own page-break group) ── */
function PDFLeadSection({ lead, index, showSectionBar }: { lead: LeadEntry; index: number; showSectionBar?: boolean }) {
  const statusLabel =
    lead.status === "missed-opportunity"
      ? "Missed Opportunity"
      : lead.status === "at-risk"
        ? "At-Risk"
        : "Best Practice";

  const statusLine = lead.statusDetail
    ? `${statusLabel} (${lead.statusDetail})`
    : statusLabel;

  return (
    <View style={styles.leadCard} break>
      {/* Section bar above first lead */}
      {showSectionBar && <SectionBar title="Full Lead Breakdown" />}
      {/* Header bar (color-coded by status) */}
      <View style={[styles.leadHeader, getLeadHeaderStyle(lead.status)]}>
        <Text style={styles.leadName}>
          {index + 1}) {lead.name} | {lead.phone}
        </Text>
        <Text style={[styles.leadStatusText, getLeadStatusStyle(lead.status)]}>
          {statusLine}
        </Text>
      </View>

      {/* Body (border color matches status) */}
      <View style={[styles.leadBody, getLeadBodyStyle(lead.status)]}>
        {/* Opportunity Summary */}
        <Text style={styles.subLabel}>Opportunity Summary</Text>
        <Text style={styles.leadText}>{lead.executiveSummary}</Text>

        {/* Timeline of Contact */}
        {lead.timeline.length > 0 && lead.timeline[0].date && (
          <View>
            <Text style={styles.subLabel}>Timeline of Contact</Text>
            {lead.timeline.map((entry, i) => (
              <View style={styles.timelineBullet} key={i}>
                <Text style={styles.timelineDot}>•</Text>
                <Text style={styles.timelineText}>
                  {entry.date} - {entry.event}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Inflection Point */}
        {lead.inflectionPoint && (
          <View>
            <Text style={styles.subLabel}>Inflection Point</Text>
            <Text style={styles.leadText}>{lead.inflectionPoint}</Text>
          </View>
        )}

        {/* What Should Have Happened */}
        {lead.whatToDoNext && (
          <View>
            <Text style={styles.subLabel}>What Should Have Happened</Text>
            <Text style={styles.leadText}>{lead.whatToDoNext}</Text>
          </View>
        )}

        {/* Best Practice (callout box with left accent border) */}
        {lead.bestPracticeQuote && (
          <View style={styles.bestPracticeCallout}>
            <Text style={styles.bestPracticeLabel}>Best Practice</Text>
            <Text style={styles.bestPracticeText}>{lead.bestPracticeQuote}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/* ── Distribution table ── */
function PDFDistributionTable({ data }: { data: AuditReportData }) {
  const d = data.overallDistribution;
  const rows = [
    { label: "Missed Opportunity", count: String(d.missedOpportunity), meaning: d.missedOpportunityMeaning },
    { label: "At-Risk", count: String(d.atRisk), meaning: d.atRiskMeaning },
    { label: "Best Practice", count: String(d.bestPractice), meaning: d.bestPracticeMeaning },
  ];

  return (
    <View>
      <View style={styles.distHeaderRow}>
        <Text style={[styles.distHeaderCell, { width: "30%" }]}>Outcome</Text>
        <Text style={[styles.distHeaderCell, { width: "12%" }]}>Count</Text>
        <Text style={[styles.distHeaderCell, { width: "58%" }]}>Executive Meaning</Text>
      </View>
      {rows.map((row, i) => (
        <View style={styles.distRow} key={i}>
          <Text style={styles.distLabel}>{row.label}</Text>
          <Text style={styles.distCount}>{row.count}</Text>
          <Text style={styles.distMeaning}>{row.meaning}</Text>
        </View>
      ))}
    </View>
  );
}

/* ── Parse executive summary into paragraphs, bullets, and closing ── */
function parseExecutiveSummary(text: string) {
  const lines = (text || "").split("\n").filter(Boolean);
  const paragraphs: string[] = [];
  const bullets: string[] = [];
  const closingParagraphs: string[] = [];
  let pastBullets = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-•*]\s/.test(trimmed)) {
      bullets.push(trimmed.replace(/^[-•*]\s*/, ""));
      pastBullets = true;
    } else if (pastBullets) {
      closingParagraphs.push(trimmed);
    } else {
      paragraphs.push(trimmed);
    }
  }

  return { paragraphs, bullets, closingParagraphs };
}

/* ── Parse communication summary into paragraphs and bullets ── */
function parseWithBullets(text: string) {
  const lines = (text || "").split("\n").filter(Boolean);
  const parts: Array<{ type: "text" | "bullet"; content: string }> = [];

  // If no newlines, try splitting on sentence-starting bullets
  if (lines.length === 1) {
    // Check for inline bullet patterns
    const segments = text.split(/(?=(?:Customers|Too many|When a|The result|In short))/);
    if (segments.length > 1) {
      for (const seg of segments) {
        const trimmed = seg.trim();
        if (trimmed) {
          // Sentences starting with these patterns get bullets
          if (/^(Customers|Too many|When a|The result)/.test(trimmed)) {
            parts.push({ type: "bullet", content: trimmed });
          } else {
            parts.push({ type: "text", content: trimmed });
          }
        }
      }
      return parts;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-•*]\s/.test(trimmed)) {
      parts.push({ type: "bullet", content: trimmed.replace(/^[-•*]\s*/, "") });
    } else {
      parts.push({ type: "text", content: trimmed });
    }
  }
  return parts;
}

/* ── Main PDF Document ── */
export function OpportunityAuditPDF({ data }: { data: AuditReportData }) {
  const { paragraphs: summaryParagraphs, bullets: summaryBullets, closingParagraphs } =
    parseExecutiveSummary(data.executiveSummary);

  // Split forward focus into bullet items vs paragraph
  const forwardFocusBullets = data.forwardFocus.filter((f) => f.title);
  const forwardFocusParagraph = data.forwardFocus
    .filter((f) => !f.title && f.description)
    .map((f) => f.description)
    .join(" ");

  // Parse communication summary for bullets
  const commParts = parseWithBullets(data.communicationSummary);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <PDFHeader data={data} />
        <PDFFooter dealershipName={data.dealershipName} />

        {/* ── Page title + metadata table ── */}
        <Text style={styles.pageTitle}>
          {data.dealershipName} - Opportunity Execution{"\n"}Audit
        </Text>

        <PDFMetadataTable data={data} />

        {/* ── Executive Summary ── */}
        <SectionBar title="Executive Summary" />
        {summaryParagraphs.length > 0 && (
          <Text style={styles.bodyText}>{summaryParagraphs.join("\n\n")}</Text>
        )}
        {summaryBullets.length > 0 && (
          <View style={styles.bulletWrap}>
            {summaryBullets.map((bullet, i) => (
              <View style={styles.bulletItem} key={i}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        )}
        {closingParagraphs.length > 0 && (
          <Text style={styles.closingParagraph}>
            {closingParagraphs.join("\n\n")}
          </Text>
        )}

        {/* ── Performance Snapshot ── */}
        <SectionBar
          title={
            data.sourceReviewed
              ? `${data.sourceReviewed} Performance Snapshot`
              : "Performance Snapshot"
          }
        />
        <PDFPerformanceTable data={data} />

        {/* ── Executive Interpretation (new page) ── */}
        <View break>
          <Text style={styles.sectionHeading}>Executive Interpretation</Text>
          <Text style={styles.bodyText}>{data.executiveInterpretation}</Text>

          {/* ── Additional Store Note ── */}
          {data.additionalStoreNote && (
            <View style={styles.noteBox}>
              <Text style={styles.noteLabel}>
                Additional Store{"\n"}Note
              </Text>
              <Text style={styles.noteText}>{data.additionalStoreNote}</Text>
            </View>
          )}

          {/* ── Lead Status Definitions ── */}
          <SectionBar title="Lead Status Definitions" />
          <LeadStatusDefinitions />
        </View>

        {/* ── Full Lead Breakdown + leads ── */}
        {data.leads.map((lead, i) => (
          <PDFLeadSection key={lead.id} lead={lead} index={i} showSectionBar={i === 0} />
        ))}

        {/* ── Overall Lead Distribution (new page after leads) ── */}
        <View break>
          <SectionBar title="Overall Lead Distribution" />
          <PDFDistributionTable data={data} />
        </View>

        {/* ── Communication Summary ── */}
        {data.communicationSummary && (
          <View>
            <Text style={styles.sectionHeading}>
              Communication Summary Across All Leads
            </Text>
            {commParts.map((part, i) =>
              part.type === "bullet" ? (
                <View style={styles.bulletItem} key={i}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{part.content}</Text>
                </View>
              ) : (
                <Text style={styles.bodyText} key={i}>{part.content}</Text>
              )
            )}
          </View>
        )}

        {/* ── Final Executive Takeaway (new page) ── */}
        <View break>
          <SectionBar title="Final Executive Takeaway" />
          <Text style={styles.bodyText}>{data.finalExecutiveTakeaway}</Text>
        </View>

        {/* ── The Critical Training Focus Areas ── */}
        {forwardFocusBullets.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>
              The {forwardFocusBullets.length} Critical Training Focus Area{forwardFocusBullets.length !== 1 ? "s" : ""}
            </Text>
            {forwardFocusBullets.map((item, i) => (
              <View style={styles.focusBullet} key={i}>
                <Text style={styles.focusDot}>•</Text>
                <Text style={styles.focusText}>
                  <Text style={styles.focusBold}>{item.title}</Text>
                  {item.description ? ` - ${item.description}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Forward Focus (paragraph) ── */}
        {forwardFocusParagraph && (
          <View>
            <Text style={styles.sectionHeading}>Forward Focus</Text>
            <Text style={styles.bodyText}>{forwardFocusParagraph}</Text>
          </View>
        )}

        {/* ── Closing Summary ── */}
        <Text style={styles.sectionHeading}>Closing Summary</Text>
        <Text style={styles.bodyText}>{data.closingSummary}</Text>
      </Page>
    </Document>
  );
}
