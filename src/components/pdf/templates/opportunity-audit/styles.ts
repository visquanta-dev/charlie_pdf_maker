import { StyleSheet } from "@react-pdf/renderer";

const colors = {
  primary: "#111111",
  accent: "#F26E21",
  accentLight: "#FFF6EF",
  accentLighter: "#FFF2E9",
  success: "#10B981",
  successLight: "#ECFDF5",
  successBorder: "#A7F3D0",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  warningBorder: "#FDE68A",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  dangerBorder: "#FECACA",
  lightGray: "#F6F6F6",
  mediumGray: "#666666",
  darkGray: "#222222",
  white: "#FFFFFF",
  black: "#111111",
  blueNote: "#F2F6FF",
  borderGray: "#D1D5DB",
};

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    paddingTop: 76,
    paddingBottom: 50,
    paddingHorizontal: 50,
    color: colors.darkGray,
    backgroundColor: colors.white,
  },

  // ── Header (fixed banner on every page) ──
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 66,
    flexDirection: "row",
  },
  headerLeft: {
    width: "68%",
    height: 66,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 32,
    gap: 10,
  },
  headerLogo: {
    width: 38,
    height: 38,
  },
  headerLeftText: {
    gap: 2,
  },
  headerBrand: {
    color: colors.white,
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
  },
  headerSubtitle: {
    color: colors.white,
    fontSize: 8.3,
  },
  headerRight: {
    width: "32%",
    height: 66,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerDealerName: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  headerDealerSub: {
    color: colors.white,
    fontSize: 8.2,
    textAlign: "center",
    marginTop: 2,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 20,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7.7,
    color: colors.mediumGray,
  },
  pageNumber: {
    fontSize: 7.7,
    color: colors.mediumGray,
  },

  // ── Section title bar (orange bg, white text) ──
  sectionBar: {
    backgroundColor: colors.accent,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 14,
    marginBottom: 10,
  },
  sectionBarText: {
    color: colors.white,
    fontSize: 11.2,
    fontFamily: "Helvetica-Bold",
  },

  // ── Page title ──
  pageTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
    marginBottom: 8,
  },

  // ── Metadata table (bordered grid like Corwin) ──
  metaTable: {
    borderWidth: 0.5,
    borderColor: colors.borderGray,
    marginBottom: 6,
  },
  metaTableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderGray,
  },
  metaTableRowLast: {
    flexDirection: "row",
  },
  metaTableCell: {
    width: "50%",
    paddingVertical: 7,
    paddingHorizontal: 10,
    fontSize: 8.5,
    color: colors.darkGray,
  },
  metaTableCellRight: {
    width: "50%",
    paddingVertical: 7,
    paddingHorizontal: 10,
    fontSize: 8.5,
    color: colors.darkGray,
    borderLeftWidth: 0.5,
    borderLeftColor: colors.borderGray,
  },

  // ── Body text ──
  bodyText: {
    fontSize: 9.2,
    lineHeight: 1.45,
    color: colors.darkGray,
    marginBottom: 6,
  },

  // ── Bullet lists (executive summary bullets) ──
  bulletItem: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 16,
  },
  bulletDot: {
    width: 14,
    fontSize: 9.2,
    color: "#000000",
  },
  bulletText: {
    flex: 1,
    fontSize: 9.2,
    color: "#000000",
    lineHeight: 1.4,
  },
  bulletWrap: {
    marginTop: 4,
    marginBottom: 6,
  },

  // ── Closing paragraph after bullets ──
  closingParagraph: {
    fontSize: 9.2,
    lineHeight: 1.45,
    color: colors.darkGray,
    marginTop: 4,
    marginBottom: 6,
  },

  // ── Performance metrics table ──
  metricsHeaderRow: {
    flexDirection: "row",
    backgroundColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  metricsHeaderCell: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
  },
  metricsRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  metricsRowAlt: {
    backgroundColor: colors.lightGray,
  },
  metricsLabel: {
    width: "25%",
    fontSize: 8.7,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
  },
  metricsValue: {
    width: "12%",
    fontSize: 10.2,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
  },
  metricsRead: {
    width: "63%",
    fontSize: 8.6,
    color: colors.darkGray,
  },

  // ── Additional store note (gray bg, bordered) ──
  noteBox: {
    backgroundColor: colors.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: colors.borderGray,
  },
  noteLabel: {
    width: 130,
    fontSize: 9.2,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
  },
  noteText: {
    flex: 1,
    fontSize: 8.5,
    color: colors.darkGray,
    lineHeight: 1.4,
  },

  // ── Lead status definitions table ──
  defRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  defLabel: {
    width: 130,
    fontSize: 8.7,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
  },
  defText: {
    flex: 1,
    fontSize: 8.9,
    color: colors.darkGray,
    lineHeight: 1.35,
  },

  // ── Lead card (bordered like Corwin) ──
  leadCard: {
    marginBottom: 14,
  },
  leadHeader: {
    backgroundColor: colors.accentLight,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopColor: colors.borderGray,
    borderLeftColor: colors.borderGray,
    borderRightColor: colors.borderGray,
  },
  leadName: {
    fontSize: 10.8,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
  },
  leadStatusText: {
    fontSize: 8.7,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
    textAlign: "right",
    maxWidth: 180,
  },
  leadBody: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.borderGray,
    borderTopWidth: 0,
  },

  // ── Lead sub-labels (orange) ──
  subLabel: {
    fontSize: 8.6,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
    marginTop: 8,
    marginBottom: 4,
  },

  // ── Lead body text ──
  leadText: {
    fontSize: 8.5,
    color: colors.darkGray,
    lineHeight: 1.4,
    marginBottom: 4,
  },

  // ── Timeline bullets in leads ──
  timelineBullet: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 4,
  },
  timelineDot: {
    width: 14,
    fontSize: 9.2,
    color: "#000000",
  },
  timelineText: {
    flex: 1,
    fontSize: 9.2,
    color: "#000000",
    lineHeight: 1.3,
  },

  // ── Distribution table ──
  distHeaderRow: {
    flexDirection: "row",
    backgroundColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  distHeaderCell: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
  },
  distRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  distLabel: {
    width: "30%",
    fontSize: 8.7,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
  },
  distCount: {
    width: "12%",
    fontSize: 10.2,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
  },
  distMeaning: {
    width: "58%",
    fontSize: 8.6,
    color: colors.darkGray,
    lineHeight: 1.35,
  },

  // ── Section heading (bold black, not orange bar) ──
  sectionHeading: {
    fontSize: 11.2,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
    marginTop: 14,
    marginBottom: 8,
  },

  // ── Forward focus / training ──
  focusBullet: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 4,
  },
  focusDot: {
    width: 14,
    fontSize: 9.2,
    color: "#000000",
  },
  focusText: {
    flex: 1,
    fontSize: 9.2,
    color: "#000000",
    lineHeight: 1.4,
  },
  focusBold: {
    fontSize: 9.2,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
  },

  // ── Best Practice callout box (left-border accent) ──
  bestPracticeCallout: {
    marginTop: 8,
    paddingLeft: 10,
    paddingVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  bestPracticeLabel: {
    fontSize: 8.2,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bestPracticeText: {
    fontSize: 8.8,
    fontFamily: "Helvetica-Oblique",
    color: colors.darkGray,
    lineHeight: 1.4,
  },

  // ── Status-colored lead headers ──
  leadHeaderBestPractice: {
    backgroundColor: colors.successLight,
    borderTopColor: colors.successBorder,
    borderLeftColor: colors.successBorder,
    borderRightColor: colors.successBorder,
  },
  leadStatusBestPractice: {
    color: colors.success,
  },
  leadHeaderMissedOpportunity: {
    backgroundColor: colors.warningLight,
    borderTopColor: colors.warningBorder,
    borderLeftColor: colors.warningBorder,
    borderRightColor: colors.warningBorder,
  },
  leadStatusMissedOpportunity: {
    color: colors.warning,
  },
  leadHeaderAtRisk: {
    backgroundColor: colors.dangerLight,
    borderTopColor: colors.dangerBorder,
    borderLeftColor: colors.dangerBorder,
    borderRightColor: colors.dangerBorder,
  },
  leadStatusAtRisk: {
    color: colors.danger,
  },
  leadBodyBestPractice: {
    borderColor: colors.successBorder,
  },
  leadBodyMissedOpportunity: {
    borderColor: colors.warningBorder,
  },
  leadBodyAtRisk: {
    borderColor: colors.dangerBorder,
  },
});

export { colors };
