import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles, colors } from "./styles";
import { maskPhone } from "@/lib/brand";
import type { AuditReportData, LeadEntry, LeadStatus } from "@/lib/types/audit";

const statusConfig: Record<LeadStatus, { bg: string; label: string }> = {
  "missed-opportunity": { bg: colors.danger, label: "MISSED OPPORTUNITY" },
  "at-risk": { bg: colors.warning, label: "AT-RISK" },
  "best-practice": { bg: colors.success, label: "BEST PRACTICE" },
};

function PDFHeader({ data }: { data: AuditReportData }) {
  return (
    <View style={styles.header}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>V</Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.dealershipName}>{data.dealershipName}</Text>
        <Text style={styles.dealershipLocation}>{data.dealershipLocation}</Text>
        <Text style={styles.auditPeriod}>Audit Period: {data.auditPeriod}</Text>
      </View>
    </View>
  );
}

function PDFFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        Confidential — Prepared by Visquanta
      </Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}

function PDFPerformanceTable({ data }: { data: AuditReportData }) {
  const m = data.performanceMetrics;
  const rows = [
    ["1st Contacts", String(m.firstContacts)],
    ["Total Contacted", String(m.totalContacted)],
    ["Replied", String(m.replied)],
    ["Reply Rate", m.replyRate],
    ["Opportunities Created", String(m.opportunitiesCreated)],
    ["Opportunity Rate", m.opportunityRate],
  ];

  return (
    <View>
      {rows.map(([label, value], i) => (
        <View style={styles.metricsRow} key={i}>
          <Text style={styles.metricsLabel}>{label}</Text>
          <Text style={styles.metricsValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function PDFLeadSection({ lead, index }: { lead: LeadEntry; index: number }) {
  const sc = statusConfig[lead.status];

  return (
    <View wrap={false} style={{ marginBottom: 12 }}>
      <View style={styles.leadHeader}>
        <Text style={styles.leadName}>
          {index + 1}. {lead.name}
        </Text>
        <View style={{ ...styles.statusBadge, backgroundColor: sc.bg }}>
          <Text style={{ color: "#FFFFFF", fontSize: 8, fontFamily: "Helvetica-Bold" }}>
            {sc.label}
          </Text>
        </View>
        <Text style={{ fontSize: 9, color: colors.mediumGray, marginLeft: 8 }}>
          {maskPhone(lead.phone)}
        </Text>
      </View>

      <Text style={styles.bodyText}>{lead.executiveSummary}</Text>

      {/* Timeline */}
      {lead.timeline.length > 0 && lead.timeline[0].date && (
        <View>
          <Text style={styles.subLabel}>Timeline</Text>
          {lead.timeline.map((entry, i) => (
            <View style={styles.timelineEntry} key={i}>
              <Text style={styles.timelineDate}>{entry.date}</Text>
              <Text style={styles.timelineEvent}>{entry.event}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Inflection Point */}
      {lead.inflectionPoint && (
        <View>
          <Text style={styles.subLabel}>Inflection Point</Text>
          <Text style={styles.bodyText}>{lead.inflectionPoint}</Text>
        </View>
      )}

      {/* What Worked Well */}
      {lead.whatWorkedWell.filter(Boolean).length > 0 && (
        <View>
          <Text style={styles.subLabel}>What Worked Well</Text>
          {lead.whatWorkedWell.filter(Boolean).map((item, i) => (
            <View style={styles.bulletItem} key={i}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Missed Opportunities */}
      {lead.missedOpportunities.filter(Boolean).length > 0 && (
        <View>
          <Text style={styles.subLabel}>Missed Opportunities</Text>
          {lead.missedOpportunities.filter(Boolean).map((item, i) => (
            <View style={styles.bulletItem} key={i}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {/* What To Do Next */}
      {lead.whatToDoNext && (
        <View>
          <Text style={styles.subLabel}>What To Do Next</Text>
          <Text style={styles.bodyText}>{lead.whatToDoNext}</Text>
        </View>
      )}

      {/* Best Practice Quote */}
      {lead.bestPracticeQuote && (
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>"{lead.bestPracticeQuote}"</Text>
        </View>
      )}
    </View>
  );
}

export function OpportunityAuditPDF({ data }: { data: AuditReportData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader data={data} />
        <PDFFooter />

        {/* Title */}
        <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: colors.primary, marginBottom: 4 }}>
          Opportunity Execution Audit
        </Text>

        {/* Executive Summary */}
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.bodyText}>{data.executiveSummary}</Text>

        {/* Performance Snapshot */}
        <Text style={styles.sectionTitle}>Performance Snapshot</Text>
        <PDFPerformanceTable data={data} />

        {/* Executive Interpretation */}
        <Text style={styles.sectionTitle}>Executive Interpretation</Text>
        <Text style={styles.bodyText}>{data.executiveInterpretation}</Text>

        {/* Lead Breakdown */}
        <Text style={styles.sectionTitle}>
          Lead Breakdown ({data.leads.length} Leads)
        </Text>
        {data.leads.map((lead, i) => (
          <PDFLeadSection key={lead.id} lead={lead} index={i} />
        ))}

        {/* Overall Distribution */}
        <Text style={styles.sectionTitle}>Overall Distribution</Text>
        <View style={styles.distributionRow}>
          <View style={styles.distributionItem}>
            <Text style={[styles.distributionCount, { color: colors.danger }]}>
              {data.overallDistribution.missedOpportunity}
            </Text>
            <Text style={styles.distributionLabel}>Missed Opportunity</Text>
          </View>
          <View style={styles.distributionItem}>
            <Text style={[styles.distributionCount, { color: colors.warning }]}>
              {data.overallDistribution.atRisk}
            </Text>
            <Text style={styles.distributionLabel}>At-Risk</Text>
          </View>
          <View style={styles.distributionItem}>
            <Text style={[styles.distributionCount, { color: colors.success }]}>
              {data.overallDistribution.bestPractice}
            </Text>
            <Text style={styles.distributionLabel}>Best Practice</Text>
          </View>
        </View>

        {/* Final Executive Takeaway */}
        <Text style={styles.sectionTitle}>Final Executive Takeaway</Text>
        <Text style={styles.bodyText}>{data.finalExecutiveTakeaway}</Text>

        {/* Forward Focus */}
        <Text style={styles.sectionTitle}>Forward Focus</Text>
        {data.forwardFocus.map((item, i) => (
          <View style={styles.focusItem} key={i}>
            <Text style={styles.focusTitle}>
              {i + 1}. {item.title}
            </Text>
            <Text style={styles.focusDescription}>{item.description}</Text>
          </View>
        ))}

        {/* Closing Summary */}
        <Text style={styles.sectionTitle}>Closing Summary</Text>
        <Text style={styles.bodyText}>{data.closingSummary}</Text>
      </Page>
    </Document>
  );
}
