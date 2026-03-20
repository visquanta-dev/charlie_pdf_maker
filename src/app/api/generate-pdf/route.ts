import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { OpportunityAuditPDF } from "@/components/pdf/templates/opportunity-audit/OpportunityAuditPDF";
import type { AuditReportData } from "@/lib/types/audit";
import React from "react";

export async function POST(request: NextRequest) {
  try {
    const data: AuditReportData = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = React.createElement(OpportunityAuditPDF, { data }) as any;
    const buffer = await renderToBuffer(element);

    const uint8 = new Uint8Array(buffer);
    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.dealershipName || "Audit"}-Report.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
