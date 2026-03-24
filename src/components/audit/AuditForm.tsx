"use client";

import { useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LeadCard } from "./LeadCard";
import { PasteImport } from "./PasteImport";
import type {
  AuditReportData,
  LeadEntry,
  ForwardFocusItem,
} from "@/lib/types/audit";

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

function createEmptyReport(): AuditReportData {
  return {
    dealershipName: "",
    dealershipLocation: "",
    auditPeriod: "",
    sourceReviewed: "",
    audience: "",
    executiveSummary: "",
    performanceMetrics: {
      firstContacts: 0,
      firstContactsRead: "",
      totalContacted: 0,
      totalContactedRead: "",
      replied: 0,
      repliedRead: "",
      replyRate: "0%",
      replyRateRead: "",
      opportunitiesCreated: 0,
      opportunitiesCreatedRead: "",
      opportunityRate: "0%",
      opportunityRateRead: "",
    },
    executiveInterpretation: "",
    additionalStoreNote: "",
    leads: [createEmptyLead()],
    overallDistribution: {
      missedOpportunity: 0,
      missedOpportunityMeaning: "",
      atRisk: 0,
      atRiskMeaning: "",
      bestPractice: 0,
      bestPracticeMeaning: "",
    },
    communicationSummary: "",
    finalExecutiveTakeaway: "",
    forwardFocus: [{ title: "", description: "" }],
    closingSummary: "",
  };
}

type Action =
  | { type: "SET_FIELD"; field: string; value: string | number }
  | { type: "SET_METRIC"; field: string; value: string | number }
  | { type: "SET_DISTRIBUTION"; field: string; value: string | number }
  | { type: "SET_LEADS"; leads: LeadEntry[] }
  | { type: "ADD_LEAD" }
  | { type: "REMOVE_LEAD"; index: number }
  | { type: "UPDATE_LEAD"; index: number; lead: LeadEntry }
  | { type: "ADD_FORWARD_FOCUS" }
  | { type: "REMOVE_FORWARD_FOCUS"; index: number }
  | { type: "UPDATE_FORWARD_FOCUS"; index: number; item: ForwardFocusItem }
  | { type: "REPLACE_ALL"; data: AuditReportData };

function computeDistribution(leads: LeadEntry[], current: AuditReportData["overallDistribution"]) {
  return {
    missedOpportunity: leads.filter((l) => l.status === "missed-opportunity").length,
    missedOpportunityMeaning: current.missedOpportunityMeaning,
    atRisk: leads.filter((l) => l.status === "at-risk").length,
    atRiskMeaning: current.atRiskMeaning,
    bestPractice: leads.filter((l) => l.status === "best-practice").length,
    bestPracticeMeaning: current.bestPracticeMeaning,
  };
}

function reducer(state: AuditReportData, action: Action): AuditReportData {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_METRIC":
      return {
        ...state,
        performanceMetrics: {
          ...state.performanceMetrics,
          [action.field]: action.value,
        },
      };
    case "SET_DISTRIBUTION":
      return {
        ...state,
        overallDistribution: {
          ...state.overallDistribution,
          [action.field]: action.value,
        },
      };
    case "SET_LEADS": {
      const leads = action.leads;
      return { ...state, leads, overallDistribution: computeDistribution(leads, state.overallDistribution) };
    }
    case "ADD_LEAD": {
      const leads = [...state.leads, createEmptyLead()];
      return { ...state, leads, overallDistribution: computeDistribution(leads, state.overallDistribution) };
    }
    case "REMOVE_LEAD": {
      const leads = state.leads.filter((_, i) => i !== action.index);
      return { ...state, leads, overallDistribution: computeDistribution(leads, state.overallDistribution) };
    }
    case "UPDATE_LEAD": {
      const leads = state.leads.map((l, i) =>
        i === action.index ? action.lead : l
      );
      return { ...state, leads, overallDistribution: computeDistribution(leads, state.overallDistribution) };
    }
    case "ADD_FORWARD_FOCUS":
      return {
        ...state,
        forwardFocus: [...state.forwardFocus, { title: "", description: "" }],
      };
    case "REMOVE_FORWARD_FOCUS":
      return {
        ...state,
        forwardFocus: state.forwardFocus.filter((_, i) => i !== action.index),
      };
    case "UPDATE_FORWARD_FOCUS":
      return {
        ...state,
        forwardFocus: state.forwardFocus.map((f, i) =>
          i === action.index ? action.item : f
        ),
      };
    case "REPLACE_ALL":
      return action.data;
    default:
      return state;
  }
}

const metricFields = [
  { key: "firstContacts", readKey: "firstContactsRead", label: "1st Contacts", inputType: "number" },
  { key: "totalContacted", readKey: "totalContactedRead", label: "Total Contacted", inputType: "number" },
  { key: "replied", readKey: "repliedRead", label: "Replied", inputType: "number" },
  { key: "replyRate", readKey: "replyRateRead", label: "Reply Rate", inputType: "text" },
  { key: "opportunitiesCreated", readKey: "opportunitiesCreatedRead", label: "Opportunities Created", inputType: "number" },
  { key: "opportunityRate", readKey: "opportunityRateRead", label: "Opportunity Rate", inputType: "text" },
] as const;

export function AuditForm() {
  const [state, dispatch] = useReducer(reducer, null, createEmptyReport);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${state.dealershipName || "Audit"}-Report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to generate PDF. Check all fields are filled.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PasteImport
          onImport={(data) => dispatch({ type: "REPLACE_ALL", data })}
        />
        <Button onClick={handleDownload} disabled={downloading}>
          {downloading ? "Generating..." : "Download PDF"}
        </Button>
      </div>

      {/* Section: Dealership Info */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Dealership Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Dealership Name</Label>
            <Input
              value={state.dealershipName}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "dealershipName", value: e.target.value })
              }
              placeholder="Corwin Ford Nampa"
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={state.dealershipLocation}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "dealershipLocation", value: e.target.value })
              }
              placeholder="Nampa, ID"
            />
          </div>
          <div className="space-y-2">
            <Label>Audit Period</Label>
            <Input
              value={state.auditPeriod}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "auditPeriod", value: e.target.value })
              }
              placeholder="Last 30 Days"
            />
          </div>
          <div className="space-y-2">
            <Label>Source Reviewed</Label>
            <Input
              value={state.sourceReviewed}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "sourceReviewed", value: e.target.value })
              }
              placeholder="Instant Speed to Lead / AutoTrader"
            />
          </div>
          <div className="space-y-2">
            <Label>Audience</Label>
            <Input
              value={state.audience}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "audience", value: e.target.value })
              }
              placeholder="GM and Internet Director"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section: Executive Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={state.executiveSummary}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "executiveSummary", value: e.target.value })
            }
            rows={6}
            placeholder="Overall audit summary... Use bullet lines starting with - for bullet points in the PDF."
          />
        </CardContent>
      </Card>

      {/* Section: Performance Metrics */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Performance Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metricFields.map(({ key, readKey, label, inputType }) => (
            <div key={key} className="grid gap-3 sm:grid-cols-[200px_100px_1fr]">
              <Label className="self-center font-medium">{label}</Label>
              <Input
                type={inputType === "number" ? "number" : "text"}
                value={state.performanceMetrics[key as keyof typeof state.performanceMetrics]}
                onChange={(e) =>
                  dispatch({
                    type: "SET_METRIC",
                    field: key,
                    value: inputType === "number" ? Number(e.target.value) : e.target.value,
                  })
                }
                placeholder="Value"
              />
              <Input
                value={state.performanceMetrics[readKey as keyof typeof state.performanceMetrics] as string}
                onChange={(e) =>
                  dispatch({ type: "SET_METRIC", field: readKey, value: e.target.value })
                }
                placeholder="Executive Read (description)"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section: Executive Interpretation */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Executive Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={state.executiveInterpretation}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "executiveInterpretation", value: e.target.value })
            }
            rows={4}
            placeholder="Interpretation of performance metrics..."
          />
        </CardContent>
      </Card>

      {/* Section: Additional Store Note */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Additional Store Note (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={state.additionalStoreNote}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "additionalStoreNote", value: e.target.value })
            }
            rows={3}
            placeholder="Optional note displayed in a blue callout box..."
          />
        </CardContent>
      </Card>

      {/* Section: Leads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              Lead Breakdown ({state.leads.length})
            </h2>
            <div className="flex gap-2">
              <Badge variant="destructive">
                {state.overallDistribution.missedOpportunity} Missed
              </Badge>
              <Badge className="bg-amber-600 hover:bg-amber-700">
                {state.overallDistribution.atRisk} At-Risk
              </Badge>
              <Badge className="bg-emerald-600 hover:bg-emerald-700">
                {state.overallDistribution.bestPractice} Best Practice
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: "ADD_LEAD" })}
          >
            + Add Lead
          </Button>
        </div>
        {state.leads.map((lead, i) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            index={i}
            onUpdate={(updated) =>
              dispatch({ type: "UPDATE_LEAD", index: i, lead: updated })
            }
            onRemove={() => dispatch({ type: "REMOVE_LEAD", index: i })}
          />
        ))}
      </div>

      <Separator />

      {/* Section: Distribution Meanings */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Distribution Executive Meanings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Missed Opportunity Meaning</Label>
            <Textarea
              value={state.overallDistribution.missedOpportunityMeaning}
              onChange={(e) =>
                dispatch({ type: "SET_DISTRIBUTION", field: "missedOpportunityMeaning", value: e.target.value })
              }
              rows={2}
              placeholder="Most losses occurred at execution moments after solid initial engagement."
            />
          </div>
          <div className="space-y-2">
            <Label>At-Risk Meaning</Label>
            <Textarea
              value={state.overallDistribution.atRiskMeaning}
              onChange={(e) =>
                dispatch({ type: "SET_DISTRIBUTION", field: "atRiskMeaning", value: e.target.value })
              }
              rows={2}
              placeholder="One lead included a compliance issue..."
            />
          </div>
          <div className="space-y-2">
            <Label>Best Practice Meaning</Label>
            <Textarea
              value={state.overallDistribution.bestPracticeMeaning}
              onChange={(e) =>
                dispatch({ type: "SET_DISTRIBUTION", field: "bestPracticeMeaning", value: e.target.value })
              }
              rows={2}
              placeholder="The store is generating opportunity but not yet converting..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Section: Communication Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Communication Summary Across All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={state.communicationSummary}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "communicationSummary", value: e.target.value })
            }
            rows={4}
            placeholder="Summary of communication patterns across all leads..."
          />
        </CardContent>
      </Card>

      {/* Section: Final Executive Takeaway */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Final Executive Takeaway</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={state.finalExecutiveTakeaway}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "finalExecutiveTakeaway", value: e.target.value })
            }
            rows={4}
            placeholder="Final takeaway for dealership leadership..."
          />
        </CardContent>
      </Card>

      {/* Section: Critical Training Focus Areas */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Critical Training Focus Areas</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: "ADD_FORWARD_FOCUS" })}
          >
            + Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.forwardFocus.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Input
                  value={item.title}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FORWARD_FOCUS",
                      index: i,
                      item: { ...item, title: e.target.value },
                    })
                  }
                  placeholder="Focus area title (bold in PDF)"
                />
                <Textarea
                  value={item.description}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FORWARD_FOCUS",
                      index: i,
                      item: { ...item, description: e.target.value },
                    })
                  }
                  rows={2}
                  placeholder="Description (leave title empty for paragraph-only Forward Focus text)"
                />
              </div>
              {state.forwardFocus.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 text-destructive"
                  onClick={() =>
                    dispatch({ type: "REMOVE_FORWARD_FOCUS", index: i })
                  }
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section: Closing Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Closing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={state.closingSummary}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "closingSummary", value: e.target.value })
            }
            rows={4}
            placeholder="Closing summary paragraph..."
          />
        </CardContent>
      </Card>

      <div className="flex justify-end pb-8">
        <Button size="lg" onClick={handleDownload} disabled={downloading}>
          {downloading ? "Generating PDF..." : "Generate & Download PDF"}
        </Button>
      </div>
    </div>
  );
}
