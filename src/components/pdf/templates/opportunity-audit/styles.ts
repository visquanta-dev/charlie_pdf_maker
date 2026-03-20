import { StyleSheet } from "@react-pdf/renderer";

const colors = {
  primary: "#1B2A4A",
  accent: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  lightGray: "#F3F4F6",
  mediumGray: "#9CA3AF",
  darkGray: "#374151",
  white: "#FFFFFF",
  black: "#111827",
};

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 40,
    color: colors.black,
    backgroundColor: colors.white,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  logoBox: {
    width: 44,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  dealershipName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  dealershipLocation: {
    fontSize: 9,
    color: colors.mediumGray,
    marginTop: 2,
  },
  auditPeriod: {
    fontSize: 9,
    color: colors.accent,
    marginTop: 2,
  },
  // Section
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: colors.darkGray,
    marginBottom: 8,
  },
  // Metrics table
  metricsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingVertical: 6,
  },
  metricsLabel: {
    width: "50%",
    fontSize: 10,
    color: colors.darkGray,
  },
  metricsValue: {
    width: "50%",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
    textAlign: "right",
  },
  // Lead section
  leadHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 6,
  },
  leadName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  statusBadge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  statusMissed: { backgroundColor: colors.danger },
  statusAtRisk: { backgroundColor: colors.warning },
  statusBestPractice: { backgroundColor: colors.success },
  // Timeline
  timelineEntry: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 8,
  },
  timelineDate: {
    width: 90,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.darkGray,
  },
  timelineEvent: {
    flex: 1,
    fontSize: 9,
    color: colors.darkGray,
  },
  // Bullet lists
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 12,
    fontSize: 9,
    color: colors.accent,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: colors.darkGray,
  },
  // Quote
  quoteBox: {
    backgroundColor: colors.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    marginTop: 6,
    marginBottom: 6,
  },
  quoteText: {
    fontSize: 9,
    fontStyle: "italic",
    color: colors.darkGray,
    lineHeight: 1.4,
  },
  // Sub labels
  subLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginTop: 6,
    marginBottom: 3,
  },
  // Distribution
  distributionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  distributionItem: {
    alignItems: "center",
  },
  distributionCount: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
  },
  distributionLabel: {
    fontSize: 8,
    color: colors.mediumGray,
    marginTop: 2,
  },
  // Forward focus
  focusItem: {
    marginBottom: 6,
  },
  focusTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  focusDescription: {
    fontSize: 9,
    color: colors.darkGray,
    marginTop: 2,
    lineHeight: 1.4,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: colors.mediumGray,
  },
  pageNumber: {
    fontSize: 7,
    color: colors.mediumGray,
  },
});

export { colors };
